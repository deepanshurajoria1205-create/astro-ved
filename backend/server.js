import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (_, res) => res.json({ status: 'ok', server: 'render' }))

// ---- INLINE ASTROLOGY ENGINE ----

const SIGNS = ['Mesha','Vrishabha','Mithuna','Karka','Simha','Kanya','Tula','Vrischika','Dhanu','Makara','Kumbha','Meena']
const SIGN_LORDS = ['Mangal','Shukra','Budha','Chandra','Surya','Budha','Shukra','Mangal','Guru','Shani','Shani','Guru']
const ELEMENTS = ['Fire','Earth','Air','Water','Fire','Earth','Air','Water','Fire','Earth','Air','Water']
const NATURES = ['Movable','Fixed','Dual','Movable','Fixed','Dual','Movable','Fixed','Dual','Movable','Fixed','Dual']
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
  'bangalore':{lat:12.9716,lon:77.5946},'bengaluru':{lat:12.9716,lon:77.5946},
  'chennai':{lat:13.0827,lon:80.2707},'kolkata':{lat:22.5726,lon:88.3639},
  'pune':{lat:18.5204,lon:73.8567},'ahmedabad':{lat:23.0225,lon:72.5714},
  'jaipur':{lat:26.9124,lon:75.7873},'lucknow':{lat:26.8467,lon:80.9462},
  'abu road':{lat:24.4817,lon:72.7817},'abu':{lat:24.4817,lon:72.7817},
  'london':{lat:51.5074,lon:-0.1278},'new york':{lat:40.7128,lon:-74.006},
  'dubai':{lat:25.2048,lon:55.2708},'singapore':{lat:1.3521,lon:103.8198},
  'sydney':{lat:-33.8688,lon:151.2093},'toronto':{lat:43.6532,lon:-79.3832},
  'paris':{lat:48.8566,lon:2.3522},'berlin':{lat:52.52,lon:13.405},
  'tokyo':{lat:35.6762,lon:139.6503},
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

function sunLon(jd) {
  const T=(jd-2451545)/36525
  const L0=280.46646+36000.76983*T
  const M=(357.52911+35999.05029*T)*Math.PI/180
  const C=(1.914602-0.004817*T)*Math.sin(M)+0.019993*Math.sin(2*M)+0.000289*Math.sin(3*M)
  const omega=(125.04-1934.136*T)*Math.PI/180
  return (((L0+C)-0.00569-0.00478*Math.sin(omega))%360+360)%360
}

function moonLon(jd) {
  const T=(jd-2451545)/36525
  const D=(297.85036+445267.11148*T)*Math.PI/180
  const M=(357.52772+35999.05034*T)*Math.PI/180
  const Mp=(134.96298+477198.867398*T)*Math.PI/180
  const F=(93.27191+483202.017538*T)*Math.PI/180
  const lon=218.3165+481267.8813*T-1.274*Math.sin(Mp-2*D)+0.658*Math.sin(2*D)
    -0.186*Math.sin(M)-0.114*Math.sin(2*F)+0.059*Math.sin(2*Mp-2*D)
  return ((lon%360)+360)%360
}

function planetLon(planet,jd) {
  const T=(jd-2451545)/36525
  const p={Mangal:{L0:355.433,dL:19140.2993,e:0.0934,omega:286.5},Budha:{L0:252.251,dL:149472.6746,e:0.2056,omega:77.5},Guru:{L0:34.351,dL:3034.9057,e:0.0489,omega:14.3},Shukra:{L0:181.979,dL:58517.8156,e:0.0068,omega:131.6},Shani:{L0:50.077,dL:1222.1138,e:0.0565,omega:92.4}}[planet]
  if(!p) return 0
  const L=p.L0+p.dL*T,Mrad=(L-p.omega)*Math.PI/180
  return ((L+(360/Math.PI)*p.e*Math.sin(Mrad))%360+360)%360
}

function ayanamsha(jd){return 23.85064+1.396971*(jd-2451545)/36525*100}
function toSid(lon,jd){return ((lon-ayanamsha(jd))%360+360)%360}

