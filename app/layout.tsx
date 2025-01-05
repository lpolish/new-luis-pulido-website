import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from './theme-provider'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Luis Pulido - Full-Stack Innovator',
  description: 'Backend optimizer turned full-stack maker. Building blazing-fast websites and apps.',
  openGraph: {
    images: [
      {
        url: 'https://www.luispulido.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Luis Pulido - Full-Stack Innovator',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

