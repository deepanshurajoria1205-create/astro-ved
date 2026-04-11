import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

const API = window.location.origin + '/api'

export default function HoroscopeScreen({ chartData, initialType, onBack }) {
  const [type, setType] = useState(initialType)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const fetch_ = async (period) => {
    setLoading(true)
    setText('')
    try {
      const res = await fetch(`${API}/horoscope`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({chartData, period})
      })
      const data = await res.json()
      setText(data.horoscope || 'Unable to generate reading.')
    } catch(e) {
      setText('Connection error. Please check the backend is running.')
    }
    setLoading(false)
  }

  useEffect(() => { fetch_(type) }, [type])

  return (
    <div className="min-h-screen pb-10">
      <div className="flex items-center gap-3 px-4 pt-6 pb-4 border-b border-amber-900/20">
        <button onClick={onBack} className="text-amber-700 text-2xl px-2">‹</button>
        <div>
          <p className="text-lg text-amber-400 capitalize">{type} Reading</p>
          <p className="text-xs text-amber-800">{chartData.name} • {chartData.moonSign} Rashi</p>
        </div>
      </div>

      <div className="flex gap-2 px-4 py-3 border-b border-amber-900/10">
        {['weekly','monthly','annual'].map(t => (
          <button key={t} onClick={() => setType(t)}
            className={`flex-1 py-2 rounded-lg text-xs capitalize transition-colors
              ${type===t ? 'bg-amber-900/40 text-amber-400 border border-amber-700/40' : 'text-amber-800 border border-amber-900/20'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="px-5 pt-5">
        {loading ? (
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="text-4xl animate-spin">☸</div>
            <p className="text-amber-800 text-sm tracking-widest">READING THE COSMOS...</p>
          </div>
        ) : (
          <div className="prose prose-invert prose-amber max-w-none
            prose-headings:text-amber-400 prose-headings:font-light prose-headings:tracking-wide
            prose-p:text-amber-200 prose-p:leading-relaxed prose-p:text-sm
            prose-strong:text-amber-400 prose-li:text-amber-200 prose-li:text-sm
            prose-hr:border-amber-900/30">
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}