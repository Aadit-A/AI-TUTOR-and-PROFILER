import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import AuthProvider from '@/components/providers/SessionProvider'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

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
    <html lang="en" className="bg-[#f3f6f4] text-[#18292c]">
      <body className={`${inter.className} min-h-screen bg-[#f3f6f4] text-[#18292c]`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}