import { useEffect, useState } from 'react'

export default function SplashScreen({ onDone, onSunSign, theme, isDay }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1800)
    return () => clearTimeout(t)
  }, [])

  const stars = Array.from({length:60}, (_,i) => ({
    id:i, left:`${Math.random()*100}%`, top:`${Math.random()*100}%`,
    size: Math.random()*2+1, delay:`${Math.random()*4}s`, dur:`${Math.random()*3+2}s`
  }))

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map(s => (
          <div key={s.id} className="absolute rounded-full bg-amber-200 animate-pulse"
            style={{left:s.left, top:s.top, width:s.size, height:s.size,
              animationDelay:s.delay, animationDuration:s.dur, opacity:0.4}} />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 text-center px-8">
        <div className="text-7xl animate-pulse">🪐</div>

        <div>
          <p className="text-xs tracking-[0.4em] text-amber-700 mb-2">ANCIENT WISDOM • COSMIC GUIDANCE</p>
          <h1 className="text-5xl text-amber-400 font-light">Jyotish</h1>
          <p className="text-sm text-amber-600 tracking-[0.2em] mt-1">VEDIC ASTROLOGY</p>
        </div>

        <p className="text-amber-900 text-sm font-serif italic">
          ग्रहाणां चरितं वक्तुं<br />
          <span className="text-xs">Let the stars reveal your destiny</span>
        </p>

        {/* Buttons appear after 1.8 seconds */}
        <div className={'flex flex-col gap-3 w-full transition-all duration-700 ' + (ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4')}>
          <button onClick={onDone}
            className="w-full bg-gradient-to-r from-amber-700 to-amber-500 text-slate-900 font-bold py-4 rounded-xl text-sm tracking-wide">
            ✦ Calculate My Kundali ✦
          </button>
          <button onClick={onSunSign}
            className="w-full border border-amber-700/50 text-amber-500 py-3 rounded-xl text-sm">
            ☿ Sun Sign Forecasts
          </button>
        </div>

        {!ready && (
          <div className="flex gap-2 mt-2">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"
                style={{animationDelay:`${i*0.3}s`}} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}