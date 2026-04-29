import { useState } from 'react'

const API = 'https://jyotish-backend-stw4.onrender.com/api'

const SUN_SIGNS = [
  {name:'Mesha', english:'Aries', symbol:'♈', dates:'Mar 21 – Apr 19', element:'Fire', color:'#ef4444'},
  {name:'Vrishabha', english:'Taurus', symbol:'♉', dates:'Apr 20 – May 20', element:'Earth', color:'#84cc16'},
  {name:'Mithuna', english:'Gemini', symbol:'♊', dates:'May 21 – Jun 20', element:'Air', color:'#facc15'},
  {name:'Karka', english:'Cancer', symbol:'♋', dates:'Jun 21 – Jul 22', element:'Water', color:'#60a5fa'},
  {name:'Simha', english:'Leo', symbol:'♌', dates:'Jul 23 – Aug 22', element:'Fire', color:'#f97316'},
  {name:'Kanya', english:'Virgo', symbol:'♍', dates:'Aug 23 – Sep 22', element:'Earth', color:'#4ade80'},
  {name:'Tula', english:'Libra', symbol:'♎', dates:'Sep 23 – Oct 22', element:'Air', color:'#e879f9'},
  {name:'Vrischika', english:'Scorpio', symbol:'♏', dates:'Oct 23 – Nov 21', element:'Water', color:'#818cf8'},
  {name:'Dhanu', english:'Sagittarius', symbol:'♐', dates:'Nov 22 – Dec 21', element:'Fire', color:'#fb7185'},
  {name:'Makara', english:'Capricorn', symbol:'♑', dates:'Dec 22 – Jan 19', element:'Earth', color:'#94a3b8'},
  {name:'Kumbha', english:'Aquarius', symbol:'♒', dates:'Jan 20 – Feb 18', element:'Air', color:'#38bdf8'},
  {name:'Meena', english:'Pisces', symbol:'♓', dates:'Feb 19 – Mar 20', element:'Water', color:'#a78bfa'},
]

import ReactMarkdown from 'react-markdown'

export default function SunSignScreen({ onBack, theme, userLocation }) {
  const [selected, setSelected] = useState(null)
  const [period, setPeriod] = useState('monthly')
  const [forecast, setForecast] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchForecast = async (sign, p) => {
    setLoading(true)
    setForecast('')
    try {
      const res = await fetch(`${API}/sunsign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sign: sign.name, period: p, location: userLocation?.display })
      })
      const data = await res.json()
      setForecast(data.forecast || 'Unable to generate forecast.')
    } catch(e) {
      setForecast('Connection error. Please try again.')
    }
    setLoading(false)
  }

  const selectSign = (sign) => {
    setSelected(sign)
    fetchForecast(sign, period)
  }

  const changePeriod = (p) => {
    setPeriod(p)
    if (selected) fetchForecast(selected, p)
  }

  if (!selected) return (
    <div className="min-h-screen pb-10">
      <div className="px-6 pt-10 pb-5 border-b border-amber-900/30">
        <button onClick={onBack} className="text-amber-700 text-sm mb-3">‹ Back</button>
        <p className="text-xs tracking-[0.3em] text-amber-800 mb-1">CELESTIAL FORECASTS</p>
        <h2 className="text-3xl text-amber-400 font-light">Sun Sign</h2>
        <p className="text-xs text-amber-700 mt-1">Select your sign for a detailed forecast</p>
      </div>

      <div className="px-4 pt-5 grid grid-cols-3 gap-3">
        {SUN_SIGNS.map(sign => (
          <button key={sign.name} onClick={() => selectSign(sign)}
            className="bg-amber-950/20 border border-amber-900/30 rounded-xl p-3 flex flex-col items-center gap-1 active:scale-95 transition-transform">
            <span className="text-2xl" style={{color: sign.color}}>{sign.symbol}</span>
            <span className="text-xs text-amber-400 font-medium">{sign.english}</span>
            <span className="text-xs text-amber-800">{sign.name}</span>
            <span className="text-xs text-amber-900">{sign.element}</span>
          </button>
        ))}
      </div>

      <div className="px-5 mt-6 p-4 bg-amber-950/20 border border-amber-900/20 rounded-xl">
        <p className="text-xs text-amber-700 leading-relaxed">
          ✨ Sun sign forecasts are based on current planetary transits and provide general cosmic guidance. For a personalised reading based on your exact birth chart, calculate your Kundali.
        </p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen pb-10">
      <div className="flex items-center gap-3 px-4 pt-6 pb-4 border-b border-amber-900/20">
        <button onClick={() => setSelected(null)} className="text-amber-700 text-2xl px-2">‹</button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl" style={{color: selected.color}}>{selected.symbol}</span>
            <div>
              <p className="text-lg text-amber-400">{selected.english} · {selected.name}</p>
              <p className="text-xs text-amber-800">{selected.dates} · {selected.element}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 px-4 py-3 border-b border-amber-900/10">
        {['monthly','annual'].map(p => (
          <button key={p} onClick={() => changePeriod(p)}
            className={'flex-1 py-2 rounded-lg text-xs capitalize transition-colors border ' +
              (period===p ? 'bg-amber-900/40 text-amber-400 border-amber-700/40' : 'text-amber-800 border-amber-900/20')}>
            {p === 'monthly' ? '🌙 Monthly' : '🪐 Annual 2026'}
          </button>
        ))}
      </div>

      <div className="px-5 pt-4">
        {loading ? (
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="text-4xl animate-spin">☸</div>
            <p className="text-amber-800 text-sm tracking-widest">READING THE STARS...</p>
          </div>
        ) : (
          <div className="prose max-w-none
            prose-headings:text-amber-400 prose-headings:font-light prose-headings:tracking-wide prose-headings:text-base
            prose-p:text-amber-100 prose-p:leading-relaxed prose-p:text-sm
            prose-strong:text-amber-300 prose-li:text-amber-100
            prose-hr:border-amber-900/30 prose-em:text-amber-500">
            <ReactMarkdown>{forecast}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}