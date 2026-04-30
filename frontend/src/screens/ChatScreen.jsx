import { isPremiumUser, getPremiumHeaders } from '../utils/premium'
import PremiumGate from '../components/PremiumGate'
import { useState, useRef, useEffect } from 'react'

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

  // Age-specific hooks
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
    hooks.push('How can I improve my financial situation according to Jyotish?')
    hooks.push('What does my chart indicate about my children\'s future?')
  }
  if (ageGroup === 'above50') {
    hooks.push('What does my chart say about health in this phase of life?')
    hooks.push('Is this a good time for pilgrimage or spiritual retreat?')
    hooks.push('What legacy does my chart indicate I will leave behind?')
  }

  // Life stage hooks
  if (lifeStage === 'student') {
    hooks.push('Which subjects or fields suit my chart best?')
    hooks.push('Will I get into my dream institution or job?')
  }
  if (lifeStage === 'working') {
    hooks.push('When will I get a promotion or salary hike according to my Dasha?')
    hooks.push('Should I stay in my current job or move on?')
  }
  if (lifeStage === 'married') {
    hooks.push('How can I improve harmony in my marriage according to Jyotish?')
    hooks.push('What does my chart say about having children?')
  }
  if (lifeStage === 'parent') {
    hooks.push('What does my chart say about my children\'s education and future?')
    hooks.push('How can I balance family and career according to my chart?')
  }
  if (lifeStage === 'retired') {
    hooks.push('What spiritual practice is best for my chart at this stage?')
    hooks.push('What does my chart say about health and longevity?')
  }

  // Relationship hooks
  if (relationshipStatus === 'single') {
    hooks.push('When will I find my life partner according to my chart?')
    hooks.push('What kind of partner is most compatible with my ' + lagna + ' lagna?')
  }
  if (relationshipStatus === 'relationship') {
    hooks.push('Is my partner compatible with my chart?')
    hooks.push('When is the best time for us to get married?')
  }
  if (relationshipStatus === 'married') {
    hooks.push('How can I strengthen my marriage according to Jyotish?')
    hooks.push('What does my 7th house say about my partnership?')
  }
  if (relationshipStatus === 'divorced') {
    hooks.push('What does my chart say about finding love again?')
    hooks.push('How can I heal and move forward according to my chart?')
  }

  // Interest-specific hooks
  if (interests.includes('career')) {
    hooks.push('What career path is best suited for my ' + lagna + ' lagna?')
    hooks.push('When is my career peak according to my ' + dl + ' Dasha?')
  }
  if (interests.includes('love')) {
    hooks.push('What does my 7th house say about my ideal partner?')
    hooks.push('What is the best time for marriage in my chart?')
  }
  if (interests.includes('health')) {
    hooks.push('Which areas of health should I focus on based on my chart?')
    hooks.push('What Ayurvedic practices suit my ' + moonSign + ' Moon?')
  }
  if (interests.includes('spirituality')) {
    hooks.push('What spiritual path is indicated by my chart?')
    hooks.push('Which mantra is most powerful for my ' + lagna + ' lagna?')
  }
  if (interests.includes('property')) {
    hooks.push('Is this a good time to buy property according to my chart?')
  }
  if (interests.includes('travel')) {
    hooks.push('Does my chart indicate foreign travel or settlement abroad?')
  }
  if (interests.includes('education')) {
    hooks.push('What field of study is best for my chart?')
  }
  if (interests.includes('family')) {
    hooks.push('What does my chart say about family harmony?')
  }

  // Dasha hooks
  hooks.push('What does my ' + dl + ' Mahadasha mean for me specifically?')

  // Yoga/Dosha hooks
  if (yogas.find(y => y.name.includes('Gajakesari'))) {
    hooks.push('How can I best activate my Gajakesari Yoga?')
  }
  if (doshas.find(d => d.name === 'Mangal Dosha')) {
    hooks.push('How serious is my Mangal Dosha and what are the best remedies?')
  }

  // Location hook
  hooks.push('Is ' + loc + ' a good place for me according to my chart?')

  // Universal hooks
  hooks.push('What gemstone should I wear based on my ' + lagna + ' lagna?')
  hooks.push('What is my life purpose according to my birth chart?')

  // Shuffle and return top 6 — prioritise demographic-specific ones
  const demographicHooks = hooks.slice(0, hooks.length - 3)
  const universalHooks = hooks.slice(hooks.length - 3)
  const shuffled = demographicHooks.sort(() => Math.random() - 0.5).slice(0, 4)
  return [...shuffled, ...universalHooks.slice(0, 2)]
}

