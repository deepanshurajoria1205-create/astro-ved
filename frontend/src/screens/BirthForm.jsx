import { useState, useEffect, useRef } from 'react'

const API = 'https://jyotish-backend-stw4.onrender.com/api'

export default function BirthForm({ onCalculated, theme }) {
  const t = theme || {}
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '', dob: '', tob: '', pob: '', gender: 'Male', lat: null, lon: null
  })
  const [demographics, setDemographics] = useState({
    ageGroup: '', lifeStage: '', relationshipStatus: '', primaryInterest: []
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [placeSuggestions, setPlaceSuggestions] = useState([])
  const [placeLoading, setPlaceLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const placeTimer = useRef(null)
  const suggestionsRef = useRef(null)

  const set = (k, v) => setForm(p => ({...p, [k]: v}))
  const setDemo = (k, v) => setDemographics(p => ({...p, [k]: v}))

  const searchPlaces = async (query) => {
    if (query.length < 3) { setPlaceSuggestions([]); return }
    setPlaceLoading(true)
    try {
      const res = await fetch(
        'https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(query) + '&format=json&limit=6&addressdetails=1',
        { headers: { 'Accept-Language': 'en' } }
      )
      const data = await res.json()
      setPlaceSuggestions(data.map(p => ({
        display: p.display_name,
        short: [p.address?.city||p.address?.town||p.address?.village||p.address?.county, p.address?.state, p.address?.country].filter(Boolean).join(', '),
        lat: parseFloat(p.lat),
        lon: parseFloat(p.lon)
      })))
      setShowSuggestions(true)
    } catch(e) { setPlaceSuggestions([]) }
    setPlaceLoading(false)
  }

  const handlePlaceInput = (val) => {
    set('pob', val)
    set('lat', null)
    set('lon', null)
    clearTimeout(placeTimer.current)
    placeTimer.current = setTimeout(() => searchPlaces(val), 400)
  }

  const selectPlace = (place) => {
    setForm(p => ({...p, pob: place.short || place.display, lat: place.lat, lon: place.lon}))
    setPlaceSuggestions([])
    setShowSuggestions(false)
  }

  useEffect(() => {
    const handler = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const validateStep1 = () => {
    if (!form.name.trim()) { setErrors({name:'Name is required'}); return false }
    if (!demographics.ageGroup) { setErrors({ageGroup:'Please select your age group'}); return false }
    if (!demographics.lifeStage) { setErrors({lifeStage:'Please select your life stage'}); return false }
    if (!demographics.primaryInterest.length) { setErrors({primaryInterest:'Please select at least one area'}); return false }
    setErrors({})
    return true
  }

  const validateStep2 = () => {
    const e = {}
    if (!form.dob) e.dob = 'Date of birth is required'
    if (!form.tob) e.tob = 'Time of birth is required'
    if (!form.pob.trim()) e.pob = 'Place of birth is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validateStep2()) return
    setLoading(true)
    try {
      const payload = { ...form, demographics }
      const res = await fetch(API + '/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      const hRes = await fetch(API + '/horoscope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chartData: {...data, name: form.name}, period: 'weekly' })
      })
      const hData = await hRes.json()
      onCalculated({...data, weeklyHoroscope: hData.horoscope, demographics}, form)
    } catch(err) {
      alert('Error: ' + err.message)
    }
    setLoading(false)
  }

  const AGE_OPTIONS = [
    {value:'under25', label:'Under 25', emoji:'🌱'},
    {value:'25to35', label:'25-35', emoji:'⚡'},
    {value:'35to50', label:'35-50', emoji:'🌟'},
    {value:'above50', label:'50+', emoji:'🧘'},
  ]

  const LIFE_OPTIONS = [
    {value:'student', label:'Student', emoji:'📚'},
    {value:'working', label:'Working', emoji:'💼'},
    {value:'married', label:'Married', emoji:'💑'},
    {value:'parent', label:'Parent', emoji:'👨‍👩‍👧'},
    {value:'retired', label:'Retired', emoji:'🌅'},
  ]

  const RELATION_OPTIONS = [
    {value:'single', label:'Single', emoji:'🌸'},
    {value:'relationship', label:'In a Relationship', emoji:'💕'},
    {value:'married', label:'Married', emoji:'💍'},
    {value:'divorced', label:'Separated', emoji:'🌊'},
  ]

  const INTEREST_OPTIONS = [
    {value:'career', label:'Career & Money', emoji:'💼'},
    {value:'love', label:'Love & Marriage', emoji:'💕'},
    {value:'health', label:'Health', emoji:'🌿'},
    {value:'spirituality', label:'Spirituality', emoji:'🪔'},
    {value:'family', label:'Family', emoji:'🏠'},
    {value:'education', label:'Education', emoji:'📚'},
    {value:'travel', label:'Travel & Foreign', emoji:'✈️'},
    {value:'property', label:'Property', emoji:'🏡'},
  ]

  const toggleInterest = (val) => {
    const current = demographics.primaryInterest
    const updated = current.includes(val)
      ? current.filter(v => v !== val)
      : [...current, val]
    setDemo('primaryInterest', updated)
  }

  // STEP 1 - Demographics
  if (step === 1) return (
    <div className="min-h-screen pb-10">
      <div className="px-6 pt-10 pb-5 border-b border-amber-900/30">
        <p className="text-xs tracking-[0.3em] text-amber-800 mb-1">WELCOME TO</p>
        <h2 className="text-3xl text-amber-400 font-light">Jyotish</h2>
        <p className="text-xs text-amber-700 mt-1">Let us personalise your cosmic journey</p>
      </div>

      <div className="px-5 pt-6 flex flex-col gap-6">

        {/* Name */}
        <div>
          <label className="text-xs text-amber-700 tracking-[0.15em] block mb-2">👤 Your Name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="Enter your full name"
            className="w-full bg-amber-950/20 border border-amber-900/40 rounded-lg px-4 py-3 text-amber-100 text-sm focus:outline-none focus:border-amber-500"
            style={{colorScheme:'dark'}}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">⚠ {errors.name}</p>}
        </div>

        {/* Gender */}
        <div>
          <label className="text-xs text-amber-700 tracking-[0.15em] block mb-2">⚧ Gender</label>
          <div className="flex flex-wrap gap-2">
            {[{value:'Male',label:'Male',emoji:'♂'},{value:'Female',label:'Female',emoji:'♀'},{value:'Other',label:'Other',emoji:'⚧'}].map(o => (
              <button key={o.value} onClick={() => set('gender', o.value)}
                className={'px-4 py-2 rounded-xl text-xs border transition-all ' +
                  (form.gender === o.value ? 'bg-amber-700/40 border-amber-500 text-amber-300' : 'bg-amber-950/20 border-amber-900/30 text-amber-700')}>
                {o.emoji} {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Age Group */}
        <div>
          <label className="text-xs text-amber-700 tracking-[0.15em] block mb-2">🎂 Age Group</label>
          <div className="flex flex-wrap gap-2">
            {AGE_OPTIONS.map(o => (
              <button key={o.value} onClick={() => setDemo('ageGroup', o.value)}
                className={'px-3 py-2 rounded-xl text-xs border transition-all ' +
                  (demographics.ageGroup === o.value ? 'bg-amber-700/40 border-amber-500 text-amber-300' : 'bg-amber-950/20 border-amber-900/30 text-amber-700')}>
                {o.emoji} {o.label}
              </button>
            ))}
          </div>
          {errors.ageGroup && <p className="text-red-500 text-xs mt-1">⚠ {errors.ageGroup}</p>}
        </div>

        {/* Life Stage */}
        <div>
          <label className="text-xs text-amber-700 tracking-[0.15em] block mb-2">🏠 Life Stage</label>
          <div className="flex flex-wrap gap-2">
            {LIFE_OPTIONS.map(o => (
              <button key={o.value} onClick={() => setDemo('lifeStage', o.value)}
                className={'px-3 py-2 rounded-xl text-xs border transition-all ' +
                  (demographics.lifeStage === o.value ? 'bg-amber-700/40 border-amber-500 text-amber-300' : 'bg-amber-950/20 border-amber-900/30 text-amber-700')}>
                {o.emoji} {o.label}
              </button>
            ))}
          </div>
          {errors.lifeStage && <p className="text-red-500 text-xs mt-1">⚠ {errors.lifeStage}</p>}
        </div>

        {/* Relationship Status */}
        <div>
          <label className="text-xs text-amber-700 tracking-[0.15em] block mb-2">💞 Relationship Status</label>
          <div className="flex flex-wrap gap-2">
            {RELATION_OPTIONS.map(o => (
              <button key={o.value} onClick={() => setDemo('relationshipStatus', o.value)}
                className={'px-3 py-2 rounded-xl text-xs border transition-all ' +
                  (demographics.relationshipStatus === o.value ? 'bg-amber-700/40 border-amber-500 text-amber-300' : 'bg-amber-950/20 border-amber-900/30 text-amber-700')}>
                {o.emoji} {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Interest - Multi Select */}
        <div>
          <label className="text-xs text-amber-700 tracking-[0.15em] block mb-2">✨ I Want Guidance On (select all that apply)</label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map(o => (
              <button key={o.value} onClick={() => toggleInterest(o.value)}
                className={'px-3 py-2 rounded-xl text-xs border transition-all ' +
                  (demographics.primaryInterest.includes(o.value) ? 'bg-amber-700/40 border-amber-500 text-amber-300' : 'bg-amber-950/20 border-amber-900/30 text-amber-700')}>
                {o.emoji} {o.label}
              </button>
            ))}
          </div>
          {errors.primaryInterest && <p className="text-red-500 text-xs mt-1">⚠ {errors.primaryInterest}</p>}
        </div>

        <button onClick={() => { if(validateStep1()) setStep(2) }}
          className="w-full bg-gradient-to-r from-amber-700 to-amber-500 text-slate-900 font-bold py-4 rounded-xl text-base tracking-wide active:scale-95 transition-transform">
          Continue ✦
        </button>
      </div>
    </div>
  )

  // STEP 2 - Birth Details
  return (
    <div className="min-h-screen pb-10">
      <div className="px-6 pt-6 pb-5 border-b border-amber-900/30">
        <button onClick={() => setStep(1)} className="text-amber-700 text-sm mb-3 flex items-center gap-1">
          ‹ Back
        </button>
        <p className="text-xs tracking-[0.3em] text-amber-800 mb-1">ENTER YOUR</p>
        <h2 className="text-3xl text-amber-400 font-light">Birth Details</h2>
        <p className="text-xs text-amber-700 mt-1">Namaste {form.name}! For your accurate Kundali</p>
      </div>

      <div className="px-5 pt-6 flex flex-col gap-5">
        {[
          {key:'dob', label:'Date of Birth', type:'date', icon:'📅'},
          {key:'tob', label:'Time of Birth', type:'time', icon:'⏰'},
        ].map(f => (
          <div key={f.key}>
            <label className="text-xs text-amber-700 tracking-[0.15em] block mb-2">{f.icon} {f.label}</label>
            <input
              type={f.type}
              value={form[f.key]}
              onChange={e => set(f.key, e.target.value)}
              className={'w-full bg-amber-950/20 border rounded-lg px-4 py-3 text-amber-100 text-sm focus:outline-none focus:border-amber-500 ' +
                (errors[f.key] ? 'border-red-700' : 'border-amber-900/40')}
              style={{colorScheme:'dark'}}
            />
            {errors[f.key] && <p className="text-red-500 text-xs mt-1">⚠ {errors[f.key]}</p>}
          </div>
        ))}

        {/* Place Search */}
        <div ref={suggestionsRef}>
          <label className="text-xs text-amber-700 tracking-[0.15em] block mb-2">📍 Place of Birth</label>
          <div className="relative">
            <input
              type="text"
              value={form.pob}
              onChange={e => handlePlaceInput(e.target.value)}
              onFocus={() => placeSuggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Search city, town or village..."
              className={'w-full bg-amber-950/20 border rounded-lg px-4 py-3 text-amber-100 text-sm focus:outline-none focus:border-amber-500 ' +
                (errors.pob ? 'border-red-700' : 'border-amber-900/40')}
              style={{colorScheme:'dark'}}
            />
            {placeLoading && <div className="absolute right-3 top-3 text-amber-600 text-xs animate-spin">☸</div>}
            {form.lat && <div className="absolute right-3 top-3 text-green-500 text-sm">✓</div>}
            {showSuggestions && placeSuggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-[#0d0a1a] border border-amber-900/40 rounded-lg overflow-hidden shadow-xl">
                {placeSuggestions.map((place, i) => (
                  <button key={i} onClick={() => selectPlace(place)}
                    className="w-full text-left px-4 py-3 hover:bg-amber-950/40 border-b border-amber-900/20 last:border-0">
                    <p className="text-amber-200 text-sm">{place.short}</p>
                    <p className="text-amber-800 text-xs mt-0.5 truncate">{place.display}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
          {errors.pob && <p className="text-red-500 text-xs mt-1">⚠ {errors.pob}</p>}
          {form.lat && <p className="text-green-700 text-xs mt-1">✓ Location: {form.lat.toFixed(3)}°N, {form.lon.toFixed(3)}°E</p>}
        </div>

        <div className="bg-amber-950/20 border border-amber-900/20 rounded-lg p-3 text-xs text-amber-800 leading-relaxed">
          🔒 Your birth data is used solely for astrological calculations and never stored without permission.
        </div>

        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-gradient-to-r from-amber-700 to-amber-500 text-slate-900 font-bold py-4 rounded-xl text-base tracking-wide active:scale-95 transition-transform disabled:opacity-60">
          {loading ? '✦ Calculating Kundali...' : '✦ Calculate My Kundali ✦'}
        </button>
      </div>
    </div>
  )
}