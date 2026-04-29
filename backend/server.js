import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import swisseph from 'swisseph'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (_, res) => res.json({ status: 'ok', server: 'render' }))

const SIGNS = ['Mesha','Vrishabha','Mithuna','Karka','Simha','Kanya','Tula','Vrischika','Dhanu','Makara','Kumbha','Meena']
const SIGN_LORDS = ['Mangal','Shukra','Budha','Chandra','Surya','Budha','Shukra','Mangal','Guru','Shani','Shani','Guru']
const SIGN_SYMBOLS = {'Mesha':'♈','Vrishabha':'♉','Mithuna':'♊','Karka':'♋','Simha':'♌','Kanya':'♍','Tula':'♎','Vrischika':'♏','Dhanu':'♐','Makara':'♑','Kumbha':'♒','Meena':'♓'}
const NAKSHATRAS = [
  {name:'Ashwini',lord:'Ketu',deity:'Ashwini Kumaras',quality:'Swift, energetic, healing'},
  {name:'Bharani',lord:'Shukra',deity:'Yama',quality:'Determined, creative, transformative'},
  {name:'Krittika',lord:'Surya',deity:'Agni',quality:'Sharp, purifying, ambitious'},
  {name:'Rohini',lord:'Chandra',deity:'Brahma',quality:'Creative, sensual, growth-oriented'},
  {name:'Mrigashira',lord:'Mangal',deity:'Soma',quality:'Searching, gentle, curious'},
  {name:'Ardra',lord:'Rahu',deity:'Rudra',quality:'Intense, transformative, stormy'},
  {name:'Punarvasu',lord:'Guru',deity:'Aditi',quality:'Returning, nurturing, optimistic'},
  {name:'Pushya',lord:'Shani',deity:'Brihaspati',quality:'Nourishing, protective, spiritual'},
  {name:'Ashlesha',lord:'Budha',deity:'Nagas',quality:'Penetrating, shrewd, mystical'},
  {name:'Magha',lord:'Ketu',deity:'Pitrs',quality:'Royal, ancestral, powerful'},
  {name:'Purva Phalguni',lord:'Shukra',deity:'Bhaga',quality:'Pleasure-loving, creative, social'},
  {name:'Uttara Phalguni',lord:'Surya',deity:'Aryaman',quality:'Helpful, patronizing, stable'},
  {name:'Hasta',lord:'Chandra',deity:'Savitr',quality:'Skillful, witty, resourceful'},
  {name:'Chitra',lord:'Mangal',deity:'Vishwakarma',quality:'Artistic, brilliant, magnetic'},
  {name:'Swati',lord:'Rahu',deity:'Vayu',quality:'Independent, flexible, diplomatic'},
  {name:'Vishakha',lord:'Guru',deity:'Indragni',quality:'Goal-oriented, determined, intense'},
  {name:'Anuradha',lord:'Shani',deity:'Mitra',quality:'Devoted, friendly, disciplined'},
  {name:'Jyeshtha',lord:'Budha',deity:'Indra',quality:'Elder, protective, powerful'},
  {name:'Mula',lord:'Ketu',deity:'Nirriti',quality:'Investigative, uprooting, spiritual'},
  {name:'Purva Ashadha',lord:'Shukra',deity:'Apas',quality:'Invincible, proud, energizing'},
  {name:'Uttara Ashadha',lord:'Surya',deity:'Vishvadevas',quality:'Victory, righteousness, universal'},
  {name:'Shravana',lord:'Chandra',deity:'Vishnu',quality:'Listening, learning, connecting'},
  {name:'Dhanishtha',lord:'Mangal',deity:'Ashta Vasus',quality:'Wealthy, musical, ambitious'},
  {name:'Shatabhisha',lord:'Rahu',deity:'Varuna',quality:'Healing, secretive, philosophical'},
  {name:'Purva Bhadrapada',lord:'Guru',deity:'Aja Ekapad',quality:'Fierce, transformative, passionate'},
  {name:'Uttara Bhadrapada',lord:'Shani',deity:'Ahir Budhnya',quality:'Depth, wisdom, serpentine power'},
  {name:'Revati',lord:'Budha',deity:'Pushan',quality:'Nourishing, prosperous, protective'}
]
const DASHA_YEARS = {Ketu:7,Shukra:20,Surya:6,Chandra:10,Mangal:7,Rahu:18,Guru:16,Shani:19,Budha:17}
const DASHA_ORDER = ['Ketu','Shukra','Surya','Chandra','Mangal','Rahu','Guru','Shani','Budha']
const CITIES = {
  'hyderabad':{lat:17.385,lon:78.4867},'mumbai':{lat:19.076,lon:72.8777},
  'delhi':{lat:28.6139,lon:77.209},'new delhi':{lat:28.6139,lon:77.209},
  'bangalore':{lat:12.9716,lon:77.5946},'chennai':{lat:13.0827,lon:80.2707},
  'kolkata':{lat:22.5726,lon:88.3639},'pune':{lat:18.5204,lon:73.8567},
  'ahmedabad':{lat:23.0225,lon:72.5714},'jaipur':{lat:26.9124,lon:75.7873},
  'abu road':{lat:24.4817,lon:72.7817},'abu':{lat:24.4817,lon:72.7817},
  'london':{lat:51.5074,lon:-0.1278},'new york':{lat:40.7128,lon:-74.006},
  'dubai':{lat:25.2048,lon:55.2708},'singapore':{lat:1.3521,lon:103.8198},
  'sydney':{lat:-33.8688,lon:151.2093},'toronto':{lat:43.6532,lon:-79.3832},
  'paris':{lat:48.8566,lon:2.3522},'tokyo':{lat:35.6762,lon:139.6503},
}

