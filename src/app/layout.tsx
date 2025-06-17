// src/app/layout.tsx
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Ottrip',
  description: '당신의 여행에 AI를 더하다',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="ko">
        <head>
          <title>Ottrip</title>
          <meta name="description" content="당신의 여행에 AI를 더하다" />
          <meta property="og:title" content="Ottrip" />
          <meta property="og:description" content="당신의 여행을 함께 만들어보세요" />
          <meta property="og:url" content="https://www.ottrip.kr" />
          <meta property="og:type" content="website" />
        </head>
        <body className={inter.className}>
          <Toaster position="top-center" />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}