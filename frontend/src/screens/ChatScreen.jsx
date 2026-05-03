import { useState, useRef, useEffect } from 'react'
import { isPremiumUser, getPremiumHeaders } from '../utils/premium'
import PremiumGate from '../components/PremiumGate'

const API = 'https://jyotish-backend-stw4.onrender.com/api'

function getSmartHooks(chartData, userLocation) {
  const hooks = []
  const dl = chartData?.dasha?.current
  const moonSign = chartData?.moonSign
  const lagna = chartData?.ascendant?.sign
  const yogas = chartData?.yogas || []
  const doshas = chartData?.doshas || []
  const demo = chartData?.demographics || {}
  const loc = userLocation?.city || 'your location'
  const { ageGroup, lifeStage, relationshipStatus, primaryInterest } = demo
  const interests = Array.isArray(primaryInterest) ? primaryInterest : [primaryInterest].filter(Boolean)

  if (ageGroup === 'under25') {
    hooks.push('What career path suits my birth chart best?')
    hooks.push('What does my chart say about my love life right now?')
    hooks.push('Will I study or work abroad according to my chart?')
  }
  if (ageGroup === '25to35') {
    hooks.push('Is this the right time to switch careers according to my Dasha?')
    hooks.push('What does my chart say about marriage timing?')
    hooks.push('When is a good time to start a business?')
  }
  if (ageGroup === '35to50') {
    hooks.push('What does my chart say about my career peak years?')
    hooks.push('How can I improve my financial situation?')
    hooks.push('What does my chart indicate about my children\'s future?')
  }
  if (ageGroup === 'above50') {
    hooks.push('What does my chart say about health in this phase?')
    hooks.push('Is this a good time for pilgrimage or spiritual retreat?')
    hooks.push('What legacy does my chart indicate I will leave?')
  }
  if (lifeStage === 'student') {
    hooks.push('Which subjects or fields suit my chart best?')
    hooks.push('Will I get into my dream institution?')
  }
  if (lifeStage === 'working') {
    hooks.push('When will I get a promotion according to my Dasha?')
    hooks.push('Should I stay in my current job or move on?')
  }
  if (lifeStage === 'married') {
    hooks.push('How can I improve harmony in my marriage?')
    hooks.push('What does my chart say about having children?')
  }
  if (lifeStage === 'parent') {
    hooks.push('What does my chart say about my children\'s future?')
  }
  if (lifeStage === 'retired') {
    hooks.push('What spiritual practice is best for my chart?')
    hooks.push('What does my chart say about health and longevity?')
  }
  if (relationshipStatus === 'single') {
    hooks.push('When will I find my life partner?')
    hooks.push('What kind of partner suits my ' + lagna + ' lagna?')
  }
  if (relationshipStatus === 'relationship') {
    hooks.push('Is my partner compatible with my chart?')
    hooks.push('When is the best time for us to get married?')
  }
  if (relationshipStatus === 'divorced') {
    hooks.push('What does my chart say about finding love again?')
  }
  if (interests.includes('career')) {
    hooks.push('What career is best suited for my ' + lagna + ' lagna?')
  }
  if (interests.includes('health')) {
    hooks.push('What Ayurvedic practices suit my ' + moonSign + ' Moon?')
  }
  if (interests.includes('spirituality')) {
    hooks.push('Which mantra is most powerful for my chart?')
  }
  if (interests.includes('property')) {
    hooks.push('Is this a good time to buy property?')
  }
  if (interests.includes('travel')) {
    hooks.push('Does my chart indicate foreign travel or settlement?')
  }
  hooks.push('What does my ' + dl + ' Mahadasha mean for me?')
  if (yogas.find(y => y.name.includes('Gajakesari'))) {
    hooks.push('How can I activate my Gajakesari Yoga?')
  }
  if (doshas.find(d => d.name === 'Mangal Dosha')) {
    hooks.push('What are the best remedies for my Mangal Dosha?')
  }
  hooks.push('Is ' + loc + ' a good place for me astrologically?')
  hooks.push('What gemstone should I wear for my ' + lagna + ' lagna?')
  hooks.push('What is my life purpose according to my chart?')

  const demographicHooks = hooks.slice(0, hooks.length - 3)
  const universalHooks = hooks.slice(hooks.length - 3)
  return [...demographicHooks.sort(() => Math.random() - 0.5).slice(0, 4), ...universalHooks.slice(0, 2)]
}

