import { useState, useEffect, useRef } from 'react'

const API = 'https://jyotish-backend-stw4.onrender.com/api'

export default function BirthForm({ onCalculated, onBack }) {
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
    if (!form.name.trim()) { setErrors({name:'Please enter your name'}); return false }
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

  const Chip = ({ label, emoji, selected, onClick }) => (
    <button onClick={onClick}
      className={`px-3 py-2 rounded-xl text-sm border transition-all font-medium ${
        selected
          ? 'bg-slate-900 text-white border-slate-900'
          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
      }`}>
      {emoji} {label}
    </button>
  )

  const toggleInterest = (val) => {
    const current = demographics.primaryInterest
    setDemo('primaryInterest', current.includes(val) ? current.filter(v => v !== val) : [...current, val])
  }

  if (step === 1) return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 text-sm mb-6">
          ← Back
        </button>
        <p className="text-xs font-semibold tracking-widest text-amber-600 mb-1">STEP 1 OF 2</p>
        <h1 className="font-serif text-4xl text-slate-900 font-light">Tell us about yourself</h1>
        <p className="text-slate-500 text-sm mt-2">This helps us personalise your cosmic readings</p>
      </div>

      <div className="px-6 flex flex-col gap-7 pb-10">

        {/* Name */}
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-2">Your Name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="Enter your full name"
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-900 text-sm focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1.5">⚠ {errors.name}</p>}
        </div>

        {/* Gender */}
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-2">Gender</label>
          <div className="flex gap-2">
            {[{value:'Male',label:'Male',emoji:'♂'},{value:'Female',label:'Female',emoji:'♀'},{value:'Other',label:'Other',emoji:'⚧'}].map(o => (
              <Chip key={o.value} label={o.label} emoji={o.emoji} selected={form.gender===o.value} onClick={() => set('gender', o.value)} />
            ))}
          </div>
        </div>

        {/* Age Group */}
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-2">Age Group</label>
          <div className="flex flex-wrap gap-2">
            {[
              {value:'under25',label:'Under 25',emoji:'🌱'},
              {value:'25to35',label:'25–35',emoji:'⚡'},
              {value:'35to50',label:'35–50',emoji:'🌟'},
              {value:'above50',label:'50+',emoji:'🧘'},
            ].map(o => (
              <Chip key={o.value} label={o.label} emoji={o.emoji} selected={demographics.ageGroup===o.value} onClick={() => setDemo('ageGroup', o.value)} />
            ))}
          </div>
          {errors.ageGroup && <p className="text-red-500 text-xs mt-1.5">⚠ {errors.ageGroup}</p>}
        </div>

        {/* Life Stage */}
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-2">Life Stage</label>
          <div className="flex flex-wrap gap-2">
            {[
              {value:'student',label:'Student',emoji:'📚'},
              {value:'working',label:'Working',emoji:'💼'},
              {value:'married',label:'Married',emoji:'💑'},
              {value:'parent',label:'Parent',emoji:'👨‍👩‍👧'},
              {value:'retired',label:'Retired',emoji:'🌅'},
            ].map(o => (
              <Chip key={o.value} label={o.label} emoji={o.emoji} selected={demographics.lifeStage===o.value} onClick={() => setDemo('lifeStage', o.value)} />
            ))}
          </div>
          {errors.lifeStage && <p className="text-red-500 text-xs mt-1.5">⚠ {errors.lifeStage}</p>}
        </div>

        {/* Relationship */}
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-2">Relationship Status</label>
          <div className="flex flex-wrap gap-2">
            {[
              {value:'single',label:'Single',emoji:'🌸'},
              {value:'relationship',label:'In Relationship',emoji:'💕'},
              {value:'married',label:'Married',emoji:'💍'},
              {value:'divorced',label:'Separated',emoji:'🌊'},
            ].map(o => (
              <Chip key={o.value} label={o.label} emoji={o.emoji} selected={demographics.relationshipStatus===o.value} onClick={() => setDemo('relationshipStatus', o.value)} />
            ))}
          </div>
        </div>

        {/* Primary Interest */}
        <div>
          <label className="text-sm font-semibold text-slate-700 block mb-1">I want guidance on</label>
          <p className="text-xs text-slate-400 mb-2">Select all that apply</p>
          <div className="flex flex-wrap gap-2">
            {[
              {value:'career',label:'Career & Money',emoji:'💼'},
              {value:'love',label:'Love & Marriage',emoji:'💕'},
              {value:'health',label:'Health',emoji:'🌿'},
              {value:'spirituality',label:'Spirituality',emoji:'🪔'},
              {value:'family',label:'Family',emoji:'🏠'},
              {value:'education',label:'Education',emoji:'📚'},
              {value:'travel',label:'Travel & Foreign',emoji:'✈️'},
              {value:'property',label:'Property',emoji:'🏡'},
            ].map(o => (
              <Chip key={o.value} label={o.label} emoji={o.emoji}
                selected={demographics.primaryInterest.includes(o.value)}
                onClick={() => toggleInterest(o.value)} />
            ))}
          </div>
          {errors.primaryInterest && <p className="text-red-500 text-xs mt-1.5">⚠ {errors.primaryInterest}</p>}
        </div>

        <button onClick={() => { if(validateStep1()) setStep(2) }}
          className="w-full bg-slate-900 text-white font-semibold py-4 rounded-2xl text-sm tracking-wide active:scale-95 transition-transform shadow-lg">
          Continue →
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="px-6 pt-12 pb-6">
        <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-500 text-sm mb-6">
          ← Back
        </button>
        <p className="text-xs font-semibold tracking-widest text-amber-600 mb-1">STEP 2 OF 2</p>
        <h1 className="font-serif text-4xl text-slate-900 font-light">Your birth details</h1>
        <p className="text-slate-500 text-sm mt-2">Namaste {form.name}! For an accurate Kundali</p>
      </div>

      <div className="px-6 flex flex-col gap-5 pb-10">
        {[
          {key:'dob', label:'Date of Birth', type:'date', icon:'📅'},
          {key:'tob', label:'Time of Birth', type:'time', icon:'⏰'},
        ].map(f => (
          <div key={f.key}>
            <label className="text-sm font-semibold text-slate-700 block mb-2">{f.icon} {f.label}</label>
            <input
              type={f.type}
              value={form[f.key]}
              onChange={e => set(f.key, e.target.value)}
              className={'w-full bg-white border rounded-xl px-4 py-3.5 text-slate-900 text-sm focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 ' +
                (errors[f.key] ? 'border-red-300' : 'border-slate-200')}
            />
            {errors[f.key] && <p className="text-red-500 text-xs mt-1.5">⚠ {errors[f.key]}</p>}
          </div>
        ))}

        {/* Place Search */}
        <div ref={suggestionsRef}>
          <label className="text-sm font-semibold text-slate-700 block mb-2">📍 Place of Birth</label>
          <div className="relative">
            <input
              type="text"
              value={form.pob}
              onChange={e => handlePlaceInput(e.target.value)}
              onFocus={() => placeSuggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Search city, town or village..."
              className={'w-full bg-white border rounded-xl px-4 py-3.5 text-slate-900 text-sm focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 ' +
                (errors.pob ? 'border-red-300' : 'border-slate-200')}
            />
            {placeLoading && <div className="absolute right-3 top-4 text-slate-400 text-xs animate-spin">⟳</div>}
            {form.lat && <div className="absolute right-3 top-4 text-green-500 text-sm">✓</div>}
            {showSuggestions && placeSuggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xl">
                {placeSuggestions.map((place, i) => (
                  <button key={i} onClick={() => selectPlace(place)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0">
                    <p className="text-slate-900 text-sm font-medium">{place.short}</p>
                    <p className="text-slate-400 text-xs mt-0.5 truncate">{place.display}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
          {errors.pob && <p className="text-red-500 text-xs mt-1.5">⚠ {errors.pob}</p>}
          {form.lat && <p className="text-green-600 text-xs mt-1.5 font-medium">✓ Location confirmed</p>}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-3">
          <span className="text-lg">🔒</span>
          <p className="text-slate-500 text-xs leading-relaxed">
            Your birth data is used solely for astrological calculations and is never stored or shared.
          </p>
        </div>

        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-slate-900 text-white font-semibold py-4 rounded-2xl text-sm tracking-wide active:scale-95 transition-transform shadow-lg disabled:opacity-50">
          {loading ? '✦ Calculating your Kundali...' : '✦ Calculate My Kundali'}
        </button>
      </div>
    </div>
  )
}