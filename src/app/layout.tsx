// src/app/layout.tsx

import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'bohol',
  description: '여행 일정에 AI를 더하다',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="ko">
        <body className={inter.className}>
          <Toaster position="top-center" />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}