import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import AuthProvider from '@/components/providers/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Tutor',
  description: 'AI-powered learning and skill profiling system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-slate-950">
      <body className={`${inter.className} bg-slate-950 min-h-screen`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}