// Swiss Ephemeris planet IDs
const SE_PLANETS = {
  Surya: swisseph.SE_SUN,
  Chandra: swisseph.SE_MOON,
  Mangal: swisseph.SE_MARS,
  Budha: swisseph.SE_MERCURY,
  Guru: swisseph.SE_JUPITER,
  Shukra: swisseph.SE_VENUS,
  Shani: swisseph.SE_SATURN,
  Rahu: swisseph.SE_TRUE_NODE,
}

function getCoords(pob, reqLat, reqLon) {
  if (reqLat && reqLon) return {lat:parseFloat(reqLat), lon:parseFloat(reqLon)}
  const key = pob.toLowerCase().split(',')[0].trim()
  for (const [city,coords] of Object.entries(CITIES)) {
    if (key.includes(city)||city.includes(key)) return coords
  }
  return {lat:20.5937,lon:78.9629}
}

function toJD(year,month,day,hour=12,minute=0) {
  if(month<=2){year-=1;month+=12}
  const A=Math.floor(year/100),B=2-A+Math.floor(A/4)
  return Math.floor(365.25*(year+4716))+Math.floor(30.6001*(month+1))+day+B-1524.5+(hour+minute/60)/24
}

// Get planet longitude using Swiss Ephemeris
function getPlanetLon(jd, planetId) {
  return new Promise((resolve) => {
    swisseph.swe_calc_ut(jd, planetId, swisseph.SEFLG_SIDEREAL | swisseph.SEFLG_SPEED, (result) => {
      if (result.error) resolve(0)
      else resolve(result.longitude)
    })
  })
}

// Get ascendant using Swiss Ephemeris
function getAscendant(jd, lat, lon) {
  return new Promise((resolve) => {
    swisseph.swe_houses(jd, swisseph.SEFLG_SIDEREAL, lat, lon, 'P', (result) => {
      if (result.error) resolve(0)
      else resolve(result.ascendant)
    })
  })
}

function signFrom(lon) {
  const l=((lon%360)+360)%360
  const idx=Math.floor(l/30)%12
  return {index:idx,name:SIGNS[idx],lord:SIGN_LORDS[idx],degree:l%30,symbol:SIGN_SYMBOLS[SIGNS[idx]]}
}

function nakFrom(lon) {
  const l=((lon%360)+360)%360
  const idx=Math.floor(l/(360/27))%27
  return {...NAKSHATRAS[idx],index:idx,pada:Math.floor((l%(360/27))/(360/108))+1}
}

function dignity(planet,si) {
  const OWN={Surya:[4],Chandra:[3],Mangal:[0,7],Budha:[2,5],Guru:[8,11],Shukra:[1,6],Shani:[9,10]}
  const EXALT={Surya:0,Chandra:1,Mangal:9,Budha:5,Guru:3,Shukra:11,Shani:6,Rahu:1,Ketu:7}
  const DEBIL={Surya:6,Chandra:7,Mangal:3,Budha:11,Guru:9,Shukra:5,Shani:0}
  if(EXALT[planet]===si) return 'Exalted'
  if(DEBIL[planet]===si) return 'Debilitated'
  if(OWN[planet]?.includes(si)) return 'Own sign'
  return 'Neutral'
}

function calcStrength(planet,si,house) {
  let s=50
  const d=dignity(planet,si)
  if(d==='Exalted') s+=40
  else if(d==='Own sign') s+=30
  else if(d==='Debilitated') s-=30
  if([1,4,5,7,9,10].includes(house)) s+=15
  if([6,8,12].includes(house)) s-=15
  return Math.max(0,Math.min(100,s))
}
function calcAspects(planets) {
  const aspects = []
  const SPECIAL_ASPECTS = {
    Mangal: [4, 7, 8],   // Mars aspects 4th, 7th, 8th from itself
    Guru:   [5, 7, 9],   // Jupiter aspects 5th, 7th, 9th
    Shani:  [3, 7, 10],  // Saturn aspects 3rd, 7th, 10th
  }

  planets.forEach(p => {
    const specialHouses = SPECIAL_ASPECTS[p.name]
    if (!specialHouses) return
    specialHouses.forEach(aspectHouse => {
      const targetHouse = ((p.house + aspectHouse - 2) % 12) + 1
      const aspectedPlanets = planets.filter(x => x.house === targetHouse && x.name !== p.name)
      aspects.push({
        from: p.name,
        fromHouse: p.house,
        toHouse: targetHouse,
        type: aspectHouse + 'th aspect',
        aspectedPlanets: aspectedPlanets.map(x => x.name)
      })
    })
  })
  return aspects
}

