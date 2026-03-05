import Image from 'next/image'
import ParallaxBackground from './ParallaxBackground'


export default function HeroSection() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <ParallaxBackground />

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: text */}
            <div className="flex flex-col gap-6">
              <h1 className="font-display text-5xl md:text-6xl xl:text-7xl font-black text-cream leading-[1.05] tracking-tight">
                Les interviews qui vous{' '}
                <span className="text-accent italic">inspirent</span>
              </h1>
              <p className="font-body text-muted text-lg leading-relaxed max-w-md">
                Spark vous propose des interviews exclusives avec des entrepreneurs, créatifs et visionnaires qui façonnent notre époque.
              </p>
              <div className="pt-2">
                <a
                  href="https://www.youtube.com/@Z-Start-Web"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-white font-body font-medium px-7 py-3.5 rounded-full transition-colors duration-200 text-sm"
                >
                  Découvrir les interviews
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right: hero image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[747px] border-2 border-[#E8A320] shadow-2xl">
                <div className="overflow-hidden">
                  <Image
                    src="/hero-image.png"
                    alt="Interview en cours"
                    width={1456}
                    height={816}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
