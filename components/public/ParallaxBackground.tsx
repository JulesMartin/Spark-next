'use client'

import { useEffect, useRef } from 'react'

export default function ParallaxBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        ref.current.style.transform = `translateY(${window.scrollY * 0.35}px)`
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      ref={ref}
      className="absolute inset-0 pointer-events-none scale-125"
      style={{
        backgroundImage: 'url(/waves-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        mixBlendMode: 'screen',
        opacity: 0.14,
      }}
    />
  )
}