function analyzeHouseLords(planets, houses) {
  const analysis = []
  const HOUSE_MEANINGS = {
    1:'self and personality', 2:'wealth and family', 3:'courage and siblings',
    4:'home and mother', 5:'children and intelligence', 6:'enemies and health',
    7:'marriage and partnerships', 8:'longevity and transformation',
    9:'fortune and dharma', 10:'career and status', 11:'gains and friends',
    12:'losses and liberation'
  }
  houses.forEach(h => {
    const lord = planets.find(p => p.name === h.lord)
    if (!lord) return
    analysis.push({
      house: h.house,
      sign: h.sign,
      lord: h.lord,
      lordInHouse: lord.house,
      lordInSign: lord.sign,
      meaning: 'Lord of ' + HOUSE_MEANINGS[h.house] + ' is in house ' + lord.house + ' (' + HOUSE_MEANINGS[lord.house] + ')',
      dignity: lord.dignity
    })
  })
  return analysis
}

function calcTransitEffects(currentTransits, birthAscHouse) {
  const effects = []
  currentTransits.forEach(t => {
    const transitSign = t.sign
    const SIGNS_LIST = ['Mesha','Vrishabha','Mithuna','Karka','Simha','Kanya','Tula','Vrischika','Dhanu','Makara','Kumbha','Meena']
    const transitSignIdx = SIGNS_LIST.indexOf(transitSign)
    const houseFromLagna = ((transitSignIdx - birthAscHouse + 12) % 12) + 1
    effects.push({
      planet: t.name,
      currentSign: transitSign,
      houseFromLagna,
      degree: t.degree
    })
  })
  return effects
}
function detectYogas(planets,houses) {
  const yogas=[],doshas=[]
  const p=n=>planets.find(x=>x.name===n)
  const KENDRAS=[1,4,7,10]
  const moon=p('Chandra'),sun=p('Surya'),jup=p('Guru'),mar=p('Mangal'),ven=p('Shukra'),mer=p('Budha')
  if(moon&&jup){
    const d=Math.abs(moon.house-jup.house),r=d===0?1:(d>6?12-d+1:d+1)
    if(KENDRAS.includes(r)) yogas.push({name:'Gajakesari Yoga',strength:'Strong',desc:'Moon and Jupiter in mutual kendras — wisdom, prosperity and lasting fame.'})
  }
  if(sun&&mer&&sun.house===mer.house) yogas.push({name:'Budhaditya Yoga',strength:'Moderate',desc:'Sun and Mercury conjunct — sharp intellect and success in knowledge fields.'})
  if(jup&&KENDRAS.includes(jup.house)&&['Own sign','Exalted'].includes(jup.dignity)) yogas.push({name:'Hamsa Yoga',strength:'Strong',desc:'Jupiter in kendra in own/exalted sign — righteousness and spiritual elevation.'})
  if(ven&&KENDRAS.includes(ven.house)&&['Own sign','Exalted'].includes(ven.dignity)) yogas.push({name:'Malavya Yoga',strength:'Strong',desc:'Venus in kendra in own/exalted sign — beauty, luxury and marital happiness.'})
  if(mar&&KENDRAS.includes(mar.house)&&['Own sign','Exalted'].includes(mar.dignity)) yogas.push({name:'Ruchaka Yoga',strength:'Strong',desc:'Mars in kendra in own/exalted sign — courage and physical excellence.'})
  const lord9=houses.find(h=>h.house===9)?.lord,lord10=houses.find(h=>h.house===10)?.lord
  const p9=planets.find(x=>x.name===lord9),p10=planets.find(x=>x.name===lord10)
  if(p9&&p10&&p9.house===p10.house) yogas.push({name:'Raja Yoga',strength:'Strong',desc:'Lords of 9th and 10th conjunct — authority, power and recognition.'})
  if(mar&&[1,2,4,7,8,12].includes(mar.house)) doshas.push({name:'Mangal Dosha',severity:[7,8].includes(mar.house)?'Severe':'Mild',desc:'Mars dosha affects partnerships. Remedy: Hanuman Chalisa on Tuesdays.'})
  return {yogas,doshas}
}

function calcDasha(startIdx,birthJD,currentJD) {
  const y=(currentJD-birthJD)/365.25
  const dashas=[]
  let cum=0
  for(let i=0;i<9;i++){
    const pl=DASHA_ORDER[(startIdx+i)%9],yrs=DASHA_YEARS[pl]
    dashas.push({planet:pl,startYear:cum,endYear:cum+yrs,years:yrs})
    cum+=yrs
  }
  const ymod=y%120
  const current=dashas.find(d=>ymod>=d.startYear&&ymod<d.endYear)||dashas[0]
  const prog=ymod-current.startYear
  const antardashas=[]
  let ac=0
  for(let i=0;i<9;i++){
    const ap=DASHA_ORDER[(DASHA_ORDER.indexOf(current.planet)+i)%9]
    const ay=(DASHA_YEARS[ap]*current.years)/120
    antardashas.push({planet:ap,startYear:ac,endYear:ac+ay})
    ac+=ay
  }
  const currentAntar=antardashas.find(a=>prog>=a.startYear&&prog<a.endYear)||antardashas[0]
  const pratPlanet=DASHA_ORDER[(DASHA_ORDER.indexOf(currentAntar.planet)+1)%9]
  const rem=current.endYear-ymod
  const endDate=new Date(Date.now()+rem*365.25*86400000).toISOString().split('T')[0]
  const antarRem=currentAntar.endYear-prog
  const antarEndDate=new Date(Date.now()+antarRem*365.25*86400000).toISOString().split('T')[0]
  return {current:current.planet,subDasha:currentAntar.planet,pratyantar:pratPlanet,endDate,antarEndDate,allDashas:dashas}
}

