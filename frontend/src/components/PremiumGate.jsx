import { useState } from 'react'

const API = 'https://jyotish-backend-stw4.onrender.com/api'

const FEATURES = {
  monthly_horoscope: { title: 'Monthly Horoscope', icon: '📅', desc: 'Detailed monthly reading based on your birth chart' },
  annual_horoscope: { title: 'Annual Horoscope', icon: '🪐', desc: 'Full year 2026 forecast with quarterly breakdown' },
  chat: { title: 'Unlimited AI Chat', icon: '💬', desc: 'Unlimited questions to your personal Jyotish Acharya' },
  sun_monthly: { title: 'Monthly Sun Sign', icon: '☀️', desc: 'Detailed monthly Sun sign forecast' },
  sun_annual: { title: 'Annual Sun Sign', icon: '🪐', desc: 'Full year Sun sign forecast for 2026' },
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
        name: 'Jyotish',
        description: selectedPlan === 'monthly' ? 'Monthly Premium — ₹49' : 'Annual Premium — ₹599',
        order_id: orderData.orderId,
        prefill: { email },
        theme: { color: '#0f172a' },
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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl">

        {/* Top section */}
        <div className="bg-slate-900 px-6 pt-6 pb-8 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors text-lg font-bold">
  ✕
</button>
          <p className="text-amber-400 text-xs font-semibold tracking-widest mb-2">PREMIUM FEATURE</p>
          <h2 className="font-serif text-3xl text-white font-light mb-1">{feat.icon} {feat.title}</h2>
          <p className="text-slate-400 text-sm">{feat.desc}</p>
        </div>

        <div className="px-6 py-6">
          {/* Benefits */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-slate-400 tracking-widest mb-3">WHAT YOU GET</p>
            {[
              '📅 Monthly + Annual AI horoscopes',
              '💬 Unlimited Jyotish Acharya chat',
              '☀️ Monthly + Annual Sun sign forecasts',
              '⚡ Richer, more detailed readings',
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-0">
                <span className="text-slate-900 text-sm">{b}</span>
              </div>
            ))}
          </div>

          {/* Plan selector */}
          <div className="flex gap-3 mb-4">
            {[
              { id: 'monthly', label: 'Monthly', price: '₹49', sub: 'per month' },
              { id: 'annual', label: 'Annual', price: '₹599', sub: 'per year', badge: 'SAVE 17%' }
            ].map(plan => (
              <button key={plan.id} onClick={() => setSelectedPlan(plan.id)}
                className={`flex-1 border-2 rounded-2xl p-3 text-left transition-all ${
                  selectedPlan === plan.id
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-slate-200 bg-white'
                }`}>
                {plan.badge && (
                  <span className="text-xs bg-amber-400 text-slate-900 font-bold px-2 py-0.5 rounded-full">{plan.badge}</span>
                )}
                <p className={`text-sm font-semibold mt-1 ${selectedPlan === plan.id ? 'text-slate-900' : 'text-slate-500'}`}>{plan.label}</p>
                <p className={`text-2xl font-bold ${selectedPlan === plan.id ? 'text-slate-900' : 'text-slate-400'}`}>{plan.price}</p>
                <p className={`text-xs ${selectedPlan === plan.id ? 'text-slate-500' : 'text-slate-400'}`}>{plan.sub}</p>
              </button>
            ))}
          </div>

          {/* Email */}
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email for payment receipt"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm mb-4 focus:outline-none focus:border-slate-400"
          />

          {/* Pay button */}
          <button onClick={handlePayment} disabled={loading || !email}
            className="w-full bg-slate-900 text-white font-semibold py-4 rounded-2xl text-sm tracking-wide disabled:opacity-40 active:scale-95 transition-transform">
            {loading ? 'Processing...' : `Upgrade — ${selectedPlan === 'monthly' ? '₹49/month' : '₹599/year'}`}
          </button>

          <p className="text-xs text-slate-400 text-center mt-3">
  Secure payment via Razorpay · UPI, Cards, Netbanking
</p>
<button onClick={onClose} className="w-full text-center text-sm text-slate-400 mt-3 py-2">
  No thanks, continue for free
</button>
        </div>
      </div>
    </div>
  )
}