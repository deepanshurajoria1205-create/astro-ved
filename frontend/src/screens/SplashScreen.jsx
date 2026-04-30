import { useEffect, useState } from 'react'

export default function SplashScreen({ onDone, onSunSign, theme, isDay }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden ${isDay ? 'bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50' : 'bg-[#080612]'}`}>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Mandala circle */}
        <div className={`absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full border opacity-10 ${isDay ? 'border-amber-400' : 'border-amber-600'}`}/>
        <div className={`absolute top-[-50px] right-[-50px] w-[300px] h-[300px] rounded-full border opacity-10 ${isDay ? 'border-amber-400' : 'border-amber-600'}`}/>
        <div className={`absolute top-[0px] right-[0px] w-[200px] h-[200px] rounded-full border opacity-10 ${isDay ? 'border-amber-400' : 'border-amber-600'}`}/>
        {/* Stars for dark mode */}
        {!isDay && Array.from({length:40}, (_,i) => (
          <div key={i} className="absolute rounded-full bg-white animate-pulse"
            style={{
              left:`${Math.random()*100}%`, top:`${Math.random()*100}%`,
              width:Math.random()*2+1, height:Math.random()*2+1,
              opacity: Math.random()*0.5+0.1,
              animationDelay:`${Math.random()*4}s`,
              animationDuration:`${Math.random()*3+2}s`
            }}/>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col min-h-screen px-6">

        {/* Top section */}
        <div className="flex-1 flex flex-col justify-center items-center text-center pt-16">

          {/* Logo */}
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isDay ? 'bg-amber-100 border-2 border-amber-300' : 'bg-amber-950/40 border border-amber-700/40'}`}>
            <span className="text-4xl">🪐</span>
          </div>

          {/* Brand */}
          <p className={`text-xs tracking-[0.5em] mb-2 ${isDay ? 'text-amber-600' : 'text-amber-700'}`}>
            VEDIC ASTROLOGY
          </p>
          <h1 className={`font-serif text-6xl font-light mb-2 ${isDay ? 'text-slate-800' : 'text-amber-100'}`}>
            Jyotish
          </h1>
          <p className={`font-serif italic text-lg mb-8 ${isDay ? 'text-amber-700' : 'text-amber-600'}`}>
            Ancient Wisdom · Modern Guidance
          </p>

          {/* Sanskrit verse */}
          <div className={`px-6 py-4 rounded-2xl mb-8 max-w-xs ${isDay ? 'bg-amber-50 border border-amber-200' : 'bg-amber-950/20 border border-amber-900/20'}`}>
            <p className={`font-serif italic text-sm leading-relaxed ${isDay ? 'text-amber-800' : 'text-amber-500'}`}>
              "ग्रहाणां चरितं वक्तुं"
            </p>
            <p className={`text-xs mt-1 ${isDay ? 'text-amber-500' : 'text-amber-800'}`}>
              Let the stars reveal your destiny
            </p>
          </div>

          {/* Features */}
          <div className="flex gap-6 mb-8">
            {[
              {icon:'🔮', label:'Kundali'},
              {icon:'💫', label:'Horoscope'},
              {icon:'🗣️', label:'AI Chat'},
            ].map(f => (
              <div key={f.label} className="flex flex-col items-center gap-1">
                <span className="text-2xl">{f.icon}</span>
                <span className={`text-xs ${isDay ? 'text-slate-500' : 'text-amber-800'}`}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={`pb-10 flex flex-col gap-3 transition-all duration-700 ${ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button onClick={onDone}
            className={`w-full py-4 rounded-2xl font-semibold text-sm tracking-wide shadow-lg transition-transform active:scale-95 ${isDay ? 'bg-slate-800 text-white' : 'bg-amber-500 text-slate-900'}`}>
            ✦ Calculate My Kundali
          </button>
          <button onClick={onSunSign}
            className={`w-full py-3.5 rounded-2xl text-sm tracking-wide border transition-transform active:scale-95 ${isDay ? 'border-slate-300 text-slate-600 bg-white' : 'border-amber-800/40 text-amber-600 bg-transparent'}`}>
            ☿ Explore Sun Sign Forecasts
          </button>
          <p className={`text-center text-xs mt-1 ${isDay ? 'text-slate-400' : 'text-amber-900'}`}>
            Swiss Ephemeris · Lahiri Ayanamsha · AI-Powered
          </p>
        </div>
      </div>
    </div>
  )
}