function detectSadeSati(satSignIdx,moonSignIdx) {
  const diff=Math.abs(satSignIdx-moonSignIdx)
  const minDiff=Math.min(diff,12-diff)
  return {active:minDiff<=1,phase:minDiff===0?'Peak':'Rising/Setting'}
}

function buildSummary(name,k,dasha,yogas) {
  const yogaStr=yogas?.slice(0,2).map(y=>y.name).join(' and ')||'benefic combinations'
  return name+' has '+k.ascendant.sign+' lagna with Moon in '+k.moonSign+' ('+k.nakshatra+' Nakshatra, Pada '+k.nakshatraPada+'). Currently in '+dasha.current+'-'+dasha.subDasha+' Dasha until '+dasha.endDate+'. '+yogaStr+' provide powerful elevating influences throughout this lifetime.'
}

app.post('/api/calculate', async (req, res) => {
  try {
    const {name,dob,tob,pob,gender} = req.body
    if(!dob||!tob||!pob) return res.status(400).json({error:'Missing required fields'})
    const [year,month,day]=dob.split('-').map(Number)
    const [hour,minute]=tob.split(':').map(Number)
    const {lat,lon}=getCoords(pob,req.body.lat,req.body.lon)

    // Convert local time to UTC
    // Use standard timezone offset based on region
// For India, always use IST = UTC+5:30 = 5.5 hours
// For other regions, use longitude-based offset
const isIndia = lat >= 8 && lat <= 37 && lon >= 68 && lon <= 97
const tzOffsetHours = isIndia ? 5.5 : lon / 15
    const localDecimalHour = hour + minute / 60
    const utcDecimalHour = localDecimalHour - tzOffsetHours
    const utcDecimalNorm = ((utcDecimalHour % 24) + 24) % 24
    const utcH = Math.floor(utcDecimalNorm)
    const utcM = Math.floor((utcDecimalNorm - utcH) * 60)
    const birthJD = toJD(year, month, day, utcH, utcM)
    const currentJD = toJD(...new Date().toISOString().slice(0,10).split('-').map(Number),12,0)

    // Set Lahiri ayanamsha
    swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0)

    // Get all planet positions using Swiss Ephemeris
    const [sunLon, moonLon, marsLon, mercLon, jupLon, venLon, satLon, rahuLon] = await Promise.all([
      getPlanetLon(birthJD, swisseph.SE_SUN),
      getPlanetLon(birthJD, swisseph.SE_MOON),
      getPlanetLon(birthJD, swisseph.SE_MARS),
      getPlanetLon(birthJD, swisseph.SE_MERCURY),
      getPlanetLon(birthJD, swisseph.SE_JUPITER),
      getPlanetLon(birthJD, swisseph.SE_VENUS),
      getPlanetLon(birthJD, swisseph.SE_SATURN),
      getPlanetLon(birthJD, swisseph.SE_TRUE_NODE),
    ])

    const ketuLon = ((rahuLon + 180) % 360)
    const ascLon = await getAscendant(birthJD, lat, lon)
    const ascHouse = signFrom(ascLon).index

    const rawP = [
      {name:'Surya', abbr:'Su', lon:sunLon, retrograde:false},
      {name:'Chandra', abbr:'Mo', lon:moonLon, retrograde:false},
      {name:'Mangal', abbr:'Ma', lon:marsLon, retrograde:false},
      {name:'Budha', abbr:'Me', lon:mercLon, retrograde:false},
      {name:'Guru', abbr:'Ju', lon:jupLon, retrograde:false},
      {name:'Shukra', abbr:'Ve', lon:venLon, retrograde:false},
      {name:'Shani', abbr:'Sa', lon:satLon, retrograde:false},
      {name:'Rahu', abbr:'Ra', lon:rahuLon, retrograde:true},
      {name:'Ketu', abbr:'Ke', lon:ketuLon, retrograde:true},
    ]

    const planets = rawP.map(p => {
      const sign = signFrom(p.lon)
      const house = ((sign.index - ascHouse + 12) % 12) + 1
      const dig = dignity(p.name, sign.index)
      return {...p, sign:sign.name, signIndex:sign.index, degree:sign.degree.toFixed(2), house, dignity:dig, strength:calcStrength(p.name,sign.index,house)}
    })

    const moonS = moonLon
    const sunS = sunLon
    const nak = nakFrom(moonS)
    const sunMoonDiff = ((moonS - sunS) + 360) % 360
    const tithiNum = Math.floor(sunMoonDiff / 12) + 1
    const TITHIS = ['Pratipada','Dwitiya','Tritiya','Chaturthi','Panchami','Shashthi','Saptami','Ashtami','Navami','Dashami','Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Purnima']
    const tithi = (tithiNum<=15?'Shukla':'Krishna')+' '+TITHIS[(tithiNum-1)%15]
    const YOGA_NAMES = ['Vishkambha','Priti','Ayushman','Saubhagya','Shobhana','Atiganda','Sukarma','Dhriti','Shula','Ganda','Vriddhi','Dhruva','Vyaghata','Harshana','Vajra','Siddhi','Vyatipata','Variyan','Parigha','Shiva','Siddha','Sadhya','Shubha','Shukla','Brahma','Indra','Vaidhriti']
    const yoga = YOGA_NAMES[Math.floor(((sunS+moonS)%360)/(360/27))%27]
    const KARANA = ['Bava','Balava','Kaulava','Taitila','Garaja','Vanija','Vishti','Shakuni','Chatushpada','Naga','Kimstughna']
    const karana = KARANA[Math.floor(sunMoonDiff/6)%11]
    const houses = Array.from({length:12},(_,i)=>({house:i+1,sign:SIGNS[(ascHouse+i)%12],lord:SIGN_LORDS[(ascHouse+i)%12],signIndex:(ascHouse+i)%12}))
    const dashaStartIdx = DASHA_ORDER.indexOf(NAKSHATRAS[nak.index].lord)
    const ascSign = signFrom(ascLon)
    const dasha = calcDasha(dashaStartIdx, birthJD, currentJD)
    const {yogas,doshas} = detectYogas(planets, houses)

    // Current transits
    swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0)
    const [cSun,cMoon,cMars,cMerc,cJup,cVen,cSat,cRahu] = await Promise.all([
      getPlanetLon(currentJD, swisseph.SE_SUN),
      getPlanetLon(currentJD, swisseph.SE_MOON),
      getPlanetLon(currentJD, swisseph.SE_MARS),
      getPlanetLon(currentJD, swisseph.SE_MERCURY),
      getPlanetLon(currentJD, swisseph.SE_JUPITER),
      getPlanetLon(currentJD, swisseph.SE_VENUS),
      getPlanetLon(currentJD, swisseph.SE_SATURN),
      getPlanetLon(currentJD, swisseph.SE_TRUE_NODE),
    ])
    const currentTransits = [
      {name:'Surya',sign:signFrom(cSun).name,degree:signFrom(cSun).degree.toFixed(1),lon:cSun},
      {name:'Chandra',sign:signFrom(cMoon).name,degree:signFrom(cMoon).degree.toFixed(1),lon:cMoon},
      {name:'Mangal',sign:signFrom(cMars).name,degree:signFrom(cMars).degree.toFixed(1),lon:cMars},
      {name:'Budha',sign:signFrom(cMerc).name,degree:signFrom(cMerc).degree.toFixed(1),lon:cMerc},
      {name:'Guru',sign:signFrom(cJup).name,degree:signFrom(cJup).degree.toFixed(1),lon:cJup},
      {name:'Shukra',sign:signFrom(cVen).name,degree:signFrom(cVen).degree.toFixed(1),lon:cVen},
      {name:'Shani',sign:signFrom(cSat).name,degree:signFrom(cSat).degree.toFixed(1),lon:cSat},
      {name:'Rahu',sign:signFrom(cRahu).name,degree:signFrom(cRahu).degree.toFixed(1),lon:cRahu},
      {name:'Ketu',sign:signFrom((cRahu+180)%360).name,degree:signFrom((cRahu+180)%360).degree.toFixed(1),lon:(cRahu+180)%360},
    ]

    const satTransit = currentTransits.find(t=>t.name==='Shani')
    const moonSign = signFrom(moonS)
    const sadeSati = satTransit ? detectSadeSati(signFrom(satTransit.lon).index, moonSign.index) : {active:false}
    const ashtakavarga = Array.from({length:12},(_,i)=>({house:i+1,sign:SIGNS[(ascHouse+i)%12],score:Math.floor(Math.random()*4)+3}))

    const kundali = {
      ascendant:{sign:ascSign.name,degree:parseFloat((ascLon%30).toFixed(2)),symbol:SIGN_SYMBOLS[ascSign.name],signIndex:ascHouse},
      sunSign:signFrom(sunS).name,moonSign:moonSign.name,
      nakshatra:nak.name,nakshatraPada:nak.pada,nakshatraLord:nak.lord,
      nakshatraQuality:nak.quality,nakshatraDeity:nak.deity,
      tithi,yoga,karana,planets,houses,dashaStartIdx,julianDay:birthJD
    }
    const summary = buildSummary(name||'The native', kundali, dasha, yogas)
    res.json({...kundali,dasha,yogas,doshas,summary,name,gender,pob,currentTransits,ashtakavarga,sadeSati})
  } catch(err) {
    console.error(err)
    res.status(500).json({error:'Calculation error',detail:err.message})
  }
})

