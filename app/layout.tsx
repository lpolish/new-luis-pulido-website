import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from './theme-provider'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Luis Pulido - Full-Stack Innovator',
  description: 'Backend optimizer turned full-stack maker. Building blazing-fast websites and apps.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}

