import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TalentProvider } from '@/contexts/TalentContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '才能発見アプリ',
  description: 'あなたの才能を具体化するチェックリストアプリ',
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '才能発見',
  },
  icons: {
    icon: '/icon-192x192.png',
    apple: '/icon-192x192.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="才能発見" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <TalentProvider>
          {children}
        </TalentProvider>
      </body>
    </html>
  )
}
