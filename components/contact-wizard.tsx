'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { sendContactMessage } from '../actions'
import { StartNowButton } from './start-now-button'
import { X, Minus, Maximize2 } from 'lucide-react'

export function ContactWizard() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [wasMaximized, setWasMaximized] = useState(false);
  const [position, setPosition] = useState(() => ({
    x: typeof window !== 'undefined' ? (window.innerWidth - 800) / 2 : 0,
    y: typeof window !== 'undefined' ? (window.innerHeight - 500) / 2 : 0
  }))
  const [preMinimizePosition, setPreMinimizePosition] = useState({ x: 0, y: 0 });
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    intent: '',
    projectType: '',
    learningExperience: '',
    projectGoal: '',
    timeline: '',
    budget: '',
    message: ''
  })
  const [showThankYou, setShowThankYou] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [wizardTitle, setWizardTitle] = useState("Let's Work Together")
  const [progressSteps, setProgressSteps] = useState<string[]>([
    'Choose Intent',
    'Basic Information',
    'Experience Level',
    'Project Details',
    'Timeline & Budget',
    'Additional Info'
  ]);
  const dialogRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartPos = useRef({ x: 0, y: 0 })

  // Removed useEffect hook for saving partial info

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (name === 'intent') {
      setWizardTitle(value === 'learn' ? "Let's Start Your Learning Journey" : "Let's Work on Your Project")
      if (value === 'learn') {
        setProgressSteps([
          'Choose Intent',
          'Basic Information',
          'Experience Level',
          'Learning Focus',
          'Time Commitment',
          'Goals & Interests'
        ]);
      } else {
        setProgressSteps([
          'Choose Intent',
          'Basic Information',
          'Project Type',
          'Project Goals',
          'Timeline & Budget',
          'Project Details'
        ]);
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        const index = Array.prototype.indexOf.call(form, e.currentTarget);
        const nextElement = form.elements[index + 1] as HTMLElement;
        if (nextElement) {
          nextElement.focus();
        } else {
          if (step === 1 && formData.name && formData.email) nextStep();
          else if (step === 2 && formData.projectType) nextStep();
          else if (step === 3 && formData.message) handleSubmit(new Event('submit') as React.FormEvent);
          else if (step === 4 && (formData.budget || formData.timeline)) nextStep();
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formDataToSend = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value)
    })

    try {
      const result = await sendContactMessage(formDataToSend)
      if (result.error) {
        toast.error(result.error)
      } else {
        setShowThankYou(true)
        toast.success('Message sent successfully!')
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => setStep(prev => prev + 1)
  const prevStep = () => setStep(prev => prev - 1)

  const resetForm = () => {
    setIsOpen(false)
    setIsMinimized(false)
    setIsMaximized(false)
    setStep(0)
    setFormData({ name: '', email: '', intent: '', projectType: '', learningExperience: '', projectGoal: '', timeline: '', budget: '', message: '' })
    setShowThankYou(false)
    setIsSubmitting(false)
    setWizardTitle("Let's Work Together")
  }

  const handleMinimize = () => {
    setPreMinimizePosition(position);
    setWasMaximized(isMaximized);
    setIsMinimized(true);
    setIsMaximized(false);
    setPosition({ x: window.innerWidth - 120, y: window.innerHeight - 40 });
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized)
    setIsMinimized(false)
    if (!isMaximized) {
      setPosition({ x: 0, y: 0 })
    }
  }

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (dialogRef.current && !isMaximized) {
      const rect = dialogRef.current.getBoundingClientRect()
      dragStartPos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      setIsDragging(true)
    }
  }, [isMaximized])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && dialogRef.current && !isMaximized) {
      const newX = e.clientX - dragStartPos.current.x
      const newY = e.clientY - dragStartPos.current.y

      // Constrain the dialog position to prevent it from moving off-screen
      const maxX = window.innerWidth - dialogRef.current.offsetWidth
      const maxY = window.innerHeight - dialogRef.current.offsetHeight
      const constrainedX = Math.max(0, Math.min(newX, maxX))
      const constrainedY = Math.max(0, Math.min(newY, maxY))

      setPosition({ x: constrainedX, y: constrainedY })
    }
  }, [isDragging, isMaximized])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  return (
    <>
      {!isOpen && !isMinimized && (
        <StartNowButton onClick={() => setIsOpen(true)} />
      )}

      {isMinimized && (
        <Button
          onClick={() => {
            setIsMinimized(false);
            setIsOpen(true);
            if (wasMaximized) {
              setIsMaximized(true);
              setPosition({ x: 0, y: 0 });
            } else {
              setPosition(preMinimizePosition);
            }
          }}
          className="fixed z-50 transition-all duration-300 ease-in-out bottom-4 right-4"
        >
          <span className="animate-pulse">Continue...</span>
        </Button>
      )}

      {isOpen && !isMinimized && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            ref={dialogRef}
            style={{
              position: 'fixed',
              top: isMaximized ? 0 : `${position.y}px`,
              left: isMaximized ? 0 : `${position.x}px`,
              width: isMaximized ? '100%' : 'auto',
              height: isMaximized ? '100%' : 'auto',
              minHeight: '400px',
              transition: isDragging ? 'none' : 'all 0.3s ease-in-out',
            }}
            className={`bg-background border-2 border-foreground rounded-lg ${
              isMaximized ? 'fixed inset-0 flex flex-col' : 'w-[800px] h-[500px]'
            }`}
          >
            <div
              className="flex justify-between items-center p-2 border-b border-foreground cursor-move"
              onMouseDown={handleMouseDown}
            >
              <h2 className="text-lg font-bold">{wizardTitle}</h2>
              <div className="flex space-x-2">
                <Button
                  onClick={handleMinimize}
                  variant="outline"
                  size="icon"
                  className="rounded-full hover:bg-muted w-6 h-6 p-0"
                >
                  <Minus className="h-3 w-3" />
                  <span className="sr-only">Minimize</span>
                </Button>
                <Button
                  onClick={handleMaximize}
                  variant="outline"
                  size="icon"
                  className="rounded-full hover:bg-muted w-6 h-6 p-0"
                >
                  <Maximize2 className="h-3 w-3" />
                  <span className="sr-only">Maximize</span>
                </Button>
                <Button
                  onClick={resetForm}
                  variant="outline"
                  size="icon"
                  className="rounded-full hover:bg-destructive hover:text-destructive-foreground w-6 h-6 p-0"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            </div>
            <div className={`p-6 overflow-y-auto flex-grow ${isMaximized ? 'flex' : 'grid grid-cols-[250px,1fr]'} gap-8`}>
              {(!isMaximized || (isMaximized && window.innerWidth >= 768)) && (
                <div className={`hidden md:flex flex-col ${isMaximized ? 'w-64 mr-8' : ''} justify-start h-full ${!isMaximized && 'border-r border-foreground/20 pr-6'}`}>
                  <h3 className="text-xl font-bold mb-4">Progress</h3>
                  <div className="space-y-2 text-sm">
                    {progressSteps.map((stepText, index) => (
                      <div key={index} className={`${step >= index ? 'text-foreground' : 'text-foreground/50'}`}>
                        {index + 1}. {stepText}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className={`w-full ${isMaximized ? 'max-w-2xl mx-auto' : 'max-w-[450px]'}`}>
                {!showThankYou ? (
                  <form onSubmit={handleSubmit}>
                    {step === 0 && (
                      <div className="space-y-4">
                        <p className="text-sm text-foreground/70 mb-4">What brings you here today?</p>
                        <RadioGroup onValueChange={(value) => handleRadioChange('intent', value)} value={formData.intent}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="project" id="project" />
                            <Label htmlFor="project">I need a website or app</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="learn" id="learn" />
                            <Label htmlFor="learn">I want to learn web development</Label>
                          </div>
                        </RadioGroup>
                        <Button type="button" onClick={nextStep} disabled={!formData.intent}>Next</Button>
                      </div>
                    )}

                    {step === 1 && (
                      <div className="space-y-4">
                        <p className="text-sm text-foreground/70 mb-4">Great! Let's start with your basic information.</p>
                        <Input
                          type="text"
                          name="name"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          required
                        />
                        <Input
                          type="email"
                          name="email"
                          placeholder="Your Email"
                          value={formData.email}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          required
                        />
                        <div className="flex justify-between">
                          <Button type="button" onClick={prevStep}>Back</Button>
                          <Button type="button" onClick={nextStep} disabled={!formData.name || !formData.email}>Next</Button>
                        </div>
                      </div>
                    )}

                    {step === 2 && formData.intent === 'project' && (
                      <div className="space-y-4">
                        <p className="text-sm text-foreground/70 mb-4">What type of project are you interested in?</p>
                        <RadioGroup onValueChange={(value) => handleRadioChange('projectType', value)} value={formData.projectType}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="website" id="website" />
                            <Label htmlFor="website">Website</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="app" id="app" />
                            <Label htmlFor="app">Mobile App</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="other" />
                            <Label htmlFor="other">Other</Label>
                          </div>
                        </RadioGroup>
                        <div className="flex justify-between">
                          <Button type="button" onClick={prevStep}>Back</Button>
                          <Button type="button" onClick={nextStep} disabled={!formData.projectType}>Next</Button>
                        </div>
                      </div>
                    )}

                    {step === 2 && formData.intent === 'learn' && (
                      <div className="space-y-4">
                        <p className="text-sm text-foreground/70 mb-4">What's your current level of experience with web development?</p>
                        <RadioGroup onValueChange={(value) => handleRadioChange('learningExperience', value)} value={formData.learningExperience}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="beginner" id="beginner" />
                            <Label htmlFor="beginner">Complete Beginner</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="some" id="some" />
                            <Label htmlFor="some">Some Experience</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="intermediate" id="intermediate" />
                            <Label htmlFor="intermediate">Intermediate</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="advanced" id="advanced" />
                            <Label htmlFor="advanced">Advanced</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="unknown" id="unknown" />
                            <Label htmlFor="unknown">I'm not sure</Label>
                          </div>
                        </RadioGroup>
                        <div className="flex justify-between">
                          <Button type="button" onClick={prevStep}>Back</Button>
                          <Button type="button" onClick={nextStep} disabled={!formData.learningExperience}>Next</Button>
                        </div>
                      </div>
                    )}

                    {step === 3 && formData.intent === 'project' && (
                      <div className="space-y-4">
                        <p className="text-sm text-foreground/70 mb-4">What's the main goal of your project?</p>
                        <Input
                          type="text"
                          name="projectGoal"
                          placeholder="e.g., Increase sales, Improve user engagement"
                          value={formData.projectGoal}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          required
                        />
                        <p className="text-sm text-foreground/70 mb-4">What's your estimated timeline for this project?</p>
                        <RadioGroup onValueChange={(value) => handleRadioChange('timeline', value)} value={formData.timeline}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1month" id="1month" />
                            <Label htmlFor="1month">Less than 1 month</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="3months" id="3months" />
                            <Label htmlFor="3months">1-3 months</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="6months" id="6months" />
                            <Label htmlFor="6months">3-6 months</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="6monthsplus" id="6monthsplus" />
                            <Label htmlFor="6monthsplus">More than 6 months</Label>
                          </div>
                        </RadioGroup>
                        <div className="flex justify-between">
                          <Button type="button" onClick={prevStep}>Back</Button>
                          <Button type="button" onClick={nextStep} disabled={!formData.projectGoal || !formData.timeline}>Next</Button>
                        </div>
                      </div>
                    )}

                    {step === 3 && formData.intent === 'learn' && (
                      <div className="space-y-4">
                        <p className="text-sm text-foreground/70 mb-4">What aspect of web development are you most interested in learning?</p>
                        <RadioGroup onValueChange={(value) => handleRadioChange('projectType', value)} value={formData.projectType}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="frontend" id="frontend" />
                            <Label htmlFor="frontend">Frontend Development</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="backend" id="backend" />
                            <Label htmlFor="backend">Backend Development</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fullstack" id="fullstack" />
                            <Label htmlFor="fullstack">Full Stack Development</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="unknown" id="unknown" />
                            <Label htmlFor="unknown">I'm not sure</Label>
                          </div>
                        </RadioGroup>
                        <div className="flex justify-between">
                          <Button type="button" onClick={prevStep}>Back</Button>
                          <Button type="button" onClick={nextStep} disabled={!formData.projectType}>Next</Button>
                        </div>
                      </div>
                    )}

                    {step === 4 && formData.intent === 'project' && (
                      <div className="space-y-4">
                        <p className="text-sm text-foreground/70 mb-4">What's your estimated budget for this project?</p>
                        <RadioGroup onValueChange={(value) => handleRadioChange('budget', value)} value={formData.budget}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="under5k" id="under5k" />
                            <Label htmlFor="under5k">Under $5,000</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="5kto10k" id="5kto10k" />
                            <Label htmlFor="5kto10k">$5,000 - $10,000</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="10kto25k" id="10kto25k" />
                            <Label htmlFor="10kto25k">$10,000 - $25,000</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="25kplus" id="25kplus" />
                            <Label htmlFor="25kplus">$25,000+</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="unknown" id="unknown" />
                            <Label htmlFor="unknown">I'm not sure</Label>
                          </div>
                        </RadioGroup>
                        <div className="flex justify-between">
                          <Button type="button" onClick={prevStep}>Back</Button>
                          <Button type="button" onClick={nextStep} disabled={!formData.budget}>Next</Button>
                        </div>
                      </div>
                    )}

                    {step === 4 && formData.intent === 'learn' && (
                      <div className="space-y-4">
                        <p className="text-sm text-foreground/70 mb-4">How much time can you dedicate to learning web development each week?</p>
                        <RadioGroup onValueChange={(value) => handleRadioChange('timeline', value)} value={formData.timeline}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1to5" id="1to5" />
                            <Label htmlFor="1to5">1-5 hours</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="5to10" id="5to10" />
                            <Label htmlFor="5to10">5-10 hours</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="10to20" id="10to20" />
                            <Label htmlFor="10to20">10-20 hours</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="20plus" id="20plus" />
                            <Label htmlFor="20plus">20+ hours</Label>
                          </div>
                        </RadioGroup>
                        <div className="flex justify-between">
                          <Button type="button" onClick={prevStep}>Back</Button>
                          <Button type="button" onClick={nextStep} disabled={!formData.timeline}>Next</Button>
                        </div>
                      </div>
                    )}

                    {step === 5 && (
                      <div className="space-y-4">
                        <p className="text-sm text-foreground/70 mb-4">
                          {formData.intent === 'project'
                            ? "Great! Now, tell me more about your project. The more details you provide, the better I can understand your vision."
                            : "Excellent! Tell me about your goals and any specific areas you'd like to focus on in web development."}
                        </p>
                        <Textarea
                          name="message"
                          placeholder={formData.intent === 'project' ? "Tell me about your project..." : "Share your goals and areas of interest..."}
                          value={formData.message}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          required
                        />
                        <div className="flex justify-between">
                          <Button type="button" onClick={prevStep}>Back</Button>
                          <Button type="submit" disabled={isSubmitting || !formData.message}>
                            {isSubmitting ? 'Sending...' : 'Send'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </form>
                ) : (
                  <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold">Thank You!</h2>
                    <p className="text-foreground/70">
                      I appreciate you taking the time to reach out. I'll review your information and get back to you soon with valuable insights tailored to your needs.
                    </p>
                    <Button onClick={resetForm} className="w-full">Close</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

