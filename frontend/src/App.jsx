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

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex justify-center">
      <div className="w-full max-w-md relative">
        {screen === 'splash' && (
          <SplashScreen
            onDone={() => setScreen('form')}
            onSunSign={() => setScreen('sunsign')}
          />
        )}
        {screen === 'form' && (
          <BirthForm
            onCalculated={(data, form) => { setChartData(data); setFormData(form); setScreen('chart') }}
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
            onBack={() => setScreen('splash')}
            userLocation={userLocation}
          />
        )}
      </div>
    </div>
  )
}