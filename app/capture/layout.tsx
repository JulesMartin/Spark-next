import { anton, assistant, dmSans, raleway } from '@/app/fonts'
import type { ReactNode } from 'react'

export default function CaptureLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${raleway.variable} ${assistant.variable} ${anton.variable} ${dmSans.variable} min-h-screen overflow-y-auto`}>
      {children}
    </div>
  )
}
