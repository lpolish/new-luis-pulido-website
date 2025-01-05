'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

export function StartNowButton({ onClick }: { onClick: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <Button
      onClick={onClick}
      className={`
        fixed z-50 transition-all duration-300 ease-in-out
        text-lg font-bold px-6 py-3 rounded-full shadow-lg
        bg-foreground text-background hover:bg-foreground/90
        border-4 border-background
        ${isScrolled
          ? 'bottom-4 right-4 scale-90'
          : 'bottom-8 right-8 scale-100'
        }
        md:bottom-8 md:right-8 md:scale-100
      `}
    >
      Start Now
    </Button>
  )
}

