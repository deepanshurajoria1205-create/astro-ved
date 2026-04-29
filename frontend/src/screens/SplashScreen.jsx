import { useEffect } from 'react'

export default function SplashScreen({ onDone, onSunSign, theme, isDay }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <StarField />
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
        <div className="flex gap-2 mt-2">
  {[0,1,2].map(i => (
    <div key={i} className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"
      style={{animationDelay:`${i*0.3}s`}} />
  ))}
</div>

{onSunSign && (
  <button onClick={onSunSign}
    className="mt-4 px-6 py-2 border border-amber-700/40 rounded-full text-xs text-amber-600">
    ✦ View Sun Sign Forecasts
  </button>
)}
      </div>
    </div>
  )
}

function StarField() {
  const stars = Array.from({length:60}, (_,i) => ({
    id:i, left:`${Math.random()*100}%`, top:`${Math.random()*100}%`,
    size: Math.random()*2+1, delay:`${Math.random()*4}s`, dur:`${Math.random()*3+2}s`
  }))
  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map(s => (
        <div key={s.id} className="absolute rounded-full bg-amber-200 animate-pulse"
          style={{left:s.left, top:s.top, width:s.size, height:s.size,
            animationDelay:s.delay, animationDuration:s.dur, opacity:0.4}} />
      ))}
    </div>
  )
}