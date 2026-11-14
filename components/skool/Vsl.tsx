'use client'

import { useState } from 'react'
import Image from 'next/image'
import { VSL_MP4_URL, VSL_YOUTUBE_ID } from '@/lib/waitlist'

const Play = () => (
  <span className="vsl-play" aria-hidden="true">
    <svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor" /></svg>
  </span>
)

export default function Vsl() {
  const [playing, setPlaying] = useState(false)

  if (VSL_MP4_URL)
    return (
      <div className="vsl">
        <video src={VSL_MP4_URL} controls playsInline preload="metadata" />
      </div>
    )

  if (VSL_YOUTUBE_ID)
    return (
      <div className="vsl">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${VSL_YOUTUBE_ID}?autoplay=1&rel=0&modestbranding=1`}
            title="Présentation de Claude to Client"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button type="button" className="vsl-cover" onClick={() => setPlaying(true)} aria-label="Lire la vidéo de présentation">
            <Image src={`https://img.youtube.com/vi/${VSL_YOUTUBE_ID}/maxresdefault.jpg`} alt="" fill sizes="(max-width: 960px) 100vw, 960px" priority />
            <Play />
          </button>
        )}
      </div>
    )

  return (
    <div className="vsl vsl-soon" role="img" aria-label="La vidéo de présentation arrive très bientôt">
      <Play />
      <span className="vsl-note">La vidéo arrive très bientôt</span>
    </div>
  )
}
