const SIGNS = ['Mesha','Vrishabha','Mithuna','Karka','Simha','Kanya','Tula','Vrischika','Dhanu','Makara','Kumbha','Meena']
const SIGN_LORDS = ['Mangal','Shukra','Budha','Chandra','Surya','Budha','Shukra','Mangal','Guru','Shani','Shani','Guru']
const ELEMENTS = ['Fire','Earth','Air','Water','Fire','Earth','Air','Water','Fire','Earth','Air','Water']
const NATURES = ['Movable','Fixed','Dual','Movable','Fixed','Dual','Movable','Fixed','Dual','Movable','Fixed','Dual']

export const NAKSHATRAS = [
  {name:'Ashwini',lord:'Ketu'},{name:'Bharani',lord:'Shukra'},{name:'Krittika',lord:'Surya'},
  {name:'Rohini',lord:'Chandra'},{name:'Mrigashira',lord:'Mangal'},{name:'Ardra',lord:'Rahu'},
  {name:'Punarvasu',lord:'Guru'},{name:'Pushya',lord:'Shani'},{name:'Ashlesha',lord:'Budha'},
  {name:'Magha',lord:'Ketu'},{name:'Purva Phalguni',lord:'Shukra'},{name:'Uttara Phalguni',lord:'Surya'},
  {name:'Hasta',lord:'Chandra'},{name:'Chitra',lord:'Mangal'},{name:'Swati',lord:'Rahu'},
  {name:'Vishakha',lord:'Guru'},{name:'Anuradha',lord:'Shani'},{name:'Jyeshtha',lord:'Budha'},
  {name:'Mula',lord:'Ketu'},{name:'Purva Ashadha',lord:'Shukra'},{name:'Uttara Ashadha',lord:'Surya'},
  {name:'Shravana',lord:'Chandra'},{name:'Dhanishtha',lord:'Mangal'},{name:'Shatabhisha',lord:'Rahu'},
  {name:'Purva Bhadrapada',lord:'Guru'},{name:'Uttara Bhadrapada',lord:'Shani'},{name:'Revati',lord:'Budha'}
]

export const DASHA_YEARS = { Ketu:7, Shukra:20, Surya:6, Chandra:10, Mangal:7, Rahu:18, Guru:16, Shani:19, Budha:17 }
export const DASHA_ORDER = ['Ketu','Shukra','Surya','Chandra','Mangal','Rahu','Guru','Shani','Budha']

export function toJulianDay(year, month, day, hour=12, minute=0) {
  if (month <= 2) { year -= 1; month += 12 }
  const A = Math.floor(year / 100)
  const B = 2 - A + Math.floor(A / 4)
  return Math.floor(365.25*(year+4716)) + Math.floor(30.6001*(month+1)) + day + B - 1524.5 + (hour+minute/60)/24
}

function sunLongitude(jd) {
  const T = (jd - 2451545.0) / 36525
  const L0 = 280.46646 + 36000.76983 * T
  const M = (357.52911 + 35999.05029*T) * Math.PI/180
  const C = (1.914602 - 0.004817*T)*Math.sin(M) + 0.019993*Math.sin(2*M) + 0.000289*Math.sin(3*M)
  return ((L0+C) % 360 + 360) % 360
}

function moonLongitude(jd) {
  const T = (jd - 2451545.0) / 36525
  const D = (297.85036 + 445267.111480*T) * Math.PI/180
  const M = (357.52772 + 35999.050340*T) * Math.PI/180
  const Mp = (134.96298 + 477198.867398*T) * Math.PI/180
  const F = (93.27191 + 483202.017538*T) * Math.PI/180
  const lon = 218.3165 + 481267.8813*T
    - 1.274*Math.sin(Mp-2*D) + 0.658*Math.sin(2*D) - 0.186*Math.sin(M)
    - 0.114*Math.sin(2*F) + 0.059*Math.sin(2*Mp-2*D) + 0.057*Math.sin(Mp-2*D+M)
    + 0.053*Math.sin(Mp+2*D) + 0.046*Math.sin(2*D-M) + 0.041*Math.sin(Mp-M)
    - 0.034*Math.sin(D) - 0.030*Math.sin(2*Mp) + 0.015*Math.sin(2*D-2*Mp)
  return ((lon % 360) + 360) % 360
}

