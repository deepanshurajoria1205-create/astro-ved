import { useState, useEffect, useRef } from 'react'

const API = window.location.origin + '/api'

export default function BirthForm({ onCalculated }) {
  const [form, setForm] = useState({ name:'', dob:'', tob:'', pob:'', gender:'Male', lat:null, lon:null })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [placeSuggestions, setPlaceSuggestions] = useState([])
  const [placeLoading, setPlaceLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const placeTimer = useRef(null)
  const suggestionsRef = useRef(null)

  const set = (k, v) => setForm(p => ({...p, [k]:v}))

  // Search places using OpenStreetMap Nominatim (free, no key needed)
  const searchPlaces = async (query) => {
    if (query.length < 3) { setPlaceSuggestions([]); return }
    setPlaceLoading(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=6&addressdetails=1`,
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
    } catch(e) {
      setPlaceSuggestions([])
    }
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

  // Close suggestions when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.dob) e.dob = 'Date of birth is required'
    if (!form.tob) e.tob = 'Time of birth is required'
    if (!form.pob.trim()) e.pob = 'Place of birth is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const payload = { ...form }
      // If lat/lon not set from search, backend will use city lookup
      const res = await fetch(`${API}/calculate`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      const hRes = await fetch(`${API}/horoscope`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ chartData: {...data, name:form.name}, period:'weekly' })
      })
      const hData = await hRes.json()
      onCalculated({...data, weeklyHoroscope: hData.horoscope}, form)
    } catch(err) {
      alert('Error: ' + err.message)
    }
    setLoading(false)
  }

  const fields = [
    {key:'name', label:'Full Name', type:'text', placeholder:'Enter your full name', icon:'👤'},
    {key:'dob',  label:'Date of Birth (जन्म तिथि)', type:'date', placeholder:'', icon:'📅'},
    {key:'tob',  label:'Time of Birth (जन्म समय)', type:'time', placeholder:'', icon:'⏰'},
  ]

  return (
    <div className="min-h-screen pb-10">
      <div className="px-6 pt-10 pb-5 border-b border-amber-900/30">
        <p className="text-xs tracking-[0.3em] text-amber-800 mb-1">ENTER YOUR</p>
        <h2 className="text-3xl text-amber-400 font-light">Birth Details</h2>
        <p className="text-xs text-amber-800 mt-1">जन्म विवरण • For accurate Kundali calculation</p>
      </div>

      <div className="px-5 pt-6 flex flex-col gap-5">
        {fields.map(f => (
          <div key={f.key}>
            <label className="text-xs text-amber-700 tracking-[0.15em] block mb-2">
              {f.icon} {f.label}
            </label>
            <input
              type={f.type}
              value={form[f.key]}
              onChange={e => set(f.key, e.target.value)}
              placeholder={f.placeholder}
              className={`w-full bg-amber-950/20 border rounded-lg px-4 py-3 text-amber-100 text-sm
                focus:outline-none focus:border-amber-500 transition-colors
                ${errors[f.key] ? 'border-red-700' : 'border-amber-900/40'}`}
              style={{colorScheme:'dark'}}
            />
            {errors[f.key] && <p className="text-red-500 text-xs mt-1">⚠ {errors[f.key]}</p>}
          </div>
        ))}

        {/* Place of Birth with search */}
        <div ref={suggestionsRef}>
          <label className="text-xs text-amber-700 tracking-[0.15em] block mb-2">
            📍 Place of Birth (जन्म स्थान)
          </label>
          <div className="relative">
            <input
              type="text"
              value={form.pob}
              onChange={e => handlePlaceInput(e.target.value)}
              onFocus={() => placeSuggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Search city, town or village..."
              className={`w-full bg-amber-950/20 border rounded-lg px-4 py-3 text-amber-100 text-sm
                focus:outline-none focus:border-amber-500 transition-colors
                ${errors.pob ? 'border-red-700' : 'border-amber-900/40'}`}
              style={{colorScheme:'dark'}}
            />
            {placeLoading && (
              <div className="absolute right-3 top-3 text-amber-600 text-xs animate-spin">☸</div>
            )}
            {form.lat && (
              <div className="absolute right-3 top-3 text-green-500 text-sm">✓</div>
            )}

            {/* Suggestions dropdown */}
            {showSuggestions && placeSuggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-[#0d0a1a] border border-amber-900/40 rounded-lg overflow-hidden shadow-xl">
                {placeSuggestions.map((place, i) => (
                  <button
                    key={i}
                    onClick={() => selectPlace(place)}
                    className="w-full text-left px-4 py-3 hover:bg-amber-950/40 border-b border-amber-900/20 last:border-0 transition-colors"
                  >
                    <p className="text-amber-200 text-sm">{place.short}</p>
                    <p className="text-amber-800 text-xs mt-0.5 truncate">{place.display}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
          {errors.pob && <p className="text-red-500 text-xs mt-1">⚠ {errors.pob}</p>}
          {form.lat && (
            <p className="text-green-700 text-xs mt-1">
              ✓ Location found: {form.lat.toFixed(4)}°N, {form.lon.toFixed(4)}°E
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-amber-700 tracking-[0.15em] block mb-2">⚧ Gender</label>
            <select value={form.gender} onChange={e => set('gender', e.target.value)}
              className="w-full bg-amber-950/20 border border-amber-900/40 rounded-lg px-4 py-3 text-amber-100 text-sm focus:outline-none"
              style={{colorScheme:'dark'}}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-amber-700 tracking-[0.15em] block mb-2">🌐 Language</label>
            <select className="w-full bg-amber-950/20 border border-amber-900/40 rounded-lg px-4 py-3 text-amber-100 text-sm focus:outline-none"
              style={{colorScheme:'dark'}}>
              <option>English</option>
              <option>Hindi</option>
            </select>
          </div>
        </div>

        <div className="bg-amber-950/20 border border-amber-900/20 rounded-lg p-3 text-xs text-amber-800 leading-relaxed">
          🔒 Your birth data is used solely for astrological calculations and is never stored without your permission.
        </div>

        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-gradient-to-r from-amber-700 to-amber-500 text-slate-900 font-bold py-4 rounded-xl text-base tracking-wide mt-2 active:scale-95 transition-transform disabled:opacity-60">
          {loading ? '✦ Calculating Kundali...' : '✦ Calculate My Kundali ✦'}
        </button>
      </div>
    </div>
  )
}