function calcAsc(jd,lat,lon) {
  const T=(jd-2451545)/36525
  const eps=(23.439291-0.013004*T)*Math.PI/180
  const GMST=(280.46061837+360.98564736629*(jd-2451545))%360
  const LST=((GMST+lon)%360+360)%360
  const RAMC=LST*Math.PI/180,latR=lat*Math.PI/180
  const ascTan=Math.cos(RAMC)/(-Math.sin(RAMC)*Math.cos(eps)-Math.tan(latR)*Math.sin(eps))
  let asc=Math.atan(ascTan)*180/Math.PI
  if(Math.cos(RAMC)<0) asc+=180
  return toSid(((asc%360)+360)%360,jd)
}

function signFrom(lon){
  const l=((lon%360)+360)%360,idx=Math.floor(l/30)%12
  return {index:idx,name:SIGNS[idx],lord:SIGN_LORDS[idx],degree:l%30,element:ELEMENTS[idx],nature:NATURES[idx],symbol:SIGN_SYMBOLS[SIGNS[idx]]}
}

function nakFrom(lon){
  const l=((lon%360)+360)%360,idx=Math.floor(l/(360/27))%27
  return {...NAKSHATRAS[idx],index:idx,pada:Math.floor((l%(360/27))/(360/108))+1}
}

function dignity(planet,si){
  const OWN={Surya:[4],Chandra:[3],Mangal:[0,7],Budha:[2,5],Guru:[8,11],Shukra:[1,6],Shani:[9,10]}
  const EXALT={Surya:0,Chandra:1,Mangal:9,Budha:5,Guru:3,Shukra:11,Shani:6,Rahu:1,Ketu:7}
  const DEBIL={Surya:6,Chandra:7,Mangal:3,Budha:11,Guru:9,Shukra:5,Shani:0}
  if(EXALT[planet]===si) return 'Exalted'
  if(DEBIL[planet]===si) return 'Debilitated'
  if(OWN[planet]?.includes(si)) return 'Own sign'
  return 'Neutral'
}

function calcStrength(planet,si,house){
  let s=50
  if(dignity(planet,si)==='Exalted') s+=40
  else if(dignity(planet,si)==='Own sign') s+=30
  else if(dignity(planet,si)==='Debilitated') s-=30
  if([1,4,5,7,9,10].includes(house)) s+=15
  if([6,8,12].includes(house)) s-=15
  return Math.max(0,Math.min(100,s))
}

function detectYogas(planets,houses){
  const yogas=[],doshas=[]
  const p=n=>planets.find(x=>x.name===n)
  const KENDRAS=[1,4,7,10],TRIKONAS=[1,5,9]
  const moon=p('Chandra'),sun=p('Surya'),jup=p('Guru'),mar=p('Mangal'),ven=p('Shukra'),mer=p('Budha'),rahu=p('Rahu'),ketu=p('Ketu')
  if(moon&&jup){const d=Math.abs(moon.house-jup.house),r=d===0?1:(d>6?12-d+1:d+1);if(KENDRAS.includes(r))yogas.push({name:'Gajakesari Yoga',strength:'Strong',desc:'Moon and Jupiter in mutual kendras — wisdom, prosperity and lasting fame.'})}
  if(sun&&mer&&sun.house===mer.house)yogas.push({name:'Budhaditya Yoga',strength:'Moderate',desc:'Sun and Mercury conjunct — sharp intellect and success in knowledge fields.'})
  if(jup&&KENDRAS.includes(jup.house)&&['Own sign','Exalted'].includes(jup.dignity))yogas.push({name:'Hamsa Yoga',strength:'Strong',desc:'Jupiter in kendra in own/exalted sign — righteousness and spiritual elevation.'})
  if(ven&&KENDRAS.includes(ven.house)&&['Own sign','Exalted'].includes(ven.dignity))yogas.push({name:'Malavya Yoga',strength:'Strong',desc:'Venus in kendra in own/exalted sign — beauty, luxury and marital happiness.'})
  if(mar&&KENDRAS.includes(mar.house)&&['Own sign','Exalted'].includes(mar.dignity))yogas.push({name:'Ruchaka Yoga',strength:'Strong',desc:'Mars in kendra in own/exalted sign — courage and physical excellence.'})
  const lord9=houses.find(h=>h.house===9)?.lord,lord10=houses.find(h=>h.house===10)?.lord
  const p9=planets.find(x=>x.name===lord9),p10=planets.find(x=>x.name===lord10)
  if(p9&&p10&&p9.house===p10.house)yogas.push({name:'Raja Yoga',strength:'Strong',desc:'Lords of 9th and 10th conjunct — bestows authority, power and recognition.'})
  if(mar&&[1,2,4,7,8,12].includes(mar.house))doshas.push({name:'Mangal Dosha',severity:[7,8].includes(mar.house)?'Severe':'Mild',desc:`Mars in house ${mar.house}. Remedy: Hanuman Chalisa on Tuesdays.`})
  return {yogas,doshas}
}

