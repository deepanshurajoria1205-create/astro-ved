import { useState, useRef } from 'react'
import KundaliWheel from '../components/KundaliWheel'

export default function ChartScreen({ chartData, onBack, onHoroscope, onChat }) {
  const [activeTab, setActiveTab] = useState('overview')

  if (!chartData) return null

  const {
    name, ascendant, moonSign, sunSign, nakshatra, nakshatraPada, nakshatraLord,
    nakshatraQuality, nakshatraDeity, tithi, yoga, karana, planets, houses,
    dasha, yogas, doshas, summary, sadeSati, ashtakavarga
  } = chartData

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'planets', label: 'Planets' },
    { id: 'houses', label: 'Houses' },
    { id: 'yogas', label: 'Yogas' },
  ]

  const handleDownloadPDF = async () => {
  // Load libraries
  if (!window.jspdf) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
      script.onload = resolve
      script.onerror = reject
      document.body.appendChild(script)
    })
  }
  if (!window.html2canvas) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
      script.onload = resolve
      script.onerror = reject
      document.body.appendChild(script)
    })
  }

  const { jsPDF } = window.jspdf
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const W = 210, M = 15, CW = W - M * 2

  const GOLD = [180, 120, 40]
  const DARK = [15, 23, 42]
  const GRAY = [100, 116, 139]
  const LIGHT = [248, 250, 252]
  const WHITE = [255, 255, 255]

  let y = 0

  // Header
  doc.setFillColor(...DARK)
  doc.rect(0, 0, W, 50, 'F')
  doc.setFillColor(...GOLD)
  doc.circle(M + 8, 25, 7, 'F')
  doc.setFontSize(10)
  doc.setTextColor(...WHITE)
  doc.text('J', M + 5.5, 27.5)
  doc.setFontSize(24)
  doc.setTextColor(...WHITE)
  doc.setFont('helvetica', 'bold')
  doc.text('Jyotish', M + 20, 22)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...GOLD)
  doc.text('VEDIC ASTROLOGY · PERSONAL KUNDALI REPORT', M + 20, 30)
  doc.setFontSize(8)
  doc.setTextColor(160, 160, 160)
  doc.text('Generated: ' + new Date().toLocaleDateString('en-IN', {day:'numeric',month:'long',year:'numeric'}), W - M, 30, {align:'right'})

  y = 60

  // Name card
  doc.setFillColor(...LIGHT)
  doc.roundedRect(M, y, CW, 28, 3, 3, 'F')
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...DARK)
  doc.text(name || 'Native', M + 8, y + 10)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...GRAY)
  doc.text(ascendant?.sign + ' Lagna  ·  ' + moonSign + ' Moon  ·  ' + nakshatra + ' Nakshatra Pada ' + nakshatraPada, M + 8, y + 18)
  doc.text('Currently in ' + dasha?.current + ' – ' + dasha?.subDasha + ' Dasha until ' + dasha?.endDate, M + 8, y + 24)
  y += 36

  // Capture Kundali wheel SVG
  const kundaliEl = document.querySelector('.kundali-wheel-container')
  if (kundaliEl) {
    try {
      const canvas = await window.html2canvas(kundaliEl, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false
      })
      const imgData = canvas.toDataURL('image/png')
      const imgSize = 90 // mm
      const imgX = (W - imgSize) / 2
      // Section header
      doc.setFillColor(...GOLD)
      doc.rect(M, y, 3, 6, 'F')
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...DARK)
      doc.text('BIRTH CHART (KUNDALI)', M + 6, y + 5)
      y += 10
      doc.addImage(imgData, 'PNG', imgX, y, imgSize, imgSize)
      y += imgSize + 8
    } catch(e) {
      console.log('Could not capture kundali wheel', e)
    }
  }

  // Check page space
  if (y > 200) { doc.addPage(); y = 20 }

  const sectionHeader = (title) => {
    doc.setFillColor(...GOLD)
    doc.rect(M, y, 3, 6, 'F')
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...DARK)
    doc.text(title, M + 6, y + 5)
    y += 12
  }

  // Panchanga
  sectionHeader('PANCHANGA')
  const panchaData = [
    ['Tithi', tithi || '-'],
    ['Yoga', yoga || '-'],
    ['Karana', karana || '-'],
    ['Nakshatra Deity', nakshatraDeity || '-'],
    ['Nakshatra Quality', nakshatraQuality || '-'],
  ]
  panchaData.forEach(([label, value]) => {
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...GRAY)
    doc.text(label, M, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...DARK)
    doc.text(value, M + 50, y)
    y += 6
  })
  y += 6

  if (y > 230) { doc.addPage(); y = 20 }

  // Planets table
  sectionHeader('PLANETARY POSITIONS')
  doc.setFillColor(...DARK)
  doc.rect(M, y, CW, 7, 'F')
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...WHITE)
  doc.text('Planet', M + 3, y + 5)
  doc.text('Sign', M + 30, y + 5)
  doc.text('House', M + 65, y + 5)
  doc.text('Degree', M + 90, y + 5)
  doc.text('Dignity', M + 120, y + 5)
  doc.text('Strength', M + 155, y + 5)
  y += 7

  planets?.forEach((p, i) => {
    if (y > 270) { doc.addPage(); y = 20 }
    doc.setFillColor(i % 2 === 0 ? 248 : 255, i % 2 === 0 ? 250 : 255, i % 2 === 0 ? 252 : 255)
    doc.rect(M, y, CW, 6, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...DARK)
    doc.setFontSize(8)
    doc.text(p.name, M + 3, y + 4.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...GRAY)
    doc.text(p.sign, M + 30, y + 4.5)
    doc.text('House ' + p.house, M + 65, y + 4.5)
    doc.text(p.degree + '°', M + 90, y + 4.5)
    const dc = p.dignity === 'Exalted' ? [22,163,74] : p.dignity === 'Debilitated' ? [220,38,38] : [...GRAY]
    doc.setTextColor(...dc)
    doc.text(p.dignity, M + 120, y + 4.5)
    doc.setTextColor(...DARK)
    doc.text(p.strength + '%', M + 155, y + 4.5)
    y += 6
  })
  y += 8

  if (y > 230) { doc.addPage(); y = 20 }

  // Yogas
  if (yogas?.length > 0) {
    sectionHeader('YOGAS & DOSHAS')
    yogas.forEach(yg => {
      if (y > 260) { doc.addPage(); y = 20 }
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...GOLD)
      doc.text('✦ ' + yg.name, M, y)
      y += 5
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...GRAY)
      const desc = doc.splitTextToSize(yg.desc, CW)
      doc.text(desc, M + 4, y)
      y += desc.length * 4 + 4
    })
    doshas?.forEach(d => {
      if (y > 260) { doc.addPage(); y = 20 }
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(220, 38, 38)
      doc.text('⚠ ' + d.name + ' (' + d.severity + ')', M, y)
      y += 5
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...GRAY)
      const desc = doc.splitTextToSize(d.desc, CW)
      doc.text(desc, M + 4, y)
      y += desc.length * 4 + 4
    })
    y += 4
  }

  if (y > 220) { doc.addPage(); y = 20 }

  // Summary
  sectionHeader('CHART SUMMARY')
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...GRAY)
  const summaryLines = doc.splitTextToSize(summary || '', CW)
  doc.text(summaryLines, M, y)
  y += summaryLines.length * 5 + 8

  // Sade Sati
  if (sadeSati?.active) {
    if (y > 260) { doc.addPage(); y = 20 }
    doc.setFillColor(254, 243, 199)
    doc.roundedRect(M, y, CW, 14, 2, 2, 'F')
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(180, 83, 9)
    doc.text('⚠ Sade Sati Active — ' + sadeSati.phase + ' Phase', M + 4, y + 6)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(120, 53, 15)
    doc.text('Saturn is transiting near your Moon sign. Consult your astrologer for remedies.', M + 4, y + 11)
    y += 20
  }

  // Footer on all pages
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFillColor(...DARK)
    doc.rect(0, 287 - 15, W, 15, 'F')
    doc.setFontSize(7)
    doc.setTextColor(160, 160, 160)
    doc.text('Generated by Jyotish · myjyotish-ai.in · Powered by Swiss Ephemeris & Lahiri Ayanamsha · Page ' + i + ' of ' + totalPages, W / 2, 287 - 6, {align:'center'})
  }

  doc.save((name || 'Kundali') + '_Jyotish_Report.pdf')
}

  return (
    <div className="min-h-screen bg-[#FAFAF8]">

      {/* Hero Header */}
      <div className="bg-slate-900 px-6 pt-12 pb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-slate-400 text-xs font-semibold tracking-widest mb-1">YOUR KUNDALI</p>
            <h1 className="font-serif text-3xl text-white font-light">{name}</h1>
            <p className="text-slate-400 text-sm mt-1">{ascendant?.sign} Lagna · {moonSign} Moon</p>
          </div>
          <button onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-amber-500 text-slate-900 text-xs font-bold px-4 py-2.5 rounded-xl active:scale-95 transition-transform">
            ↓ PDF
          </button>
        </div>

        {/* Key info pills */}
        <div className="flex gap-2 flex-wrap">
          {[
            {label: nakshatra + ' P' + nakshatraPada},
            {label: dasha?.current + ' Dasha'},
            sadeSati?.active ? {label: '⚠ Sade Sati', highlight: true} : null
          ].filter(Boolean).map((item, i) => (
            <span key={i} className={`text-xs px-3 py-1.5 rounded-full font-medium ${
              item.highlight ? 'bg-amber-400 text-slate-900' : 'bg-slate-800 text-slate-300'
            }`}>
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* Quick action cards */}
      <div className="px-4 py-4 grid grid-cols-2 gap-3">
        <button onClick={() => onHoroscope('weekly')}
          className="bg-white border border-slate-200 rounded-2xl p-4 text-left shadow-sm active:scale-95 transition-transform">
          <span className="text-2xl mb-2 block">✦</span>
          <p className="font-semibold text-slate-900 text-sm">Weekly Reading</p>
          <p className="text-slate-400 text-xs mt-0.5">Free · AI powered</p>
        </button>
        <button onClick={onChat}
          className="bg-slate-900 rounded-2xl p-4 text-left shadow-sm active:scale-95 transition-transform">
          <span className="text-2xl mb-2 block">◎</span>
          <p className="font-semibold text-white text-sm">Ask Jyotishi</p>
          <p className="text-slate-400 text-xs mt-0.5">AI consultation</p>
        </button>
        <button onClick={() => onHoroscope('monthly')}
          className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-left shadow-sm active:scale-95 transition-transform">
          <span className="text-2xl mb-2 block">🌙</span>
          <p className="font-semibold text-slate-900 text-sm">Monthly Reading</p>
          <p className="text-amber-600 text-xs mt-0.5">Premium · ₹49/mo</p>
        </button>
        <button onClick={() => onHoroscope('annual')}
          className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-left shadow-sm active:scale-95 transition-transform">
          <span className="text-2xl mb-2 block">🪐</span>
          <p className="font-semibold text-slate-900 text-sm">Annual Reading</p>
          <p className="text-amber-600 text-xs mt-0.5">Premium · ₹449/yr</p>
        </button>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="bg-slate-100 rounded-2xl p-1 flex gap-1">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 pb-24">

        {activeTab === 'overview' && (
          <div className="flex flex-col gap-4">
            {/* Kundali Wheel */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
  <p className="text-xs font-semibold text-slate-400 tracking-widest mb-3">BIRTH CHART</p>
  <div className="kundali-wheel-container">
    <KundaliWheel chartData={chartData} />
  </div>
</div>

            {/* Panchanga */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 tracking-widest mb-3">PANCHANGA</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {label:'Tithi', value: tithi},
                  {label:'Yoga', value: yoga},
                  {label:'Karana', value: karana},
                  {label:'Nakshatra Lord', value: nakshatraLord},
                  {label:'Deity', value: nakshatraDeity},
                  {label:'Dasha Ends', value: dasha?.endDate},
                ].map((item, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs text-slate-400 font-medium mb-1">{item.label}</p>
                    <p className="text-sm font-semibold text-slate-900">{item.value || '-'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <p className="text-xs font-semibold text-amber-600 tracking-widest mb-2">CHART SUMMARY</p>
              <p className="text-slate-700 text-sm leading-relaxed">{summary}</p>
            </div>

            {/* Sade Sati */}
            {sadeSati?.active && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                <p className="text-xs font-semibold text-red-500 tracking-widest mb-1">⚠ SADE SATI ACTIVE</p>
                <p className="text-slate-700 text-sm">{sadeSati.phase} phase. Saturn is near your Moon sign.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'planets' && (
          <div className="flex flex-col gap-2">
            {planets?.map((p, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-semibold text-slate-900 text-sm">{p.name}</span>
                    <span className="text-slate-400 text-xs ml-2">({p.abbr})</span>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                    p.dignity === 'Exalted' ? 'bg-green-100 text-green-700' :
                    p.dignity === 'Debilitated' ? 'bg-red-100 text-red-700' :
                    p.dignity === 'Own sign' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>{p.dignity}</span>
                </div>
                <div className="flex gap-4 text-xs text-slate-500 mb-2">
                  <span>{p.sign}</span>
                  <span>House {p.house}</span>
                  <span>{p.degree}°</span>
                  {p.retrograde && <span className="text-amber-600 font-medium">℞ Retrograde</span>}
                </div>
                {/* Strength bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-slate-900 transition-all"
                      style={{width: p.strength + '%'}}/>
                  </div>
                  <span className="text-xs font-semibold text-slate-600">{p.strength}%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'houses' && (
          <div className="grid grid-cols-2 gap-2">
            {houses?.map((h, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-400">HOUSE {h.house}</span>
                  {ashtakavarga?.find(a => a.house === h.house) && (
                    <span className="text-xs font-semibold text-amber-600">
                      {ashtakavarga.find(a => a.house === h.house).score}/8
                    </span>
                  )}
                </div>
                <p className="font-semibold text-slate-900 text-sm">{h.sign}</p>
                <p className="text-xs text-slate-400">Lord: {h.lord}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'yogas' && (
          <div className="flex flex-col gap-3">
            {yogas?.length > 0 ? yogas.map((yg, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-amber-500">✦</span>
                  <span className="font-semibold text-slate-900 text-sm">{yg.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ml-auto ${
                    yg.strength === 'Strong' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>{yg.strength}</span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">{yg.desc}</p>
              </div>
            )) : (
              <div className="bg-slate-50 rounded-2xl p-6 text-center">
                <p className="text-slate-400 text-sm">No major yogas detected</p>
              </div>
            )}

            {doshas?.length > 0 && (
              <>
                <p className="text-xs font-semibold text-slate-400 tracking-widest mt-2">DOSHAS</p>
                {doshas.map((d, i) => (
                  <div key={i} className="bg-red-50 border border-red-100 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-red-500">⚠</span>
                      <span className="font-semibold text-slate-900 text-sm">{d.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 ml-auto">{d.severity}</span>
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed">{d.desc}</p>
                  </div>
                ))}
              </>
            )}

            {/* Dasha Timeline */}
            <p className="text-xs font-semibold text-slate-400 tracking-widest mt-2">VIMSHOTTARI DASHA</p>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-4 p-3 bg-slate-900 rounded-xl">
                <div>
                  <p className="text-xs text-slate-400">Current Dasha</p>
                  <p className="text-white font-semibold">{dasha?.current} → {dasha?.subDasha} → {dasha?.pratyantar}</p>
                  <p className="text-slate-400 text-xs mt-0.5">Ends {dasha?.endDate}</p>
                </div>
              </div>
              {dasha?.allDashas?.slice(0, 5).map((d, i) => (
                <div key={i} className={`flex justify-between items-center py-2.5 border-b border-slate-100 last:border-0 ${
                  d.planet === dasha.current ? 'text-amber-600 font-semibold' : ''
                }`}>
                  <span className={`text-sm ${d.planet === dasha.current ? 'text-amber-600 font-bold' : 'text-slate-700'}`}>
                    {d.planet === dasha.current ? '→ ' : ''}{d.planet}
                  </span>
                  <span className="text-xs text-slate-400">{d.years} years</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}