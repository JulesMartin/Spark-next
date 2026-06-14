import { Raleway, Assistant } from 'next/font/google'
import type { ReactNode } from 'react'

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-raleway',
  display: 'swap',
})

const assistant = Assistant({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-assistant',
  display: 'swap',
})

export default function CaptureLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${raleway.variable} ${assistant.variable} min-h-screen overflow-y-auto`}>
      {children}
    </div>
  )
}