export default function ChatScreen({ chartData, theme, userLocation, onBack }) {
  const t = theme || {}
  const name = chartData?.name?.split(' ')[0] || ''
  const hooks = getSmartHooks(chartData, userLocation)

  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: 'Namaste ' + name + '! I have studied your birth chart carefully. You may ask me anything about your Kundali, Dasha period, relationships, career, health or spiritual path. I can also see you are connecting from ' + (userLocation?.display || 'your location') + ' — I will factor local timing and planetary influences for your region into my guidance. How may I help you today?'
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showAllHooks, setShowAllHooks] = useState(false)
  const [showGate, setShowGate] = useState(false)
const [messageCount, setMessageCount] = useState(0)
  const bottomRef = useRef(null)

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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className={'flex items-center gap-3 px-4 pt-6 pb-4 border-b ' + (t.border || '')}>
        <button onClick={onBack} className={'text-2xl px-2 ' + (t.textMuted || '')}>‹</button>
        <div className="flex-1">
          <p className={'text-lg ' + (t.textAccent || '')}>Jyotish Acharya</p>
          <p className={'text-xs ' + (t.textMuted || '')}>
            {userLocation?.display ? 'Currently in ' + userLocation.display : 'Ask about your birth chart'}
          </p>
        </div>
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div key={i}>
            <div className={'flex ' + (msg.role === 'user' ? 'justify-end' : 'justify-start')}>
              {msg.role === 'assistant' && (
                <div className={'w-7 h-7 rounded-full border flex items-center justify-center text-xs mr-2 mt-1 shrink-0 ' + (t.pill || '') + ' ' + (t.textAccent || '')}>
                  ॐ
                </div>
              )}
              <div className={'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ' +
                (msg.role === 'user'
                  ? (t.chatUser || '') + ' rounded-tr-sm'
                  : (t.chatBot || '') + ' rounded-tl-sm')}>
                {msg.content}
              </div>
            </div>

            {/* Follow-up hooks after assistant message */}
            {msg.role === 'assistant' && msg.followUps?.length > 0 && (
              <div className="ml-9 mt-2 flex flex-wrap gap-2">
                {msg.followUps.map((fu, j) => (
                  <button key={j} onClick={() => sendMessage(fu)}
                    className={'text-xs px-3 py-1.5 rounded-full border ' + (t.pill || '') + ' ' + (t.textAccent || '')}>
                    {fu}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className={'w-7 h-7 rounded-full border flex items-center justify-center text-xs mr-2 mt-1 ' + (t.pill || '') + ' ' + (t.textAccent || '')}>ॐ</div>
            <div className={'rounded-2xl rounded-tl-sm px-4 py-3 ' + (t.chatBot || '')}>
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <div key={i} className={'w-1.5 h-1.5 rounded-full animate-bounce ' + (t.textAccent ? 'bg-amber-500' : 'bg-orange-500')}
                    style={{animationDelay: i*0.15+'s'}}/>
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Smart hooks — only show at start */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <p className={'text-xs mb-2 tracking-widest ' + (t.textMuted || '')}>SUGGESTED FOR YOU</p>
          <div className="flex flex-wrap gap-2">
            {visibleHooks.map((q, i) => (
              <button key={i} onClick={() => sendMessage(q)}
                className={'text-xs border rounded-full px-3 py-1.5 text-left ' + (t.pill || '') + ' ' + (t.textMuted || '')}>
                {q}
              </button>
            ))}
          </div>
          {hooks.length > 3 && (
            <button onClick={() => setShowAllHooks(!showAllHooks)}
              className={'text-xs mt-2 ' + (t.textAccent || '')}>
              {showAllHooks ? 'Show less' : 'Show more questions'}
            </button>
          )}
        </div>
      )}

      {/* Input */}
      <div className={'px-4 pb-6 pt-2 border-t ' + (t.border || '')}>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()}
            placeholder="Ask your Jyotishi..."
            className={'flex-1 border rounded-xl px-4 py-3 text-sm focus:outline-none ' + (t.input || '')}
            style={{colorScheme: t.bg?.includes('050310') ? 'dark' : 'light'}}
          />
          <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
            className={'w-12 h-12 rounded-xl border text-lg disabled:opacity-40 flex items-center justify-center ' + (t.pill || '') + ' ' + (t.textAccent || '')}>
            ➤
          </button>
        </div>
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