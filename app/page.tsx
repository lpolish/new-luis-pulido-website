import Link from 'next/link'
import { ArrowRight, Github, Instagram } from 'lucide-react'
import { ThemeToggle } from './components/theme-toggle'
import { ContactForm } from './components/contact-form'
import { ContactWizard } from './components/contact-wizard'
import { Toaster } from 'sonner'
import { XIcon } from './components/x-icon'
import { ProductHuntIcon } from './components/product-hunt-icon'
import { StackOverflowIcon } from './components/stack-overflow-icon'

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      <Toaster />
      <header className="p-6 md:p-10 border-b-4 border-foreground dark:border-[#444]">
        <h1 className="text-4xl md:text-6xl font-bold">Luis Pulido Díaz</h1>
        <p className="mt-2 text-xl md:text-2xl">Backend optimizer turned full-stack maker</p>
      </header>

      <main className="p-6 md:p-10 pb-24">
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">About</h2>
          <p className="text-lg md:text-xl max-w-2xl">
            15 years of slashing costs and boosting performance. Now I'm all about helping you build and ship blazing-fast websites and apps, even if you've never coded before.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <Link 
                key={index} 
                href={project.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-4 border-2 border-foreground/60 hover:border-foreground transition-colors"
              >
                <h3 className="text-xl font-bold">{project.name}</h3>
                <p className="mt-2">{project.description}</p>
                <ArrowRight className="mt-4" />
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Connected</h2>
          <ContactForm />
        </section>
      </main>

      <footer className="p-6 md:p-10 border-t-4 border-foreground dark:border-[#444] mt-12 pb-24 md:pb-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-12">
          <p className="text-xs">&copy; {new Date().getFullYear()} Luis Pulido Díaz. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/lpolish" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-foreground/60 transition-colors"
              aria-label="GitHub Profile"
            >
              <Github className="h-6 w-6" />
            </a>
            <a 
              href="https://instagram.com/lu1s0n1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-foreground/60 transition-colors"
              aria-label="Instagram Profile"
            >
              <Instagram className="h-6 w-6" />
            </a>
            <a 
              href="https://x.com/pulidoman" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-foreground/60 transition-colors"
              aria-label="X/Twitter Profile"
            >
              <XIcon className="h-6 w-6" />
            </a>
            <a 
              href="https://www.producthunt.com/@luis_pulido" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-foreground/60 transition-colors"
              aria-label="Product Hunt Profile"
            >
              <ProductHuntIcon className="h-6 w-6" />
            </a>
            <a 
              href="https://stackoverflow.com/users/645386/lu1s" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-foreground/60 transition-colors"
              aria-label="Stack Overflow Profile"
            >
              <StackOverflowIcon className="h-6 w-6" />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </footer>

      <ContactWizard />
    </div>
  )
}

const projects = [
  {
    name: "Hackeroso",
    url: "https://hackeroso.com",
    description: "Privacy-enhanced Hacker News-inspired platform with integrated task management."
  },
  {
    name: "Web Development with AI Course",
    url: "https://pulido7.gumroad.com/l/learn-web-development",
    description: "Learn to build professional websites and apps using AI tools, without any prior coding knowledge."
  },
  {
    name: "Marcaja",
    url: "https://marcaja.hackeroso.com",
    description: "Free, offcloud image watermarking tool for protecting your digital content."
  },
  {
    name: "Tetris Clone",
    url: "https://tetris.hackeroso.com",
    description: "A modern implementation of the classic Tetris game."
  },
  {
    name: "Math Medusa Visualizer",
    url: "https://visualmeduza.vercel.app/",
    description: "A relaxing floating visualizer that you could project out in a wall, from a weird math formula in X"
  },
  {
    name: "Squares",
    url: "https://squares.luispulido.com",
    description: "Inscribed square finder tool and theoretical exploration page."
  },
  {
    name: "GitHub Projects",
    url: "https://github.com/lpolish/",
    description: "Collection of open-source contributions and personal projects."
  },
  {
    name: "Summaq",
    url: "https://summaq.com",
    description: "Quality management system consultancy for unlocking manufacturing businesses growth."
  },
  {
    name: "Audio Visualizers",
    url: "https://luis-pulido-website.vercel.app/audio-visualizers",
    description: "Audio visualizations that beat with the beat from your surroundings"
  },
  {
    name: "Alebrijes Gallery",
    url: "https://luis-pulido-website.vercel.app/alebrijes",
    description: "Some alebrijes I had created using generative tools"    
  }
]

