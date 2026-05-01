import { useEffect, useState } from 'react'

export default function SplashScreen({ onDone, onSunSign, onLegal }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8] relative overflow-hidden">

      {/* Decorative blobs */}
      <div className="absolute top-[-120px] right-[-120px] w-[350px] h-[350px] rounded-full bg-amber-100 opacity-60 blur-3xl pointer-events-none"/>
      <div className="absolute bottom-[-80px] left-[-80px] w-[250px] h-[250px] rounded-full bg-orange-100 opacity-60 blur-3xl pointer-events-none"/>

      <div className="relative z-10 flex flex-col min-h-screen px-6">

        {/* Top badge */}
        <div className="flex justify-center pt-12 pb-2">
          <span className="text-xs tracking-[0.4em] text-amber-600 bg-amber-50 border border-amber-200 px-4 py-1.5 rounded-full">
            VEDIC ASTROLOGY
          </span>
        </div>

        {/* Hero */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center mb-6 shadow-lg">
            <span className="text-5xl">🪐</span>
          </div>

          <h1 className="font-serif text-6xl text-slate-800 font-light mb-2">Jyotish</h1>
          <p className="font-serif italic text-xl text-amber-600 mb-8">Ancient Wisdom · Modern Guidance</p>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl px-6 py-4 mb-10 max-w-xs">
            <p className="font-serif italic text-amber-700 text-sm">"ग्रहाणां चरितं वक्तुं"</p>
            <p className="text-amber-500 text-xs mt-1">Let the stars reveal your destiny</p>
          </div>

          <div className="flex gap-8 mb-10">
            {[
              {icon:'🔮', label:'Kundali'},
              {icon:'💫', label:'Horoscope'},
              {icon:'🗣️', label:'AI Chat'},
            ].map(f => (
              <div key={f.label} className="flex flex-col items-center gap-1.5">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center">
                  <span className="text-xl">{f.icon}</span>
                </div>
                <span className="text-xs text-slate-500">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className={`pb-6 flex flex-col gap-3 transition-all duration-700 ${ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <button onClick={onDone}
            className="w-full py-4 rounded-2xl bg-slate-800 text-white font-semibold text-sm tracking-wide shadow-lg active:scale-95 transition-transform">
            ✦ Calculate My Kundali
          </button>
          <button onClick={onSunSign}
            className="w-full py-3.5 rounded-2xl border border-slate-200 text-slate-600 bg-white text-sm tracking-wide shadow-sm active:scale-95 transition-transform">
            ☿ Explore Sun Sign Forecasts
          </button>
          <p className="text-center text-xs text-slate-400 mt-1">
            Swiss Ephemeris · Lahiri Ayanamsha · AI-Powered
          </p>

          {/* Legal links */}
          <div className="flex justify-center gap-4 pb-2 flex-wrap">
            {[
              {label:'Terms', section:'terms'},
              {label:'Privacy', section:'privacy'},
              {label:'Disclaimer', section:'disclaimer'},
              {label:'Refunds', section:'refund'},
            ].map(item => (
              <button key={item.section}
                onClick={() => onLegal && onLegal(item.section)}
                className="text-xs text-slate-400 underline underline-offset-2">
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}