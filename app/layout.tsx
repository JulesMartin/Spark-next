import type { Metadata } from 'next'
import { dmSans, fraunces } from '@/app/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Spark — Interviews & Médias',
  description: 'Interviews et contenus éditoriaux avec les personnalités qui façonnent demain.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`${fraunces.variable} ${dmSans.variable} antialiased bg-bg text-cream font-body`}>
        {children}
      </body>
    </html>
  )
}
