export default function KundaliWheel({ chartData }) {
  const size = 280
  const cx = size/2, cy = size/2
  const outerR = 128, innerR = 82, centerR = 38

  const SYMBOLS = {'Mesha':'♈','Vrishabha':'♉','Mithuna':'♊','Karka':'♋','Simha':'♌','Kanya':'♍',
    'Tula':'♎','Vrischika':'♏','Dhanu':'♐','Makara':'♑','Kumbha':'♒','Meena':'♓'}

  const houses = chartData?.houses || []
  const planets = chartData?.planets || []

  const segments = houses.map((h, i) => {
    const startDeg = i * 30 - 90
    const endDeg   = (i+1) * 30 - 90
    const midDeg   = startDeg + 15
    const toRad = d => d * Math.PI / 180
    const x1 = cx + outerR * Math.cos(toRad(startDeg))
    const y1 = cy + outerR * Math.sin(toRad(startDeg))
    const x2 = cx + outerR * Math.cos(toRad(endDeg))
    const y2 = cy + outerR * Math.sin(toRad(endDeg))
    const ix1 = cx + innerR * Math.cos(toRad(startDeg))
    const iy1 = cy + innerR * Math.sin(toRad(startDeg))
    const ix2 = cx + innerR * Math.cos(toRad(endDeg))
    const iy2 = cy + innerR * Math.sin(toRad(endDeg))
    const symX = cx + (outerR+innerR)/2 * Math.cos(toRad(midDeg))
    const symY = cy + (outerR+innerR)/2 * Math.sin(toRad(midDeg))
    return {h, i, x1,y1,x2,y2,ix1,iy1,ix2,iy2,symX,symY,sign:h.sign}
  })

  const planetDots = planets.map(p => {
    const houseIdx = (p.house - 1)
    const deg = (houseIdx * 30 + 15 - 90) * Math.PI / 180
    const r = innerR - 20
    return {
      ...p,
      px: cx + r * Math.cos(deg),
      py: cy + r * Math.sin(deg)
    }
  })

  return (
    <svg width={size} height={size} style={{filter:'drop-shadow(0 0 16px rgba(180,130,30,0.25))'}}>
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0d0a1a"/>
          <stop offset="100%" stopColor="#050310"/>
        </radialGradient>
      </defs>

      <circle cx={cx} cy={cy} r={outerR+3} fill="url(#bg)" stroke="#92660a" strokeWidth="1.5"/>

      {segments.map((seg,i) => (
        <g key={i}>
          <path
            d={`M ${seg.x1} ${seg.y1} A ${outerR} ${outerR} 0 0 1 ${seg.x2} ${seg.y2} L ${seg.ix2} ${seg.iy2} A ${innerR} ${innerR} 0 0 0 ${seg.ix1} ${seg.iy1} Z`}
            fill={i%2===0 ? '#0f0a1e' : '#130d22'}
            stroke="#92660a" strokeWidth="0.5" strokeOpacity="0.5"
          />
          <text x={seg.symX} y={seg.symY} textAnchor="middle" dominantBaseline="middle"
            fill="#b8860b" fontSize="12" opacity="0.9">
            {SYMBOLS[seg.sign] || '?'}
          </text>
        </g>
      ))}

      {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg,i) => {
        const r = deg * Math.PI / 180
        const a = (deg - 90) * Math.PI / 180
        return <line key={i}
          x1={cx+innerR*Math.cos(a)} y1={cy+innerR*Math.sin(a)}
          x2={cx+outerR*Math.cos(a)} y2={cy+outerR*Math.sin(a)}
          stroke="#92660a" strokeWidth="0.4" strokeOpacity="0.4"/>
      })}

      <circle cx={cx} cy={cy} r={innerR} fill="#080614" stroke="#92660a" strokeWidth="0.5" strokeOpacity="0.3"/>

      {planetDots.map((p,i) => (
        <g key={i}>
          <circle cx={p.px} cy={p.py} r="10" fill="#1a1230" stroke="#b8860b" strokeWidth="0.6"/>
          <text x={p.px} y={p.py} textAnchor="middle" dominantBaseline="middle"
            fill="#fbbf24" fontSize="7" fontWeight="bold">{p.abbr}</text>
        </g>
      ))}

      <circle cx={cx} cy={cy} r={centerR} fill="#0d0a1a" stroke="#b8860b" strokeWidth="1"/>
      <text x={cx} y={cy-6} textAnchor="middle" fill="#b8860b" fontSize="16">ॐ</text>
      <text x={cx} y={cy+10} textAnchor="middle" fill="#6b4f1a" fontSize="6" letterSpacing="1">KUNDALI</text>
    </svg>
  )
}