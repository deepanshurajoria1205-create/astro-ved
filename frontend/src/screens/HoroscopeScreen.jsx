import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { isPremiumUser, getPremiumHeaders, getPremiumToken } from '../utils/premium'
import PremiumGate from '../components/PremiumGate'

const API = 'https://jyotish-backend-stw4.onrender.com/api'

export default function HoroscopeScreen({ chartData, initialType, onBack }) {
  const [type, setType] = useState(initialType || 'weekly')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [useAI, setUseAI] = useState(true)
  const [showGate, setShowGate] = useState(false)
  const [gateFeature, setGateFeature] = useState('')

  const fetchHoroscope = async (period) => {
    if (!isPremiumUser() && (period === 'monthly' || period === 'annual')) {
      setGateFeature(period + '_horoscope')
      setShowGate(true)
      return
    }
    setLoading(true)
    setText('')
    try {
      const endpoint = useAI ? `${API}/ai-horoscope` : `${API}/horoscope`
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getPremiumHeaders() },
        body: JSON.stringify({ chartData, period })
      })
      const data = await res.json()
      if (data.error === 'premium_required') {
        setGateFeature(period + '_horoscope')
        setShowGate(true)
        setLoading(false)
        return
      }
      setText(data.horoscope || 'Unable to generate reading.')
    } catch(e) {
      setText('Connection error. Please try again.')
    }
    setLoading(false)
  }

  useEffect(() => { fetchHoroscope(type) }, [type, useAI])

  const TABS = [
    { id: 'weekly', label: 'Weekly', free: true },
    { id: 'monthly', label: 'Monthly', free: false },
    { id: 'annual', label: 'Annual', free: false },
  ]

  return (
    <div className="min-h-screen bg-[#FAFAF8]">

      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 pt-12 pb-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-serif text-2xl text-slate-900">
              {type.charAt(0).toUpperCase() + type.slice(1)} Reading
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">
              {chartData?.name} · {chartData?.moonSign} Rashi
            </p>
          </div>
          {/* AI Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">AI</span>
            <button onClick={() => setUseAI(!useAI)}
              className={`w-11 h-6 rounded-full transition-colors relative ${useAI ? 'bg-slate-900' : 'bg-slate-200'}`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${useAI ? 'translate-x-5' : 'translate-x-0.5'}`}/>
            </button>
          </div>
        </div>

        {/* Period tabs */}
        <div className="flex gap-2">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setType(tab.id)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                type === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}>
              {tab.label}
              {!tab.free && !isPremiumUser() ? ' 🔒' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pt-6 pb-10">
        {useAI && !loading && text && (
          <div className="flex items-center gap-2 mb-4 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
            <span className="text-amber-500 text-xs">✦</span>
            <span className="text-xs text-amber-700 font-medium">AI-powered reading by Jyotish Acharya</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center gap-4 py-20">
            <div className="w-12 h-12 rounded-full border-2 border-slate-200 border-t-slate-900 animate-spin"/>
            <p className="text-slate-400 text-sm">
              {useAI ? 'Consulting the stars...' : 'Reading the cosmos...'}
            </p>
          </div>
        ) : (
          <div className="prose max-w-none">
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        )}
      </div>

      {showGate && (
        <PremiumGate
          feature={gateFeature}
          onClose={() => { setShowGate(false); setType('weekly'); }}
          onSuccess={() => { setShowGate(false); fetchHoroscope(type) }}
        />
      )}
    </div>
  )
}