function calcDasha(startIdx,birthJD,currentJD){
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
  const pratIdx=DASHA_ORDER.indexOf(currentAntar.planet)
  const pratPlanet=DASHA_ORDER[(pratIdx+1)%9]
  const rem=current.endYear-ymod
  const endDate=new Date(Date.now()+rem*365.25*86400000).toISOString().split('T')[0]
  const antarRem=currentAntar.endYear-prog
  const antarEndDate=new Date(Date.now()+antarRem*365.25*86400000).toISOString().split('T')[0]
  return {current:current.planet,subDasha:currentAntar.planet,pratyantar:pratPlanet,endDate,antarEndDate,allDashas:dashas}
}

function getCurrentTransits(jd){
  const sunS=toSid(sunLon(jd),jd),moonS=toSid(moonLon(jd),jd)
  const rahuLon=toSid(((125.04-1934.136*(jd-2451545)/36525)%360+360)%360,jd)
  const transits=[]
  const raw={Surya:sunS,Chandra:moonS,Rahu:rahuLon,Ketu:(rahuLon+180)%360}
  for(const p of ['Mangal','Budha','Guru','Shukra','Shani']) raw[p]=toSid(planetLon(p,jd),jd)
  for(const [name,lon] of Object.entries(raw)){
    const sign=signFrom(lon)
    transits.push({name,sign:sign.name,degree:sign.degree.toFixed(1),lon})
  }
  return transits
}

function detectSadeSati(satSignIdx,moonSignIdx){
  const diff=Math.abs(satSignIdx-moonSignIdx)
  const minDiff=Math.min(diff,12-diff)
  return {active:minDiff<=1,phase:minDiff===0?'Peak':'Rising/Setting'}
}

function buildSummary(name,k,dasha,yogas){
  const yogaStr=yogas?.slice(0,2).map(y=>y.name).join(' and ')||'benefic combinations'
  return `${name||'The native'} has ${k.ascendant.sign} lagna with Moon in ${k.moonSign} (${k.nakshatra} Nakshatra, Pada ${k.nakshatraPada}). Currently in ${dasha.current}–${dasha.subDasha} Dasha until ${dasha.endDate}. ${yogaStr} provide powerful elevating influences throughout this lifetime.`
}

// ---- ROUTES ----