function planetLongitude(planet, jd) {
  const T = (jd - 2451545.0) / 36525
  const p = {
    Mangal: {L0:355.433,dL:19140.2993,e:0.0934,omega:286.5},
    Budha:  {L0:252.251,dL:149472.6746,e:0.2056,omega:77.5},
    Guru:   {L0:34.351, dL:3034.9057, e:0.0489,omega:14.3},
    Shukra: {L0:181.979,dL:58517.8156,e:0.0068,omega:131.6},
    Shani:  {L0:50.077, dL:1222.1138, e:0.0565,omega:92.4},
  }[planet]
  if (!p) return 0
  const L = p.L0 + p.dL*T
  const Mrad = (L - p.omega) * Math.PI/180
  return ((L + (360/Math.PI)*p.e*Math.sin(Mrad)) % 360 + 360) % 360
}

function lahiriAyanamsha(jd) {
  const T = (jd - 2451545.0) / 36525
  return 23.85 + 0.0137*T*100
}

function toSidereal(lon, jd) {
  return ((lon - lahiriAyanamsha(jd)) % 360 + 360) % 360
}

function calcAscendant(jd, lat, lon) {
  const T = (jd - 2451545.0) / 36525
  const obliquity = (23.439291 - 0.013004*T) * Math.PI/180
  const GMST = (280.46061837 + 360.98564736629*(jd-2451545)) % 360
  const LST = ((GMST+lon) % 360 + 360) % 360
  const RAMC = LST * Math.PI/180
  const latR = lat * Math.PI/180
  const ascTan = Math.cos(RAMC) / (-Math.sin(RAMC)*Math.cos(obliquity) - Math.tan(latR)*Math.sin(obliquity))
  let asc = Math.atan(ascTan) * 180/Math.PI
  if (Math.cos(RAMC) < 0) asc += 180
  return toSidereal(((asc % 360)+360) % 360, jd)
}

export function signFromLon(lon) {
  const idx = Math.floor(((lon%360)+360)%360 / 30) % 12
  return { index:idx, name:SIGNS[idx], lord:SIGN_LORDS[idx], degree:((lon%360)+360)%360 % 30, element:ELEMENTS[idx], nature:NATURES[idx] }
}

export function nakshatraFromLon(lon) {
  const slon = ((lon%360)+360)%360
  const idx = Math.floor(slon / (360/27)) % 27
  const pada = Math.floor((slon % (360/27)) / (360/108)) + 1
  return { ...NAKSHATRAS[idx], index:idx, pada }
}

function dignity(planet, signIdx) {
  const OWN =  {Surya:[4],Chandra:[3],Mangal:[0,7],Budha:[2,5],Guru:[8,11],Shukra:[1,6],Shani:[9,10]}
  const EXALT = {Surya:0,Chandra:1,Mangal:9,Budha:5,Guru:3,Shukra:11,Shani:6,Rahu:1,Ketu:7}
  const DEBIL = {Surya:6,Chandra:7,Mangal:3,Budha:11,Guru:9,Shukra:5,Shani:0}
  if (EXALT[planet]===signIdx) return 'Exalted'
  if (DEBIL[planet]===signIdx) return 'Debilitated'
  if (OWN[planet]?.includes(signIdx)) return 'Own sign'
  return 'Neutral'
}

export function getSymbol(sign) {
  return {'Mesha':'♈','Vrishabha':'♉','Mithuna':'♊','Karka':'♋','Simha':'♌','Kanya':'♍',
    'Tula':'♎','Vrischika':'♏','Dhanu':'♐','Makara':'♑','Kumbha':'♒','Meena':'♓'}[sign] || '?'
}

