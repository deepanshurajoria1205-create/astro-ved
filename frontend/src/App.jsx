import { useState } from 'react'
import SplashScreen from './screens/SplashScreen'
import BirthForm from './screens/BirthForm'
import ChartScreen from './screens/ChartScreen'
import HoroscopeScreen from './screens/HoroscopeScreen'
import ChatScreen from './screens/ChatScreen'

export default function App() {
  const [screen, setScreen] = useState('splash')
  const [chartData, setChartData] = useState(null)
  const [formData, setFormData] = useState(null)
  const [horoscopeType, setHoroscopeType] = useState('weekly')

  return (
    <div className="min-h-screen bg-[#050310] flex justify-center">
      <div className="w-full max-w-md relative">
        {screen === 'splash' && <SplashScreen onDone={() => setScreen('form')} />}
        {screen === 'form' && (
          <BirthForm onCalculated={(data, form) => {
            setChartData(data); setFormData(form); setScreen('chart')
          }}/>
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
            onBack={() => setScreen('chart')}
          />
        )}
      </div>
    </div>
  )
}