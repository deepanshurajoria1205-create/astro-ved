import { useState, useEffect } from 'react'
import SplashScreen from './screens/SplashScreen'
import BirthForm from './screens/BirthForm'
import ChartScreen from './screens/ChartScreen'
import HoroscopeScreen from './screens/HoroscopeScreen'
import ChatScreen from './screens/ChatScreen'

function getSunTimes(lat, lon) {
  const now = new Date()
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000)
  const declination = -23.45 * Math.cos((360 / 365) * (dayOfYear + 10) * Math.PI / 180)
  const decRad = declination * Math.PI / 180
  const latRad = lat * Math.PI / 180
  const hourAngle = Math.acos(-Math.tan(latRad) * Math.tan(decRad)) * 180 / Math.PI
  const sunrise = 12 - hourAngle / 15 - lon / 15
  const sunset = 12 + hourAngle / 15 - lon / 15
  return { sunrise, sunset }
}

function isDayTime(lat, lon) {
  const now = new Date()
  const utcHour = now.getUTCHours() + now.getUTCMinutes() / 60
  const localHour = (utcHour + lon / 15 + 24) % 24
  const { sunrise, sunset } = getSunTimes(lat, lon)
  return localHour >= sunrise && localHour <= sunset
}

export default function App() {
  const [screen, setScreen] = useState('splash')
  const [chartData, setChartData] = useState(null)
  const [formData, setFormData] = useState(null)
  const [horoscopeType, setHoroscopeType] = useState('weekly')
  const [isDay, setIsDay] = useState(false)
  const [userLocation, setUserLocation] = useState(null)

  useEffect(() => {
    // Get user location for day/night and chat context
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          setUserLocation({ lat: latitude, lon: longitude })
          setIsDay(isDayTime(latitude, longitude))
          // Reverse geocode to get city name
          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
            .then(r => r.json())
            .then(d => {
              const city = d.address?.city || d.address?.town || d.address?.village || d.address?.county || 'your location'
              const country = d.address?.country || ''
              setUserLocation(prev => ({ ...prev, city, country, display: city + ', ' + country }))
            }).catch(() => {})
        },
        () => {
          // Default to India if denied
          setUserLocation({ lat: 20.5937, lon: 78.9629, city: 'India', display: 'India' })
          setIsDay(isDayTime(20.5937, 78.9629))
        }
      )
    }

    // Update day/night every 10 minutes
    const interval = setInterval(() => {
      if (userLocation) setIsDay(isDayTime(userLocation.lat, userLocation.lon))
    }, 600000)
    return () => clearInterval(interval)
  }, [])

  const theme = isDay ? {
    bg: 'bg-gradient-to-br from-sky-100 via-amber-50 to-orange-100',
    card: 'bg-white/80',
    text: 'text-slate-800',
    textMuted: 'text-slate-500',
    textAccent: 'text-orange-600',
    border: 'border-orange-200',
    button: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white',
    input: 'bg-white border-orange-200 text-slate-800',
    tab: 'text-slate-400',
    tabActive: 'text-orange-600 border-orange-500',
    pill: 'bg-orange-100 border-orange-200',
    horoCard: 'bg-orange-50 border-orange-200',
    chatBg: 'bg-slate-100',
    chatUser: 'bg-orange-500 text-white',
    chatBot: 'bg-white border border-orange-100 text-slate-700',
    splash: 'from-sky-200 via-amber-100 to-orange-200',
  } : {
    bg: 'bg-gradient-to-br from-[#050310] via-[#0d0a20] to-[#050310]',
    card: 'bg-amber-950/20',
    text: 'text-amber-100',
    textMuted: 'text-amber-800',
    textAccent: 'text-amber-400',
    border: 'border-amber-900/30',
    button: 'bg-gradient-to-r from-amber-700 to-amber-500 text-slate-900',
    input: 'bg-amber-950/20 border-amber-900/40 text-amber-100',
    tab: 'text-amber-800',
    tabActive: 'text-amber-400 border-amber-400',
    pill: 'bg-amber-950/30 border-amber-900/20',
    horoCard: 'bg-amber-950/20 border-amber-900/20',
    chatBg: 'bg-amber-950/40',
    chatUser: 'bg-amber-700/40 text-amber-100',
    chatBot: 'bg-amber-950/40 border border-amber-900/30 text-amber-200',
    splash: 'from-[#050310] via-[#0d0a20] to-[#050310]',
  }

  return (
    <div className={`min-h-screen ${theme.bg} flex justify-center transition-all duration-1000`}>
      <div className="w-full max-w-md relative">
        {screen === 'splash' && <SplashScreen onDone={() => setScreen('form')} theme={theme} isDay={isDay} />}
        {screen === 'form' && (
          <BirthForm
            theme={theme}
            onCalculated={(data, form) => { setChartData(data); setFormData(form); setScreen('chart') }}
          />
        )}
        {screen === 'chart' && (
          <ChartScreen
            chartData={chartData}
            theme={theme}
            onBack={() => setScreen('form')}
            onHoroscope={(type) => { setHoroscopeType(type); setScreen('horoscope') }}
            onChat={() => setScreen('chat')}
          />
        )}
        {screen === 'horoscope' && (
          <HoroscopeScreen
            chartData={chartData}
            theme={theme}
            initialType={horoscopeType}
            onBack={() => setScreen('chart')}
          />
        )}
        {screen === 'chat' && (
          <ChatScreen
            chartData={chartData}
            theme={theme}
            userLocation={userLocation}
            onBack={() => setScreen('chart')}
          />
        )}
      </div>
    </div>
  )
}