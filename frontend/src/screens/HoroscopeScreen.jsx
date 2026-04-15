import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

const API = 'https://jyotish-backend-stw4.onrender.com/api'

export default function HoroscopeScreen({ chartData, initialType, onBack, theme }) {
  const t = theme || {}
  const [type, setType] = useState(initialType)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [useAI, setUseAI] = useState(true)

  const fetchHoroscope = async (period) => {
    setLoading(true)
    setText('')
    try {
      const endpoint = useAI ? `${API}/ai-horoscope` : `${API}/horoscope`
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chartData, period })
      })
      const data = await res.json()
      setText(data.horoscope || 'Unable to generate reading.')
    } catch(e) {
      setText('Connection error. Please try again.')
    }
    setLoading(false)
  }

  useEffect(() => { fetchHoroscope(type) }, [type, useAI])

  return (
    <div className="min-h-screen pb-10">
      <div className="flex items-center gap-3 px-4 pt-6 pb-4 border-b border-amber-900/20">
        <button onClick={onBack} className="text-amber-700 text-2xl px-2">&#8249;</button>
        <div className="flex-1">
          <p className="text-lg text-amber-400 capitalize">{type} Reading</p>
          <p className="text-xs text-amber-800">{chartData.name} · {chartData.moonSign} Rashi</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-800">AI</span>
          <button onClick={() => setUseAI(!useAI)}
            className={'w-10 h-5 rounded-full transition-colors relative ' + (useAI ? 'bg-amber-500' : 'bg-amber-900/40')}>
            <span className={'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ' + (useAI ? 'translate-x-5' : 'translate-x-0.5')}/>
          </button>
        </div>
      </div>

      <div className="flex gap-2 px-4 py-3 border-b border-amber-900/10">
        {['weekly','monthly','annual'].map(tab => (
          <button key={tab} onClick={() => setType(tab)}
            className={'flex-1 py-2 rounded-lg text-xs capitalize transition-colors border ' +
              (type===tab ? 'bg-amber-900/40 text-amber-400 border-amber-700/40' : 'text-amber-800 border-amber-900/20')}>
            {tab}
          </button>
        ))}
      </div>

      {useAI && !loading && (
        <div className="mx-5 mt-3 px-3 py-1.5 bg-amber-950/30 border border-amber-900/20 rounded-lg flex items-center gap-2">
          <span className="text-amber-500 text-xs">&#10022;</span>
          <span className="text-xs text-amber-700">AI-powered reading by Jyotish Acharya</span>
        </div>
      )}

      <div className="px-5 pt-4">
        {loading ? (
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="text-4xl animate-spin">&#9784;</div>
            <p className="text-amber-800 text-sm tracking-widest">
              {useAI ? 'CONSULTING THE STARS...' : 'READING THE COSMOS...'}
            </p>
          </div>
        ) : (
          <div className="prose max-w-none
            prose-headings:text-amber-400 prose-headings:font-light prose-headings:tracking-wide prose-headings:text-base
            prose-p:text-amber-100 prose-p:leading-relaxed prose-p:text-sm
            prose-strong:text-amber-300 prose-li:text-amber-100 prose-li:text-sm
            prose-hr:border-amber-900/30 prose-em:text-amber-500">
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}