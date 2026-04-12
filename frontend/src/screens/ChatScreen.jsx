import { useState, useRef, useEffect } from 'react'

const API = 'https://jyotish-backend-stw4.onrender.com/api'

const SUGGESTED = [
  "What does my chart say about my career?",
  "When will I get married?",
  "What are my strongest planets?",
  "What does my current Dasha mean?",
  "How can I improve my finances?",
  "What is my purpose in this life?",
  "Which gemstone should I wear?",
  "Is this a good time for a new business?",
]

export default function ChatScreen({ chartData, onBack }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Namaste ${chartData?.name?.split(' ')[0] || ''}! 🙏 I am your Jyotish Acharya. I have studied your birth chart carefully. You may ask me anything about your Kundali, your Dasha period, relationships, career, health or spiritual path. How may I guide you today?` }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (question) => {
    const q = question || input.trim()
    if (!q) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: q }])
    setLoading(true)

    try {
      const res = await fetch(`${API}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          chartData,
          history: messages.slice(-6)
        })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer || 'Please try again.' }])
    } catch(e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }])
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4 border-b border-amber-900/20">
        <button onClick={onBack} className="text-amber-700 text-2xl px-2">‹</button>
        <div>
          <p className="text-lg text-amber-400">Jyotish Acharya</p>
          <p className="text-xs text-amber-800">Ask about your birth chart</p>
        </div>
        <div className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-amber-900/40 border border-amber-700/30 flex items-center justify-center text-xs mr-2 mt-1 shrink-0">
                ॐ
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed
              ${msg.role === 'user'
                ? 'bg-amber-700/30 text-amber-100 rounded-tr-sm'
                : 'bg-amber-950/40 border border-amber-900/30 text-amber-200 rounded-tl-sm'}`}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-amber-900/40 border border-amber-700/30 flex items-center justify-center text-xs mr-2 mt-1">ॐ</div>
            <div className="bg-amber-950/40 border border-amber-900/30 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-bounce"
                    style={{animationDelay:`${i*0.15}s`}}/>
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Suggested questions — only show at start */}
      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-amber-800 mb-2 tracking-widest">SUGGESTED QUESTIONS</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED.slice(0,4).map((q,i) => (
              <button key={i} onClick={() => sendMessage(q)}
                className="text-xs bg-amber-950/30 border border-amber-900/30 text-amber-600 px-3 py-1.5 rounded-full">
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-6 pt-2 border-t border-amber-900/20">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()}
            placeholder="Ask your Jyotishi..."
            className="flex-1 bg-amber-950/20 border border-amber-900/40 rounded-xl px-4 py-3 text-amber-100 text-sm focus:outline-none focus:border-amber-500"
            style={{colorScheme:'dark'}}
          />
          <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
            className="w-12 h-12 rounded-xl bg-amber-700/40 border border-amber-700/40 text-amber-400 text-lg disabled:opacity-40 flex items-center justify-center">
            ➤
          </button>
        </div>
      </div>
    </div>
  )
}