app.post('/api/debug', (req, res) => {
  try {
    const {dob,tob,pob} = req.body
    const [year,month,day] = dob.split('-').map(Number)
    const [hour,minute] = tob.split(':').map(Number)
    const {lat,lon} = getCoords(pob,null,null)
    // Use standard timezone offset based on region
// For India, always use IST = UTC+5:30 = 5.5 hours
// For other regions, use longitude-based offset
const isIndia = lat >= 8 && lat <= 37 && lon >= 68 && lon <= 97
const tzOffsetHours = isIndia ? 5.5 : lon / 15
    const localDecimalHour = hour + minute / 60
    const utcDecimalHour = localDecimalHour - tzOffsetHours
    const utcDecimalNorm = ((utcDecimalHour % 24) + 24) % 24
    const utcH = Math.floor(utcDecimalNorm)
    const utcM = Math.floor((utcDecimalNorm - utcH) * 60)
    const jd = toJD(year,month,day,utcH,utcM)
    swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0)
    swisseph.swe_calc_ut(jd, swisseph.SE_MOON, swisseph.SEFLG_SIDEREAL, (result) => {
      const moonSid = result.longitude
      const sign = signFrom(moonSid)
      res.json({utcTime:utcH+':'+utcM, jd, moonSidereal:moonSid, moonSign:sign.name, moonDegree:sign.degree})
    })
  } catch(err) {
    res.status(500).json({error:err.message})
  }
})

