import { useState } from 'react'
import { isPremiumUser, getPremiumToken, clearPremium } from '../utils/premium'

export default function SettingsScreen({ onBack, chartData }) {
  const isPremium = isPremiumUser()
  const [showConfirm, setShowConfirm] = useState(false)

  const getPlanDetails = () => {
    try {
      const token = getPremiumToken()
      if (!token) return null
      const payload = JSON.parse(atob(token.split('.')[1]))
      const expiry = new Date(payload.exp * 1000)
      return {
        plan: payload.plan,
        email: payload.email,
        expiry: expiry.toLocaleDateString('en-IN', {day:'numeric', month:'long', year:'numeric'}),
        daysLeft: Math.max(0, Math.ceil((expiry - Date.now()) / 86400000))
      }
    } catch(e) { return null }
  }

  const planDetails = getPlanDetails()

  const handleCancelPremium = () => {
    clearPremium()
    setShowConfirm(false)
    alert('Premium cancelled. You will retain access until your subscription expires.')
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">

      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 pt-12 pb-4">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 text-sm mb-4">
          ← Back
        </button>
        <h1 className="font-serif text-3xl text-slate-900 font-light">Settings</h1>
      </div>

      <div className="px-4 py-6 flex flex-col gap-4">

        {/* Subscription Status */}
        <div>
          <p className="text-xs font-semibold text-slate-400 tracking-widest mb-2 px-2">SUBSCRIPTION</p>
          {isPremium && planDetails ? (
            <div className="bg-slate-900 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-white font-semibold">✦ Premium Active</p>
                  <p className="text-slate-400 text-xs mt-0.5 capitalize">{planDetails.plan} Plan</p>
                </div>
                <div className="bg-amber-400 rounded-xl px-3 py-1.5">
                  <p className="text-slate-900 text-xs font-bold">{planDetails.daysLeft} days left</p>
                </div>
              </div>
              <div className="bg-slate-800 rounded-xl p-3 mb-3">
                <p className="text-slate-400 text-xs">Registered email</p>
                <p className="text-white text-sm mt-0.5">{planDetails.email}</p>
              </div>
              <div className="bg-slate-800 rounded-xl p-3 mb-4">
                <p className="text-slate-400 text-xs">Expires on</p>
                <p className="text-white text-sm mt-0.5">{planDetails.expiry}</p>
              </div>
              <div className="flex flex-col gap-2">
                {[
                  '📅 Monthly + Annual AI horoscopes',
                  '💬 Unlimited Jyotish Acharya chat',
                  '☀️ Monthly + Annual Sun sign forecasts',
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"/>
                    <p className="text-slate-300 text-xs">{b}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowConfirm(true)}
                className="mt-4 w-full py-2.5 rounded-xl border border-slate-700 text-slate-400 text-xs">
                Cancel subscription
              </button>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="font-semibold text-slate-900 mb-1">Free Plan</p>
              <p className="text-slate-500 text-xs mb-4">Weekly horoscope · 3 chat messages/day · Basic chart</p>
              <div className="flex flex-col gap-2 mb-4">
                {[
                  {free: true, label: 'Weekly horoscope'},
                  {free: true, label: '3 AI chat messages/day'},
                  {free: true, label: 'Full birth chart + PDF'},
                  {free: false, label: 'Monthly + Annual horoscopes'},
                  {free: false, label: 'Unlimited AI chat'},
                  {free: false, label: 'Sun sign monthly + annual'},
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className={`text-sm ${item.free ? 'text-green-500' : 'text-slate-300'}`}>
                      {item.free ? '✓' : '○'}
                    </span>
                    <p className={`text-sm ${item.free ? 'text-slate-700' : 'text-slate-400'}`}>{item.label}</p>
                    {!item.free && <span className="text-xs text-amber-600 ml-auto font-semibold">Premium</span>}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <div className="flex-1 bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
                  <p className="text-slate-900 font-bold text-lg">₹49</p>
                  <p className="text-slate-400 text-xs">per month</p>
                </div>
                <div className="flex-1 bg-slate-900 rounded-xl p-3 text-center">
                  <p className="text-white font-bold text-lg">₹449</p>
                  <p className="text-slate-400 text-xs">per year</p>
                  <p className="text-amber-400 text-xs font-semibold">SAVE 25%</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* App Info */}
        <div>
          <p className="text-xs font-semibold text-slate-400 tracking-widest mb-2 px-2">ABOUT</p>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {[
              {label: 'Version', value: '1.0.0'},
              {label: 'Calculation Engine', value: 'Swiss Ephemeris'},
              {label: 'Ayanamsha', value: 'Lahiri'},
              {label: 'AI Model', value: 'Gemini 2.5 Flash Lite'},
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center px-4 py-3.5 border-b border-slate-100 last:border-0">
                <p className="text-slate-600 text-sm">{item.label}</p>
                <p className="text-slate-400 text-xs font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Support */}
        <div>
          <p className="text-xs font-semibold text-slate-400 tracking-widest mb-2 px-2">SUPPORT</p>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {[
              {label: '📧 Contact Support', value: 'support@myjyotish-ai.in'},
              {label: '🌐 Website', value: 'myjyotish-ai.in'},
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center px-4 py-3.5 border-b border-slate-100 last:border-0">
                <p className="text-slate-700 text-sm font-medium">{item.label}</p>
                <p className="text-slate-400 text-xs">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Legal */}
        <div>
          <p className="text-xs font-semibold text-slate-400 tracking-widest mb-2 px-2">LEGAL</p>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {[
              {label: 'Terms & Conditions'},
              {label: 'Privacy Policy'},
              {label: 'Disclaimer'},
              {label: 'Refund Policy'},
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center px-4 py-3.5 border-b border-slate-100 last:border-0">
                <p className="text-slate-700 text-sm">{item.label}</p>
                <span className="text-slate-400 text-xs">→</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 pb-4">
          Jyotish · myjyotish-ai.in · v1.0.0
        </p>
      </div>

      {/* Cancel confirmation modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="font-semibold text-slate-900 text-lg mb-2">Cancel subscription?</h3>
            <p className="text-slate-500 text-sm mb-4">
              You will retain premium access until {planDetails?.expiry}. After that you will revert to the free plan.
            </p>
            <p className="text-slate-400 text-xs mb-5">
              For refunds, email support@myjyotish-ai.in within the refund window.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium">
                Keep Premium
              </button>
              <button onClick={handleCancelPremium}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-medium">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}