export default function ChatScreen({ chartData, theme, userLocation, onBack }) {
  const name = chartData?.name?.split(' ')[0] || ''
  const hooks = getSmartHooks(chartData, userLocation)

  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: 'Namaste ' + name + '! I have studied your birth chart carefully. Ask me anything about your Kundali, Dasha period, relationships, career, health or spiritual path.' + (userLocation?.display ? ' I can see you are connecting from ' + userLocation.display + ' — I will factor local timing into my guidance.' : '') + ' How may I help you today?'
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showAllHooks, setShowAllHooks] = useState(false)
  const [showGate, setShowGate] = useState(false)
  const [messageCount, setMessageCount] = useState(0)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (question) => {
    const q = question || input.trim()
    if (!q) return
    if (!isPremiumUser() && messageCount >= 3) {
      setShowGate(true)
      return
    }
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: q }])
    setMessageCount(prev => prev + 1)
    setLoading(true)
    try {
      const res = await fetch(`${API}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getPremiumHeaders() },
        body: JSON.stringify({
          question: q,
          chartData,
          userLocation,
          history: messages.slice(-6),
          messageCount
        })
      })
      const data = await res.json()
      if (data.error === 'premium_required') {
        setShowGate(true)
        setLoading(false)
        return
      }
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.answer || 'Please try again.',
        followUps: data.followUps || []
      }])
    } catch(e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }])
    }
    setLoading(false)
  }

  const visibleHooks = showAllHooks ? hooks : hooks.slice(0, 3)
  const freeMessagesLeft = Math.max(0, 3 - messageCount)

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col">

      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 pt-12 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-serif">ॐ</span>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-900 text-sm">Jyotish Acharya</p>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500"/>
              <p className="text-xs text-slate-400">
                {userLocation?.display ? 'Reading for ' + userLocation.display : 'Personal consultation'}
              </p>
            </div>
          </div>
          {!isPremiumUser() && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-1.5">
              <p className="text-xs text-amber-700 font-semibold">{freeMessagesLeft} free left</p>
            </div>
          )}
          {isPremiumUser() && (
            <div className="bg-slate-900 rounded-xl px-3 py-1.5">
              <p className="text-xs text-white font-semibold">✦ Premium</p>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {messages.map((msg, i) => (
          <div key={i}>
            <div className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0 mt-1">
                  <span className="text-white text-xs font-serif">ॐ</span>
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-slate-900 text-white rounded-tr-sm'
                  : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm'
              }`}>
                {msg.content}
              </div>
            </div>

            {/* Follow-up suggestions */}
            {msg.role === 'assistant' && msg.followUps?.length > 0 && (
              <div className="ml-11 mt-2 flex flex-wrap gap-2">
                {msg.followUps.map((fu, j) => (
                  <button key={j} onClick={() => sendMessage(fu)}
                    className="text-xs px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-slate-400 transition-colors shadow-sm">
                    {fu}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-serif">ॐ</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1.5 items-center h-5">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-slate-300 animate-bounce"
                    style={{animationDelay: i * 0.15 + 's'}}/>
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Smart hooks */}
      {messages.length <= 2 && (
        <div className="px-4 pb-3">
          <p className="text-xs font-semibold text-slate-400 tracking-widest mb-2">SUGGESTED FOR YOU</p>
          <div className="flex flex-wrap gap-2">
            {visibleHooks.map((q, i) => (
              <button key={i} onClick={() => sendMessage(q)}
                className="text-xs border border-slate-200 bg-white rounded-full px-3 py-2 text-slate-600 hover:border-slate-400 transition-colors shadow-sm text-left">
                {q}
              </button>
            ))}
          </div>
          {hooks.length > 3 && (
            <button onClick={() => setShowAllHooks(!showAllHooks)}
              className="text-xs text-amber-600 font-semibold mt-2">
              {showAllHooks ? 'Show less' : 'Show more suggestions'}
            </button>
          )}
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-24 pt-2 bg-white border-t border-slate-100">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()}
            placeholder="Ask your Jyotishi..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
          <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
            className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center disabled:opacity-40 active:scale-95 transition-transform shadow-sm">
            ➤
          </button>
        </div>
        {!isPremiumUser() && freeMessagesLeft === 0 && (
          <p className="text-xs text-center text-amber-600 mt-2 font-medium">
            Free limit reached · <button onClick={() => setShowGate(true)} className="underline">Upgrade for unlimited chat</button>
          </p>
        )}
      </div>

      {showGate && (
        <PremiumGate
          feature="chat"
          onClose={() => setShowGate(false)}
          onSuccess={() => setShowGate(false)}
        />
      )}
    </div>
  )
}