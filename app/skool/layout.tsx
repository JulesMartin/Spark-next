import { albertSans, montserrat } from '@/app/fonts'
import './skool.css'

export default function SkoolLayout({ children }: { children: React.ReactNode }) {
  return <div className={`skl ${montserrat.variable} ${albertSans.variable}`}>{children}</div>
}