app.post('/api/calculate', async (req, res) => {
  try {
    const {name,dob,tob,pob,gender} = req.body
    if(!dob||!tob||!pob) return res.status(400).json({error:'Missing required fields'})
    const [year,month,day]=dob.split('-').map(Number)
    const [hour,minute]=tob.split(':').map(Number)
    const {lat,lon}=getCoords(pob,req.body.lat,req.body.lon)
    const birthJD=toJD(year,month,day,hour,minute)
    const currentJD=toJD(...new Date().toISOString().slice(0,10).split('-').map(Number),12,0)
    const sunS=toSid(sunLon(birthJD),birthJD)
    const moonS=toSid(moonLon(birthJD),birthJD)
    const ascS=calcAsc(birthJD,lat,lon)
    const ascHouse=signFrom(ascS).index
    const rawP=[
      {name:'Surya',abbr:'Su',lon:sunS,retrograde:false},
      {name:'Chandra',abbr:'Mo',lon:moonS,retrograde:false},
      {name:'Mangal',abbr:'Ma',lon:toSid(planetLon('Mangal',birthJD),birthJD),retrograde:false},
      {name:'Budha',abbr:'Me',lon:toSid(planetLon('Budha',birthJD),birthJD),retrograde:false},
      {name:'Guru',abbr:'Ju',lon:toSid(planetLon('Guru',birthJD),birthJD),retrograde:false},
      {name:'Shukra',abbr:'Ve',lon:toSid(planetLon('Shukra',birthJD),birthJD),retrograde:false},
      {name:'Shani',abbr:'Sa',lon:toSid(planetLon('Shani',birthJD),birthJD),retrograde:false},
    ]
    const rahuLon=toSid(((125.04-1934.136*(birthJD-2451545)/36525)%360+360)%360,birthJD)
    rawP.push({name:'Rahu',abbr:'Ra',lon:rahuLon,retrograde:true})
    rawP.push({name:'Ketu',abbr:'Ke',lon:(rahuLon+180)%360,retrograde:true})
    const planets=rawP.map(p=>{
      const sign=signFrom(p.lon),house=((sign.index-ascHouse+12)%12)+1
      const dig=dignity(p.name,sign.index)
      return {...p,sign:sign.name,signIndex:sign.index,degree:sign.degree.toFixed(2),house,dignity:dig,strength:calcStrength(p.name,sign.index,house)}
    })
    const nak=nakFrom(moonS)
    const sunMoonDiff=((moonS-sunS)+360)%360
    const tithiNum=Math.floor(sunMoonDiff/12)+1
    const TITHIS=['Pratipada','Dwitiya','Tritiya','Chaturthi','Panchami','Shashthi','Saptami','Ashtami','Navami','Dashami','Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Purnima']
    const tithi=`${tithiNum<=15?'Shukla':'Krishna'} ${TITHIS[(tithiNum-1)%15]}`
    const YOGA_NAMES=['Vishkambha','Priti','Ayushman','Saubhagya','Shobhana','Atiganda','Sukarma','Dhriti','Shula','Ganda','Vriddhi','Dhruva','Vyaghata','Harshana','Vajra','Siddhi','Vyatipata','Variyan','Parigha','Shiva','Siddha','Sadhya','Shubha','Shukla','Brahma','Indra','Vaidhriti']
    const yoga=YOGA_NAMES[Math.floor(((sunS+moonS)%360)/(360/27))%27]
    const KARANA=['Bava','Balava','Kaulava','Taitila','Garaja','Vanija','Vishti','Shakuni','Chatushpada','Naga','Kimstughna']
    const karana=KARANA[Math.floor(sunMoonDiff/6)%11]
    const houses=Array.from({length:12},(_,i)=>({house:i+1,sign:SIGNS[(ascHouse+i)%12],lord:SIGN_LORDS[(ascHouse+i)%12],signIndex:(ascHouse+i)%12}))
    const dashaStartIdx=DASHA_ORDER.indexOf(NAKSHATRAS[nak.index].lord)
    const ascSign=signFrom(ascS)
    const dasha=calcDasha(dashaStartIdx,birthJD,currentJD)
    const {yogas,doshas}=detectYogas(planets,houses)
    const currentTransits=getCurrentTransits(currentJD)
    const satTransit=currentTransits.find(t=>t.name==='Shani')
    const moonSign=signFrom(moonS)
    const sadeSati=satTransit?detectSadeSati(signFrom(satTransit.lon).index,moonSign.index):{active:false}
    const ashtakavarga=Array.from({length:12},(_,i)=>({house:i+1,sign:SIGNS[(ascHouse+i)%12],score:Math.floor(Math.random()*4)+3}))
    const kundali={
      ascendant:{sign:ascSign.name,degree:parseFloat((ascS%30).toFixed(2)),symbol:SIGN_SYMBOLS[ascSign.name],signIndex:ascHouse},
      sunSign:signFrom(sunS).name,moonSign:moonSign.name,
      nakshatra:nak.name,nakshatraPada:nak.pada,nakshatraLord:nak.lord,
      nakshatraQuality:nak.quality,nakshatraDeity:nak.deity,
      tithi,yoga,karana,planets,houses,dashaStartIdx,julianDay:birthJD
    }
    const summary=buildSummary(name,kundali,dasha,yogas)
    res.json({...kundali,dasha,yogas,doshas,summary,name,gender,pob,currentTransits,ashtakavarga,sadeSati})
  } catch(err){
    console.error(err)
    res.status(500).json({error:'Calculation error',detail:err.message})
  }
})

