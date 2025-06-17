// src/app/layout.tsx

import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ottrip',
  description: '여행 일정을 쉽게 만들고 공유하는 Ottrip',
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