import { useState } from 'react'

const API = 'https://jyotish-backend-stw4.onrender.com/api'

const FEATURES = {
  weekly_horoscope: { title: 'Weekly AI Horoscope', icon: '📅', desc: 'Get personalized weekly guidance based on your exact birth chart' },
  annual_horoscope: { title: 'Annual AI Horoscope', icon: '🪐', desc: 'Full year 2026 forecast with quarterly breakdown' },
  chat: { title: 'Unlimited Chat', icon: '💬', desc: 'Upgrade for unlimited questions to your Jyotish Acharya' },
}

export default function PremiumGate({ feature, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('annual')
  const [email, setEmail] = useState('')
  const feat = FEATURES[feature] || { title: 'Premium Feature', icon: '✨', desc: 'Upgrade to access this feature' }

  const handlePayment = async () => {
    if (!email) { alert('Please enter your email'); return }
    setLoading(true)
    try {
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://checkout.razorpay.com/v1/checkout.js'
          script.onload = resolve
          script.onerror = reject
          document.body.appendChild(script)
        })
      }
      const orderRes = await fetch(API + '/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan })
      })
      const orderData = await orderRes.json()
      if (orderData.error) throw new Error(orderData.error)

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Jyotish — Vedic Astrology',
        description: selectedPlan === 'monthly' ? 'Monthly Premium Plan' : 'Annual Premium Plan',
        order_id: orderData.orderId,
        prefill: { email },
        theme: { color: '#d97706' },
        handler: async (response) => {
          const verifyRes = await fetch(API + '/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: selectedPlan,
              email
            })
          })
          const verifyData = await verifyRes.json()
          if (verifyData.token) {
            localStorage.setItem('jyotish_premium_token', verifyData.token)
            localStorage.setItem('jyotish_premium_plan', selectedPlan)
            onSuccess(verifyData.token)
          }
        }
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch(err) {
      alert('Payment error: ' + err.message)
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center p-4">
      <div className="w-full max-w-md bg-[#0d0a1a] border border-amber-900/40 rounded-2xl p-6 pb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs text-amber-700 tracking-widest mb-1">✦ PREMIUM FEATURE</p>
            <h3 className="text-xl text-amber-400">{feat.icon} {feat.title}</h3>
            <p className="text-xs text-amber-700 mt-1">{feat.desc}</p>
          </div>
          <button onClick={onClose} className="text-amber-800 text-xl px-2">✕</button>
        </div>

        <div className="bg-amber-950/30 rounded-xl p-3 mb-4">
          <p className="text-xs text-amber-600 font-medium mb-2">✦ PREMIUM INCLUDES</p>
          {[
            '📅 Weekly + Monthly + Annual AI horoscopes',
            '💬 Unlimited Jyotish Acharya chat',
            '🪐 Full year Sun sign forecasts',
            '⚡ Richer, more detailed readings',
          ].map((b, i) => (
            <p key={i} className="text-xs text-amber-300 py-1.5 border-b border-amber-900/20 last:border-0">{b}</p>
          ))}
        </div>

        <div className="flex gap-3 mb-4">
          {[
            { id: 'monthly', label: 'Monthly', price: '₹299', sub: 'per month' },
            { id: 'annual', label: 'Annual', price: '₹2499', sub: 'Save 30%', badge: 'BEST VALUE' }
          ].map(plan => (
            <button key={plan.id} onClick={() => setSelectedPlan(plan.id)}
              className={'flex-1 border rounded-xl p-3 text-left transition-all ' +
                (selectedPlan === plan.id ? 'border-amber-500 bg-amber-900/30' : 'border-amber-900/30')}>
              {plan.badge && <span className="text-xs bg-amber-600 text-black px-2 py-0.5 rounded-full">{plan.badge}</span>}
              <p className={'text-sm mt-1 ' + (selectedPlan === plan.id ? 'text-amber-300' : 'text-amber-700')}>{plan.label}</p>
              <p className={'text-xl font-bold ' + (selectedPlan === plan.id ? 'text-amber-400' : 'text-amber-800')}>{plan.price}</p>
              <p className="text-xs text-amber-800">{plan.sub}</p>
            </button>
          ))}
        </div>

        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email for payment receipt"
          className="w-full bg-amber-950/20 border border-amber-900/40 rounded-lg px-4 py-2.5 text-amber-100 text-sm mb-3 focus:outline-none focus:border-amber-500"
          style={{colorScheme:'dark'}}
        />

        <button onClick={handlePayment} disabled={loading || !email}
          className="w-full bg-gradient-to-r from-amber-700 to-amber-500 text-slate-900 font-bold py-4 rounded-xl text-sm tracking-wide disabled:opacity-50">
          {loading ? '✦ Processing...' : 'Upgrade to Premium — ' + (selectedPlan === 'monthly' ? '₹299/month' : '₹2499/year')}
        </button>

        <p className="text-xs text-amber-900 text-center mt-2">
          Secure payment via Razorpay · UPI, Cards, Netbanking
        </p>
      </div>
    </div>
  )
}