app.post('/api/horoscope', (req, res) => {
  const {chartData,period}=req.body
  if(!chartData||!period) return res.status(400).json({error:'Missing data'})
  const {ascendant,moonSign,nakshatra,nakshatraPada,dasha,houses,name}=chartData
  const dl=dasha?.current||'Guru',al=dasha?.subDasha||'Shani'
  const h10=houses?.find(h=>h.house===10),h7=houses?.find(h=>h.house===7)
  const lines=[
    '# '+period.charAt(0).toUpperCase()+period.slice(1)+' Horoscope — '+(name||'Native'),
    '*'+(ascendant?.sign||'')+' Lagna · '+moonSign+' Rashi · '+nakshatra+' Nakshatra*',
    '','## Cosmic Theme',
    'The '+dl+'-'+al+' Dasha shapes this period with themes of growth and transformation.',
    '','## Career & Finance',
    'The 10th house lord '+(h10?.lord||'')+' indicates professional focus this period.',
    '','## Relationships',
    'The 7th house lord '+(h7?.lord||'')+' brings relationship themes to the fore.',
    '','## Health',
    'Maintain steady routines. Your '+moonSign+' Moon benefits from regular rest.',
    '','## Spirituality',
    nakshatra+' Nakshatra carries deep spiritual energy. Daily meditation is recommended.',
    '','## Remedies',
    'Recite the Gayatri Mantra 108 times at dawn. Honour the '+dl+' Mahadasha through its practices.',
    '','*Om Tat Sat*'
  ]
  res.json({horoscope:lines.join('\n'),period})
})

app.post('/api/ai-horoscope', async (req, res) => {
  try {
    const {chartData,period}=req.body
    if(!chartData||!period) return res.status(400).json({error:'Missing data'})
    const {ascendant,moonSign,nakshatra,nakshatraPada,nakshatraLord,nakshatraDeity,nakshatraQuality,dasha,yogas,doshas,planets,houses,name,sadeSati}=chartData
    const dl=dasha?.current||'Guru'
    const al=dasha?.subDasha||'Shani'
    const pl=dasha?.pratyantar||'Budha'
    const strongPlanets=planets?.filter(p=>p.strength>=65).map(p=>p.name+' in '+p.sign+' H'+p.house).join(', ')
    const yogaList=yogas?.slice(0,2).map(y=>y.name).join(', ')||'none'
    const doshaList=doshas?.map(d=>d.name).join(', ')||'none'
    const h10=houses?.find(h=>h.house===10)
    const h7=houses?.find(h=>h.house===7)
    const h6=houses?.find(h=>h.house===6)
    let periodFocus='this week only. Mention specific days like Monday, Thursday, Saturday.'
    if(period==='monthly') periodFocus='this month. Divide into early (days 1-10), middle (days 11-20) and late (days 21-30) phases.'
    if(period==='annual') periodFocus='the full year 2026. Cover all 4 quarters with specific months.'
    const promptLines=[
      'You are Jyotish Acharya, a master Vedic astrologer with 40 years of experience.',
      'Speak with authority, warmth and genuine spiritual insight.',
      '','BIRTH CHART:',
      'Name: '+(name||'the native'),
      'Lagna: '+(ascendant?.sign||'')+' | Moon: '+moonSign+' | Nakshatra: '+nakshatra+' Pada '+nakshatraPada+' (lord: '+nakshatraLord+', deity: '+(nakshatraDeity||'')+')',
      'Quality: '+(nakshatraQuality||''),
      'Dasha: '+dl+' Mahadasha, '+al+' Antardasha, '+pl+' Pratyantardasha (ends '+dasha?.endDate+')',
      'Strong planets: '+(strongPlanets||'none'),
      'Yogas: '+yogaList+' | Doshas: '+doshaList,
      '10th house lord: '+(h10?.lord||'')+' | 7th house lord: '+(h7?.lord||'')+' | 6th house lord: '+(h6?.lord||''),
      'Sade Sati: '+(sadeSati?.active?'YES - '+sadeSati.phase+' phase':'No'),
      '','Write a complete '+period+' horoscope focusing on '+periodFocus,
      '','Use these exact section headers:',
      '## Cosmic Theme','## Career & Finance (Artha)',
      '## Relationships & Love (Kama)','## Health & Vitality (Arogya)',
      '## Spirituality & Inner Growth (Dharma-Moksha)','## Vedic Remedies (Upaya)',
      '','Each section: 4-5 sentences. Use Sanskrit terms naturally.',
      'Be specific to this persons actual chart - mention their planets, signs and houses.',
      'End with a Sanskrit blessing line.','Total: 400-500 words.'
    ]
    const response=await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key='+process.env.GEMINI_API_KEY,
      {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:promptLines.join('\n')}]}],generationConfig:{temperature:0.7,maxOutputTokens:2000,topP:0.9}})}
    )
    const data=await response.json()
    if(data.error) throw new Error(data.error.message)
    const text=data.candidates?.[0]?.content?.parts?.[0]?.text
    if(!text) throw new Error('No response from Gemini')
    res.json({horoscope:text,period,ai:true})
  } catch(err) {
    console.error('AI error:',err)
    res.status(500).json({error:err.message})
  }
})

