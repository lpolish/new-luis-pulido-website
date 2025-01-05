'use client'

import { useState } from 'react'
import { sendContactMessage, subscribeToNewsletter } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export function ContactForm() {
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubscribe(formData: FormData) {
    setIsSubscribing(true)
    const result = await subscribeToNewsletter(formData)
    setIsSubscribing(false)
    
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Successfully subscribed to the newsletter!')
      const form = document.getElementById('subscribe-form') as HTMLFormElement
      form.reset()
    }
  }

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    const result = await sendContactMessage(formData)
    setIsSubmitting(false)
    
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Message sent successfully!')
      const form = document.getElementById('contact-form') as HTMLFormElement
      form.reset()
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Subscribe to Newsletter</h3>
        <form id="subscribe-form" action={handleSubscribe} className="space-y-4">
          <Input
            type="email"
            name="email"
            placeholder="your@email.com"
            required
            className="bg-transparent border-foreground/60 focus:border-foreground"
          />
          <Button 
            type="submit" 
            disabled={isSubscribing}
            className="w-full border-2 border-foreground/60 bg-foreground/10 text-foreground hover:bg-background hover:border-foreground transition-colors"
          >
            {isSubscribing ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold">Contact Me</h3>
        <form id="contact-form" action={handleSubmit} className="space-y-4">
          <Input
            type="email"
            name="email"
            placeholder="your@email.com"
            required
            className="bg-transparent border-foreground/60 focus:border-foreground"
          />
          <Textarea
            name="message"
            placeholder="Your message..."
            required
            className="bg-transparent border-foreground/60 focus:border-foreground min-h-[100px]"
          />
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full border-2 border-foreground/60 bg-foreground/10 text-foreground hover:bg-background hover:border-foreground transition-colors"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </div>
    </div>
  )
}

