import { useState, useEffect } from 'react'
import SplashScreen from './screens/SplashScreen'
import BirthForm from './screens/BirthForm'
import ChartScreen from './screens/ChartScreen'
import HoroscopeScreen from './screens/HoroscopeScreen'
import ChatScreen from './screens/ChatScreen'
import SunSignScreen from './screens/SunSignScreen'

export default function App() {
  const [screen, setScreen] = useState('splash')
  const [chartData, setChartData] = useState(null)
  const [formData, setFormData] = useState(null)
  const [horoscopeType, setHoroscopeType] = useState('weekly')
  const [userLocation, setUserLocation] = useState(null)
  const [hasChart, setHasChart] = useState(false)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude
          const lon = pos.coords.longitude
          setUserLocation({ lat, lon })
          fetch('https://nominatim.openstreetmap.org/reverse?lat=' + lat + '&lon=' + lon + '&format=json')
            .then(r => r.json())
            .then(d => {
              const city = d.address?.city || d.address?.town || d.address?.village || 'your location'
              const country = d.address?.country || ''
              setUserLocation(prev => ({ ...prev, city, country, display: city + ', ' + country }))
            }).catch(() => {})
        },
        () => {
          setUserLocation({ lat: 17.385, lon: 78.4867, city: 'Hyderabad', display: 'Hyderabad, India' })
        }
      )
    }
  }, [])

  const showBottomNav = ['chart','horoscope','chat','sunsign'].includes(screen)

  const NAV_ITEMS = [
    { id: 'chart', icon: '◉', label: 'Kundali', requiresChart: true },
    { id: 'horoscope', icon: '✦', label: 'Horoscope', requiresChart: true },
    { id: 'sunsign', icon: '☀', label: 'Sun Sign', requiresChart: false },
    { id: 'chat', icon: '◎', label: 'Ask AI', requiresChart: true },
  ]

  const handleNavPress = (item) => {
    if (item.requiresChart && !hasChart) {
      setScreen('form')
    } else {
      setScreen(item.id)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex justify-center">
      <div className="w-full max-w-md relative flex flex-col min-h-screen">

        <div className={`flex-1 ${showBottomNav ? 'pb-20' : ''}`}>
          {screen === 'splash' && (
            <SplashScreen
              onDone={() => setScreen('form')}
              onSunSign={() => setScreen('sunsign')}
            />
          )}
          {screen === 'form' && (
            <BirthForm
              onCalculated={(data, form) => {
                setChartData(data)
                setFormData(form)
                setHasChart(true)
                setScreen('chart')
              }}
              onBack={() => setScreen('splash')}
            />
          )}
          {screen === 'chart' && (
            <ChartScreen
              chartData={chartData}
              onBack={() => setScreen('form')}
              onHoroscope={(type) => { setHoroscopeType(type); setScreen('horoscope') }}
              onChat={() => setScreen('chat')}
            />
          )}
          {screen === 'horoscope' && (
            <HoroscopeScreen
              chartData={chartData}
              initialType={horoscopeType}
              onBack={() => setScreen('chart')}
            />
          )}
          {screen === 'chat' && (
            <ChatScreen
              chartData={chartData}
              userLocation={userLocation}
              onBack={() => setScreen('chart')}
            />
          )}
          {screen === 'sunsign' && (
            <SunSignScreen
              onBack={() => hasChart ? setScreen('chart') : setScreen('splash')}
              userLocation={userLocation}
            />
          )}
        </div>

        {/* Bottom Navigation */}
        {showBottomNav && (
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-100 px-2 py-2 z-40 shadow-lg">
            <div className="flex justify-around">
              {NAV_ITEMS.map(item => (
                <button key={item.id} onClick={() => handleNavPress(item)}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                    screen === item.id
                      ? 'text-slate-900'
                      : 'text-slate-400'
                  }`}>
                  <span className={`text-xl transition-all ${screen === item.id ? 'scale-110' : ''}`}>
                    {item.icon}
                  </span>
                  <span className={`text-xs font-medium ${screen === item.id ? 'text-slate-900' : 'text-slate-400'}`}>
                    {item.label}
                  </span>
                  {screen === item.id && (
                    <div className="w-1 h-1 rounded-full bg-amber-500"/>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}