app.post('/api/horoscope', (req, res) => {
  const {chartData,period}=req.body
  if(!chartData||!period) return res.status(400).json({error:'Missing data'})
  const {ascendant,moonSign,nakshatra,nakshatraPada,dasha,yogas,doshas,houses,name}=chartData
  const dl=dasha?.current||'Guru',al=dasha?.subDasha||'Shani'
  const h10=houses?.find(h=>h.house===10),h7=houses?.find(h=>h.house===7)
  const text=`# ${period.charAt(0).toUpperCase()+period.slice(1)} Horoscope — ${name||'Native'}
*${ascendant?.sign} Lagna · ${moonSign} Rashi · ${nakshatra} Nakshatra*

## 🌌 Cosmic Theme
The ${dl}–${al} Dasha period shapes ${period==='weekly'?'this week':'this period'} with themes of ${dl==='Guru'?'wisdom and expansion':dl==='Shani'?'discipline and karmic lessons':dl==='Shukra'?'love and creativity':'transformation and growth'}.

## 💼 Career & Finance
The 10th house lord ${h10?.lord} indicates professional ${period==='weekly'?'focus this week':'developments this period'}. Stay consistent and avoid shortcuts.

## 💞 Relationships
The 7th house lord ${h7?.lord} brings relationship themes to the fore. Communication and patience are key.

## 🌿 Health
Maintain steady routines. Your ${moonSign} Moon benefits from regular rest and nourishing food.

## 🪔 Spirituality
${nakshatra} Nakshatra carries deep spiritual energy. Daily meditation and mantra practice will be especially rewarding.

## 🙏 Remedies
Honour the ${dl} Mahadasha through its associated practices. Recite the Gayatri Mantra 108 times at dawn.

---
*ॐ तत् सत्*`
  res.json({horoscope:text,period})
})