export function calculateKundali({ year, month, day, hour, minute, lat, lon }) {
  const jd = toJulianDay(year, month, day, hour, minute)
  const sunSid  = toSidereal(sunLongitude(jd), jd)
  const moonSid = toSidereal(moonLongitude(jd), jd)
  const ascSid  = calcAscendant(jd, lat, lon)
  const ascHouse = signFromLon(ascSid).index

  const rawPlanets = [
    {name:'Surya',  abbr:'Su', lon:sunSid,  retrograde:false},
    {name:'Chandra',abbr:'Mo', lon:moonSid, retrograde:false},
    {name:'Mangal', abbr:'Ma', lon:toSidereal(planetLongitude('Mangal',jd),jd), retrograde:false},
    {name:'Budha',  abbr:'Me', lon:toSidereal(planetLongitude('Budha',jd),jd),  retrograde:false},
    {name:'Guru',   abbr:'Ju', lon:toSidereal(planetLongitude('Guru',jd),jd),   retrograde:false},
    {name:'Shukra', abbr:'Ve', lon:toSidereal(planetLongitude('Shukra',jd),jd), retrograde:false},
    {name:'Shani',  abbr:'Sa', lon:toSidereal(planetLongitude('Shani',jd),jd),  retrograde:false},
  ]
  const rahuLon = toSidereal(((125.04 - 1934.136*(jd-2451545)/36525)%360+360)%360, jd)
  rawPlanets.push({name:'Rahu',abbr:'Ra',lon:rahuLon,retrograde:true})
  rawPlanets.push({name:'Ketu',abbr:'Ke',lon:((rahuLon+180)%360),retrograde:true})

  const planets = rawPlanets.map(p => {
    const sign = signFromLon(p.lon)
    const house = ((sign.index - ascHouse + 12) % 12) + 1
    return {...p, sign:sign.name, signIndex:sign.index, degree:sign.degree, house, dignity:dignity(p.name,sign.index)}
  })

  const nakshatra = nakshatraFromLon(moonSid)
  const sunMoonDiff = ((moonSid-sunSid)+360)%360
  const tithiNum = Math.floor(sunMoonDiff/12)+1
  const TITHIS = ['Pratipada','Dwitiya','Tritiya','Chaturthi','Panchami','Shashthi','Saptami','Ashtami','Navami','Dashami','Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Purnima']
  const tithi = `${tithiNum<=15?'Shukla':'Krishna'} ${TITHIS[(tithiNum-1)%15]}`
  const YOGA_NAMES = ['Vishkambha','Priti','Ayushman','Saubhagya','Shobhana','Atiganda','Sukarma','Dhriti','Shula','Ganda','Vriddhi','Dhruva','Vyaghata','Harshana','Vajra','Siddhi','Vyatipata','Variyan','Parigha','Shiva','Siddha','Sadhya','Shubha','Shukla','Brahma','Indra','Vaidhriti']
  const yoga = YOGA_NAMES[Math.floor(((sunSid+moonSid)%360)/(360/27))%27]
  const houses = Array.from({length:12},(_,i)=>({house:i+1,sign:SIGNS[(ascHouse+i)%12],lord:SIGN_LORDS[(ascHouse+i)%12],signIndex:(ascHouse+i)%12}))
  const dashaStartIdx = DASHA_ORDER.indexOf(NAKSHATRAS[nakshatra.index].lord)

  return {
    ascendant:{sign:signFromLon(ascSid).name, degree:ascSid%30, symbol:getSymbol(signFromLon(ascSid).name), signIndex:ascHouse},
    sunSign:signFromLon(sunSid).name, moonSign:signFromLon(moonSid).name,
    nakshatra:nakshatra.name, nakshatraPada:nakshatra.pada, nakshatraLord:nakshatra.lord,
    tithi, yoga, planets, houses, dashaStartIdx, julianDay:jd
  }
}

export { SIGNS, SIGN_LORDS }