app.post('/api/chat', async (req, res) => {
  try {
    const {question,chartData,history}=req.body
    if(!question||!chartData) return res.status(400).json({error:'Missing data'})
    const {ascendant,moonSign,nakshatra,nakshatraPada,dasha,yogas,doshas,planets,houses,name,aspects,houseLordAnalysis,demographics}=chartData
    const dl=dasha?.current||'Guru',al=dasha?.subDasha||'Shani'

    const chartSummary=name+', '+ascendant?.sign+' lagna, '+moonSign+' Moon, '+nakshatra+' Pada '+nakshatraPada+', '+dl+'-'+al+' Dasha (ends '+dasha?.endDate+')'
    const planetSummary=planets?.map(p=>p.name+'('+p.sign+',H'+p.house+','+p.dignity+')').join(' | ')
    const yogaSummary=yogas?.map(y=>y.name).join(', ')||'none'
    const doshaSummary=doshas?.map(d=>d.name).join(', ')||'none'

    const h7lord=houses?.find(h=>h.house===7)?.lord||''
    const h10lord=houses?.find(h=>h.house===10)?.lord||''
    const h5lord=houses?.find(h=>h.house===5)?.lord||''
    const h4lord=houses?.find(h=>h.house===4)?.lord||''

    const keyAspects=aspects?.filter(a=>a.aspectedPlanets.length>0)
      .map(a=>a.from+' aspects H'+a.toHouse+(a.aspectedPlanets.length?' ('+a.aspectedPlanets.join(',')+')':''))
      .slice(0,4).join('; ')||'none'

    const keyHouseLords=houseLordAnalysis?.slice(0,5)
      .map(h=>'H'+h.house+' lord '+h.lord+' in H'+h.lordInHouse+' ('+h.dignity+')')
      .join('; ')||''

    const demo=demographics||{}
    const demoContext=Object.keys(demo).length
      ? 'User profile — Age: '+demo.ageGroup+', Life stage: '+demo.lifeStage+', Relationship: '+demo.relationshipStatus+', Interests: '+(Array.isArray(demo.primaryInterest)?demo.primaryInterest.join(', '):demo.primaryInterest)
      : ''

    const userLoc=req.body.userLocation
    const locContext=userLoc?.display?'Currently in '+userLoc.display+'.':''

    const historyText=history?.slice(-4).map(h=>(h.role==='user'?'Seeker':'Jyotishi')+': '+h.content).join('\n')||''

    const prompt=[
      'You are Jyotish Acharya — a master Vedic astrologer having a warm personal consultation.',
      '',
      'BIRTH CHART:',
      chartSummary,
      'Planets: '+planetSummary,
      'Yogas: '+yogaSummary+' | Doshas: '+doshaSummary,
      'Key aspects: '+keyAspects,
      'House lords: '+keyHouseLords,
      'Marriage lord (H7): '+h7lord+' | Career lord (H10): '+h10lord+' | Children lord (H5): '+h5lord+' | Home lord (H4): '+h4lord,
      demoContext,
      locContext,
      '',
      historyText?'CONVERSATION SO FAR:\n'+historyText+'\n':'',
      'SEEKER ASKS: '+question,
      '',
      'Answer guidelines:',
      '- 4-6 sentences, warm, conversational and deeply specific to their chart',
      '- Reference their actual planets, houses, aspects or dasha period',
      '- Use Sanskrit terms naturally (Karma, Dasha, Graha, Lagna etc.)',
      demoContext?'- Tailor advice to their profile: '+demoContext:'',
      '- If career question: reference H10 lord '+h10lord+' placement',
      '- If relationship question: reference H7 lord '+h7lord+' placement',
      '- Mention a specific remedy when relevant',
      '- End with a brief uplifting note',
      '- Write in flowing prose, no bullet points'
    ].join('\n')

    const response=await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key='+process.env.GEMINI_API_KEY,
      {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{temperature:0.7,maxOutputTokens:600,topP:0.9}})}
    )
    const data=await response.json()
    if(data.error) throw new Error(data.error.message)
    const text=data.candidates?.[0]?.content?.parts?.[0]?.text

    // Generate contextual follow-up hooks based on demographics and answer
    const demoHint=demoContext?'User is '+demo.ageGroup+', '+demo.lifeStage+', '+demo.relationshipStatus+'.':''
    let followUps=[]
    try {
      const fuRes=await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key='+process.env.GEMINI_API_KEY,
        {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
          contents:[{parts:[{text:'Jyotish answer given: '+text+'\n\n'+demoHint+'\n\nSuggest 2 specific follow-up questions this person would naturally want to ask next about their Vedic astrology reading. Return as JSON array only, no markdown: ["Q1?","Q2?"]'}]}],
          generationConfig:{temperature:0.7,maxOutputTokens:120}
        })}
      )
      const fuData=await fuRes.json()
      const fuText=fuData.candidates?.[0]?.content?.parts?.[0]?.text||'[]'
      followUps=JSON.parse(fuText.replace(/```json|```/g,'').trim())
    } catch(e) { followUps=[] }

    res.json({answer:text||'Please try again.',followUps})
  } catch(err) {
    res.status(500).json({error:err.message})
  }
})
const PORT=process.env.PORT||3001
app.post('/api/sunsign', async (req, res) => {
  try {
    const {sign, period, location} = req.body
    if (!sign || !period) return res.status(400).json({error:'Missing sign or period'})

    // Get current planetary transits
    swisseph.swe_set_sid_mode(swisseph.SE_SIDM_LAHIRI, 0, 0)
    const now = new Date()
    const currentJD = toJD(now.getFullYear(), now.getMonth()+1, now.getDate(), 12, 0)

    const [cSun,cMoon,cMars,cMerc,cJup,cVen,cSat,cRahu] = await Promise.all([
      getPlanetLon(currentJD, swisseph.SE_SUN),
      getPlanetLon(currentJD, swisseph.SE_MOON),
      getPlanetLon(currentJD, swisseph.SE_MARS),
      getPlanetLon(currentJD, swisseph.SE_MERCURY),
      getPlanetLon(currentJD, swisseph.SE_JUPITER),
      getPlanetLon(currentJD, swisseph.SE_VENUS),
      getPlanetLon(currentJD, swisseph.SE_SATURN),
      getPlanetLon(currentJD, swisseph.SE_TRUE_NODE),
    ])

    const transits = [
      {name:'Surya (Sun)', sign:signFrom(cSun).name, degree:signFrom(cSun).degree.toFixed(1)},
      {name:'Chandra (Moon)', sign:signFrom(cMoon).name, degree:signFrom(cMoon).degree.toFixed(1)},
      {name:'Mangal (Mars)', sign:signFrom(cMars).name, degree:signFrom(cMars).degree.toFixed(1)},
      {name:'Budha (Mercury)', sign:signFrom(cMerc).name, degree:signFrom(cMerc).degree.toFixed(1)},
      {name:'Guru (Jupiter)', sign:signFrom(cJup).name, degree:signFrom(cJup).degree.toFixed(1)},
      {name:'Shukra (Venus)', sign:signFrom(cVen).name, degree:signFrom(cVen).degree.toFixed(1)},
      {name:'Shani (Saturn)', sign:signFrom(cSat).name, degree:signFrom(cSat).degree.toFixed(1)},
      {name:'Rahu', sign:signFrom(cRahu).name, degree:signFrom(cRahu).degree.toFixed(1)},
      {name:'Ketu', sign:signFrom((cRahu+180)%360).name, degree:signFrom((cRahu+180)%360).degree.toFixed(1)},
    ]

    const SIGN_NUMBERS = {Mesha:1,Vrishabha:2,Mithuna:3,Karka:4,Simha:5,Kanya:6,Tula:7,Vrischika:8,Dhanu:9,Makara:10,Kumbha:11,Meena:12}
    const signNum = SIGN_NUMBERS[sign] || 1

    const periodLabel = period === 'monthly'
      ? now.toLocaleString('en-IN', {month:'long', year:'numeric'})
      : '2026'

    const prompt = [
      'You are a world-class Vedic astrologer writing in the warm, detailed, insightful style of Susan Miller of AstrologyZone.',
      'Write a ' + period + ' forecast for ' + sign + ' (' + periodLabel + ').',
      '',
      'CURRENT PLANETARY POSITIONS (Vedic sidereal):',
      transits.map(t => t.name + ' in ' + t.sign + ' at ' + t.degree + '°').join('\n'),
      '',
      'The reader\'s Sun sign is ' + sign + ' (sign number ' + signNum + ' in the zodiac).',
      location ? 'Reader is located in ' + location + '.' : '',
      '',
      'Write a detailed, warm, ' + period + ' forecast covering ALL of these areas:',
      '## Overview — The Cosmic Story This ' + (period==='monthly'?'Month':'Year'),
      '## Love & Relationships',
      '## Career & Finance',
      '## Health & Wellbeing',
      '## Spirituality & Inner Growth',
      period === 'monthly' ? '## Key Dates This Month' : '## Quarterly Breakdown',
      '## Your Cosmic Advice',
      '',
      'Style guidelines:',
      '- Write like Susan Miller — warm, encouraging, specific, conversational',
      '- Reference actual planet positions from the transit data above',
      '- Mention specific dates or time periods within the ' + period,
      '- Each section should be 3-5 sentences minimum',
      '- Use Vedic planet names (Guru, Shani, Shukra etc.) alongside English names',
      '- Be optimistic but honest about challenges',
      '- Total length: ' + (period === 'monthly' ? '600-800' : '1000-1200') + ' words',
      '- End with an inspiring closing message',
    ].join('\n')

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=' + process.env.GEMINI_API_KEY,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          contents: [{parts: [{text: prompt}]}],
          generationConfig: {temperature: 0.8, maxOutputTokens: 2000, topP: 0.9}
        })
      }
    )
    const data = await response.json()
    if (data.error) throw new Error(data.error.message)
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) throw new Error('No response from Gemini')
    res.json({forecast: text, sign, period})
  } catch(err) {
    console.error('Sun sign error:', err)
    res.status(500).json({error: err.message})
  }
})
app.listen(PORT,()=>console.log('Jyotish API running on port '+PORT))