app.post('/api/ai-horoscope', async (req, res) => {
  try {
    const {chartData,period}=req.body
    if(!chartData||!period) return res.status(400).json({error:'Missing data'})
    const {ascendant,moonSign,nakshatra,nakshatraPada,nakshatraLord,dasha,yogas,doshas,planets,houses,name,sadeSati}=chartData
    const dl=dasha?.current||'Guru',al=dasha?.subDasha||'Shani',pl=dasha?.pratyantar||'Budha'
    const strongPlanets=planets?.filter(p=>p.strength>=65).map(p=>`${p.name}(${p.sign},H${p.house})`).join(', ')
    const yogaList=yogas?.slice(0,2).map(y=>y.name).join(', ')||'none'
    const h10=houses?.find(h=>h.house===10),h7=houses?.find(h=>h.house===7),h6=houses?.find(h=>h.house===6)
    const PERIOD_FOCUS={weekly:'this specific week. Mention Mon/Thu/Sat as key days.',monthly:'this month. Split early/mid/late phases.',annual:'the full year 2026. Mention key quarters.'}[period]

   const prompt=`You are Jyotish Acharya, a master Vedic astrologer with 40 years of experience. Speak with authority, warmth and spiritual insight.

BIRTH CHART:
- Name: ${name || 'the native'}
- Lagna: ${ascendant?.sign} | Moon: ${moonSign} | Nakshatra: ${nakshatra} Pada ${nakshatraPada} (lord: ${nakshatraLord})
- Dasha: ${dl} → ${al} → ${pl} (ends ${dasha?.endDate})
- Strong planets: ${strongPlanets || 'none'} | Yogas: ${yogaList}
- 10H lord: ${h10?.lord} | 7H lord: ${h7?.lord} | 6H lord: ${h6?.lord}
- Sade Sati: ${sadeSati?.active ? 'YES — ' + sadeSati.phase : 'No'}

Write a complete ${period} horoscope. ${period==='weekly'?'Mention specific days (Monday, Thursday etc).':period==='monthly'?'Divide into early/mid/late month phases.':'Cover all 4 quarters of 2026.'}

## 🌌 Cosmic Theme
[4-5 sentences about their dasha and nakshatra energy this ${period}]

## 💼 Career & Finance (Artha)
[4-5 sentences using 10H lord ${h10?.lord} with specific timing advice]

## 💞 Relationships & Love (Kama)
[4-5 sentences using 7H lord ${h7?.lord}]

## 🌿 Health & Vitality (Arogya)
[4-5 sentences for ${moonSign} Moon using 6H lord ${h6?.lord}]

## 🪔 Spirituality (Dharma-Moksha)
[4-5 sentences referencing ${nakshatra} nakshatra]

## 🙏 Vedic Remedies (Upaya)
[5-6 specific remedies — mantra, gemstone, charity, fasting, favourable days for ${dl} dasha]

Use Sanskrit terms naturally. Be specific to this chart. End with a Sanskrit blessing.`

Use Sanskrit terms naturally. Be specific to this chart. End with a Sanskrit blessing.`

    const response=await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          contents:[{parts:[{text:prompt}]}],
          generationConfig:{temperature:0.7,maxOutputTokens:2000,topP:0.9}
        })
      }
    )
    const data=await response.json()
    if(data.error) throw new Error(data.error.message)
    const text=data.candidates?.[0]?.content?.parts?.[0]?.text
    if(!text) throw new Error('No response')
    res.json({horoscope:text,period,ai:true})
  } catch(err){
    console.error('AI error:',err)
    res.status(500).json({error:err.message})
  }
})

app.post('/api/chat', async (req, res) => {
  try {
    const {question,chartData,history}=req.body
    if(!question||!chartData) return res.status(400).json({error:'Missing data'})
    const {ascendant,moonSign,nakshatra,dasha,yogas,planets,houses,name}=chartData
    const dl=dasha?.current||'Guru',al=dasha?.subDasha||'Shani'
    const chartSummary=`${name}, ${ascendant?.sign} lagna, ${moonSign} Moon, ${nakshatra}, ${dl}-${al} Dasha, planets: ${planets?.map(p=>`${p.name}(${p.sign},H${p.house})`).join(' ')}`
    const historyText=history?.slice(-4).map(h=>`${h.role==='user'?'Seeker':'Jyotishi'}: ${h.content}`).join('\n')||''
    const prompt=`You are Jyotish Acharya, a warm and wise Vedic astrologer.\n\nChart: ${chartSummary}\n\n${historyText?`Previous:\n${historyText}\n`:''}\nSeeker asks: ${question}\n\nAnswer in 3-5 sentences. Be specific to their chart. Use Sanskrit naturally. Be warm and insightful.`
    const response=await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{temperature:0.7,maxOutputTokens:400,topP:0.9}})}
    )
    const data=await response.json()
    if(data.error) throw new Error(data.error.message)
    const text=data.candidates?.[0]?.content?.parts?.[0]?.text
    res.json({answer:text||'Please try again.'})
  } catch(err){
    res.status(500).json({error:err.message})
  }
})

const PORT=process.env.PORT||3001
app.listen(PORT,()=>console.log(`Jyotish API running on port ${PORT}`))