import { useState } from 'react'
import KundaliWheel from '../components/KundaliWheel'

export default function ChartScreen({ chartData, onBack, onHoroscope, onChat }) {
  const [tab, setTab] = useState('kundali')

  const tabs = [
    {id:'kundali', label:'Kundali'},
    {id:'planets', label:'Grahas'},
    {id:'houses',  label:'Bhavas'},
    {id:'yogas',   label:'Yogas'},
  ]

  return (
    <div className="min-h-screen pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4 border-b border-amber-900/20">
        <button onClick={onBack} className="text-amber-700 text-2xl px-2">‹</button>
        <div>
          <p className="text-lg text-amber-400">{chartData.name}</p>
          <p className="text-xs text-amber-800 tracking-[0.15em]">BIRTH CHART • KUNDALI</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-amber-900/20">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 py-3 text-xs tracking-widest transition-colors
              ${tab===t.id ? 'text-amber-400 border-b-2 border-amber-400' : 'text-amber-800'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-4 pt-5">
        {tab === 'kundali' && <KundaliTab chartData={chartData} onHoroscope={onHoroscope} onChat={onChat} />}
        {tab === 'planets' && <PlanetsTab planets={chartData.planets} />}
        {tab === 'houses'  && <HousesTab houses={chartData.houses} />}
        {tab === 'yogas'   && <YogasTab yogas={chartData.yogas} doshas={chartData.doshas} dasha={chartData.dasha} />}
      </div>
    </div>
  )
}

function KundaliTab({ chartData, onHoroscope, onChat }) {
  const info = [
    {label:'Lagna (Ascendant)', value:`${chartData.ascendant?.sign} ${chartData.ascendant?.symbol}`},
    {label:'Rashi (Moon Sign)',  value: chartData.moonSign},
    {label:'Nakshatra',          value:`${chartData.nakshatra} P${chartData.nakshatraPada}`},
    {label:'Tithi',              value: chartData.tithi},
    {label:'Yoga',               value: chartData.yoga},
    {label:'Current Dasha',      value:`${chartData.dasha?.current}/${chartData.dasha?.subDasha}`},
  ]
  return (
    <div className="flex flex-col items-center gap-5">
      <KundaliWheel chartData={chartData} />

      <div className="grid grid-cols-2 gap-2 w-full">
        {info.map((item,i) => (
          <div key={i} className="bg-amber-950/20 border border-amber-900/20 rounded-lg p-3">
            <p className="text-xs text-amber-800 mb-1">{item.label}</p>
            <p className="text-sm text-amber-400">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-amber-950/20 border border-amber-900/30 rounded-xl p-4 text-sm text-amber-600 leading-relaxed italic w-full">
        "{chartData.summary}"
      </div>

      <div className="w-full">
        <p className="text-xs tracking-[0.3em] text-amber-800 text-center mb-3">HOROSCOPE READINGS</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            {type:'weekly',label:'Weekly',icon:'🌙'},
            {type:'monthly',label:'Monthly',icon:'🌞'},
            {type:'annual',label:'Annual',icon:'🪐'}
          ].map(h => (
            <button key={h.type} onClick={() => onHoroscope(h.type)}
              className="bg-amber-950/20 border border-amber-900/30 rounded-xl py-4 text-amber-400 text-xs flex flex-col items-center gap-2 active:scale-95 transition-transform">
              <span className="text-2xl">{h.icon}</span>
              {h.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Chat button */}
      <button onClick={onChat}
        className="w-full bg-amber-950/20 border border-amber-700/30 rounded-xl py-4 text-amber-400 flex items-center justify-center gap-3 active:scale-95 transition-transform">
        <span className="text-xl">💬</span>
        <span className="text-sm">Ask Jyotish Acharya</span>
        <span className="text-xs text-amber-700 ml-auto pr-2">AI Chat</span>
      </button>
    </div>
  )
}

function PlanetsTab({ planets }) {
  const DIGNITY_COLOR = {
    'Exalted':'text-green-400', 'Own sign':'text-amber-400',
    'Moolatrikona':'text-yellow-400',
    'Debilitated':'text-red-400', 'Neutral':'text-slate-400'
  }
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs tracking-[0.3em] text-amber-800 mb-2">GRAHA POSITIONS</p>
      {planets?.map((p,i) => (
        <div key={i} className="bg-amber-950/20 border border-amber-900/20 rounded-lg px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-950/40 border border-amber-900/40 flex items-center justify-center text-amber-400 text-xs font-bold">
              {p.abbr}
            </div>
            <div>
              <p className="text-sm text-amber-200">{p.name}</p>
              <p className="text-xs text-amber-800">{p.sign} • House {p.house}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-xs ${DIGNITY_COLOR[p.dignity] || 'text-slate-400'}`}>{p.dignity}</p>
            {p.retrograde && <p className="text-xs text-red-500">℞ Retro</p>}
            {p.strength && (
              <p className="text-xs text-amber-900">{p.strength}%</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function HousesTab({ houses }) {
  const MEANINGS = [
    'Self & Personality','Wealth & Family','Siblings & Courage','Home & Mother',
    'Children & Creativity','Health & Service','Marriage & Partnerships','Transformation & Occult',
    'Father & Dharma','Career & Fame','Gains & Friends','Spirituality & Liberation'
  ]
  const SYMBOLS = {
    'Mesha':'♈','Vrishabha':'♉','Mithuna':'♊','Karka':'♋','Simha':'♌','Kanya':'♍',
    'Tula':'♎','Vrischika':'♏','Dhanu':'♐','Makara':'♑','Kumbha':'♒','Meena':'♓'
  }
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs tracking-[0.3em] text-amber-800 mb-2">BHAVA CHART</p>
      {houses?.map((h,i) => (
        <div key={i} className="bg-amber-950/20 border border-amber-900/20 rounded-lg px-4 py-3 flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-amber-950/40 border border-amber-900/30 flex items-center justify-center text-amber-400 text-xs font-bold shrink-0">
            {h.house}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-amber-400">{SYMBOLS[h.sign]}</span>
              <span className="text-sm text-amber-200">{h.sign}</span>
              <span className="text-xs text-amber-800">• {h.lord}</span>
            </div>
            <p className="text-xs text-amber-800 mt-0.5">{MEANINGS[i]}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function YogasTab({ yogas, doshas, dasha }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs tracking-[0.3em] text-amber-800 mb-1">YOGAS & DOSHAS</p>
      {yogas?.map((y,i) => (
        <div key={i} className="bg-green-950/30 border border-green-900/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-green-400 font-medium">✦ {y.name}</p>
            <span className="text-xs text-green-800">{y.strength}</span>
          </div>
          <p className="text-xs text-green-700 leading-relaxed">{y.desc}</p>
        </div>
      ))}
      {(!yogas || yogas.length === 0) && (
        <p className="text-amber-800 text-sm text-center py-4">No major yogas detected in this chart.</p>
      )}
      {doshas?.map((d,i) => (
        <div key={i} className="bg-red-950/20 border border-red-900/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-red-400 font-medium">⚠ {d.name}</p>
            <span className="text-xs text-red-800">{d.severity}</span>
          </div>
          <p className="text-xs text-red-800 leading-relaxed">{d.desc}</p>
        </div>
      ))}
      {dasha && (
        <div className="bg-amber-950/20 border border-amber-900/20 rounded-xl p-4">
          <p className="text-amber-400 font-medium mb-2">🕐 Vimshottari Dasha</p>
          <p className="text-xs text-amber-700 leading-relaxed mb-3">
            Currently running <strong className="text-amber-500">{dasha.current}</strong> Mahadasha
            — <strong className="text-amber-500">{dasha.subDasha}</strong> Antardasha
            — <strong className="text-amber-500">{dasha.pratyantar}</strong> Pratyantardasha
            <br/>Mahadasha ends: {dasha.endDate}
          </p>
          <div className="flex flex-col gap-1">
            {dasha.allDashas?.map((d,i) => (
              <div key={i} className="flex justify-between items-center text-xs">
                <span className={d.planet===dasha.current ? 'text-amber-400 font-bold' : 'text-amber-900'}>
                  {d.planet===dasha.current ? '▶ ' : ''}{d.planet}
                </span>
                <span className="text-amber-900">{d.years} yrs</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}