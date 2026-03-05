function LaptopMockup() {
  return (
    <div className="relative w-full max-w-[500px]">
      {/* Drop shadow */}
      <div className="absolute inset-x-8 bottom-0 h-16 bg-black/10 blur-2xl rounded-full translate-y-6" />

      <div className="relative">
        {/* Screen frame */}
        <div className="bg-[#2C2C2E] rounded-t-2xl p-2.5 pb-0">
          {/* Camera notch */}
          <div className="flex justify-center mb-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#3C3C3E]" />
          </div>

          {/* Screen */}
          <div className="bg-white rounded-t-lg overflow-hidden">
            {/* Browser bar */}
            <div className="bg-gray-100 border-b border-gray-200 px-3 py-1.5 flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-400 opacity-80" />
                <div className="w-2 h-2 rounded-full bg-yellow-400 opacity-80" />
                <div className="w-2 h-2 rounded-full bg-green-400 opacity-80" />
              </div>
              <div className="flex-1 bg-white border border-gray-200 rounded-full h-3.5 mx-2" />
            </div>

            {/* Fake website content */}
            <div className="p-5 bg-[#F5F5F0]" style={{ minHeight: '280px' }}>
              {/* Nav */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-10 h-2 bg-gray-900 rounded" />
                <div className="flex gap-3">
                  <div className="w-6 h-1.5 bg-gray-300 rounded" />
                  <div className="w-6 h-1.5 bg-gray-300 rounded" />
                  <div className="w-6 h-1.5 bg-gray-300 rounded" />
                </div>
              </div>

              {/* Hero blocks */}
              <div className="mb-4">
                <div className="w-3/4 h-2.5 bg-gray-800 rounded mb-2" />
                <div className="w-1/2 h-2.5 bg-[#6DBE2E]/60 rounded mb-4" />
                <div className="w-full h-1.5 bg-gray-300 rounded mb-1.5" />
                <div className="w-4/5 h-1.5 bg-gray-300 rounded mb-1.5" />
                <div className="w-3/5 h-1.5 bg-gray-300 rounded mb-5" />
                <div className="w-20 h-5 bg-[#6DBE2E] rounded-full" />
              </div>

              {/* Interview cards */}
              <div className="grid grid-cols-3 gap-2 mt-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded overflow-hidden">
                    <div className="bg-gray-200 aspect-video rounded mb-1" />
                    <div className="w-3/4 h-1.5 bg-gray-400 rounded mb-1" />
                    <div className="w-1/2 h-1 bg-gray-300 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Laptop base */}
        <div className="bg-[#2C2C2E] h-3 rounded-b-sm" />
        <div className="bg-[#1C1C1E] h-2 mx-8 rounded-b-xl shadow-xl" />
      </div>
    </div>
  )
}


export default function HeroSection() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Background blob */}
        <div
          className="absolute top-0 right-0 pointer-events-none"
          style={{
            width: '700px',
            height: '700px',
            background: 'radial-gradient(circle, rgba(109,190,46,0.13) 0%, transparent 68%)',
            transform: 'translate(25%, -30%)',
          }}
        />

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
                  href="#interviews"
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-white font-body font-medium px-7 py-3.5 rounded-full transition-colors duration-200 text-sm"
                >
                  Découvrir les interviews
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right: laptop mockup */}
            <div className="flex justify-center lg:justify-end">
              <LaptopMockup />
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
