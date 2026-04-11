// Self-contained Vercel serverless function

const SIGNS = ['Mesha','Vrishabha','Mithuna','Karka','Simha','Kanya','Tula','Vrischika','Dhanu','Makara','Kumbha','Meena']
const SIGN_LORDS = ['Mangal','Shukra','Budha','Chandra','Surya','Budha','Shukra','Mangal','Guru','Shani','Shani','Guru']
const ELEMENTS = ['Fire','Earth','Air','Water','Fire','Earth','Air','Water','Fire','Earth','Air','Water']
const NATURES = ['Movable','Fixed','Dual','Movable','Fixed','Dual','Movable','Fixed','Dual','Movable','Fixed','Dual']
const NAKSHATRAS = [
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
const DASHA_YEARS = {Ketu:7,Shukra:20,Surya:6,Chandra:10,Mangal:7,Rahu:18,Guru:16,Shani:19,Budha:17}
const DASHA_ORDER = ['Ketu','Shukra','Surya','Chandra','Mangal','Rahu','Guru','Shani','Budha']
const CITIES = {
  'hyderabad':{lat:17.385,lon:78.4867},'mumbai':{lat:19.076,lon:72.8777},
  'delhi':{lat:28.6139,lon:77.209},'bangalore':{lat:12.9716,lon:77.5946},
  'chennai':{lat:13.0827,lon:80.2707},'kolkata':{lat:22.5726,lon:88.3639},
  'pune':{lat:18.5204,lon:73.8567},'ahmedabad':{lat:23.0225,lon:72.5714},
  'london':{lat:51.5074,lon:-0.1278},'new york':{lat:40.7128,lon:-74.006},
  'dubai':{lat:25.2048,lon:55.2708},'singapore':{lat:1.3521,lon:103.8198},
  'sydney':{lat:-33.8688,lon:151.2093},'toronto':{lat:43.6532,lon:-79.3832},
  'paris':{lat:48.8566,lon:2.3522},'berlin':{lat:52.52,lon:13.405},
  'tokyo':{lat:35.6762,lon:139.6503},'mumbai':{lat:19.076,lon:72.8777},
}

function getCoords(pob) {
  const key = pob.toLowerCase().split(',')[0].trim()
  for (const [city,coords] of Object.entries(CITIES)) {
    if (key.includes(city)||city.includes(key)) return coords
  }
  return {lat:17.385,lon:78.4867}
}

function toJulianDay(year,month,day,hour=12,minute=0) {
  if(month<=2){year-=1;month+=12}
  const A=Math.floor(year/100),B=2-A+Math.floor(A/4)
  return Math.floor(365.25*(year+4716))+Math.floor(30.6001*(month+1))+day+B-1524.5+(hour+minute/60)/24
}

function sunLon(jd) {
  const T=(jd-2451545)/36525
  const L0=280.46646+36000.76983*T
  const M=(357.52911+35999.05029*T)*Math.PI/180
  const C=(1.914602-0.004817*T)*Math.sin(M)+0.019993*Math.sin(2*M)
  return ((L0+C)%360+360)%360
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

function ayanamsha(jd){return 23.85+0.0137*(jd-2451545)/36525*100}
function toSid(lon,jd){return ((lon-ayanamsha(jd))%360+360)%360}

function calcAsc(jd,lat,lon) {
  const T=(jd-2451545)/36525
  const obl=(23.439291-0.013004*T)*Math.PI/180
  const GMST=(280.46061837+360.98564736629*(jd-2451545))%360
  const LST=((GMST+lon)%360+360)%360
  const RAMC=LST*Math.PI/180,latR=lat*Math.PI/180
  const ascTan=Math.cos(RAMC)/(-Math.sin(RAMC)*Math.cos(obl)-Math.tan(latR)*Math.sin(obl))
  let asc=Math.atan(ascTan)*180/Math.PI
  if(Math.cos(RAMC)<0) asc+=180
  return toSid(((asc%360)+360)%360,jd)
}

function signFrom(lon){
  const idx=Math.floor(((lon%360)+360)%360/30)%12
  return {index:idx,name:SIGNS[idx],lord:SIGN_LORDS[idx],degree:((lon%360)+360)%360%30,element:ELEMENTS[idx],nature:NATURES[idx]}
}

function nakFrom(lon){
  const s=((lon%360)+360)%360
  const idx=Math.floor(s/(360/27))%27
  return {...NAKSHATRAS[idx],index:idx,pada:Math.floor((s%(360/27))/(360/108))+1}
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

function getSymbol(s){return {'Mesha':'♈','Vrishabha':'♉','Mithuna':'♊','Karka':'♋','Simha':'♌','Kanya':'♍','Tula':'♎','Vrischika':'♏','Dhanu':'♐','Makara':'♑','Kumbha':'♒','Meena':'♓'}[s]||'?'}

function calcDasha(startIdx,jd) {
  const dashas=[],y=0
  let cum=0
  for(let i=0;i<9;i++){
    const pl=DASHA_ORDER[(startIdx+i)%9],yrs=DASHA_YEARS[pl]
    dashas.push({planet:pl,startYear:cum,endYear:cum+yrs,years:yrs})
    cum+=yrs
  }
  const current=dashas[0]
  const antardashas=[],ac_=0
  let ac=0
  for(let i=0;i<9;i++){
    const ap=DASHA_ORDER[(DASHA_ORDER.indexOf(current.planet)+i)%9]
    const ay=(DASHA_YEARS[ap]*current.years)/120
    antardashas.push({planet:ap,startYear:ac,endYear:ac+ay})
    ac+=ay
  }
  const endDate=new Date(Date.now()+current.years*365.25*86400000).toISOString().split('T')[0]
  return {current:current.planet,subDasha:antardashas[0].planet,endDate,allDashas:dashas}
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
  if(mar&&[1,2,4,7,8,12].includes(mar.house))doshas.push({name:'Mangal Dosha',severity:[7,8].includes(mar.house)?'Severe':'Mild',desc:`Mars in house ${mar.house}. Remedy: Hanuman Chalisa on Tuesdays, donate red lentils.`})
  return {yogas,doshas}
}

function buildSummary(name,k,dasha,yogas){
  const LAGNA_DESC={Mesha:'dynamic leadership and pioneering spirit',Vrishabha:'steadfast determination and material sensibility',Mithuna:'intellectual versatility and communicative brilliance',Karka:'deep emotional intelligence and nurturing instincts',Simha:'natural authority and creative self-expression',Kanya:'analytical precision and service orientation',Tula:'diplomatic grace and aesthetic refinement',Vrischika:'penetrating insight and transformative power',Dhanu:'philosophical wisdom and love of freedom',Makara:'disciplined ambition and practical wisdom',Kumbha:'humanitarian vision and original thinking',Meena:'compassionate sensitivity and spiritual depth'}
  const yogaStr=yogas?.slice(0,2).map(y=>y.name).join(' and ')||'benefic planetary combinations'
  return `${name||'The native'} is born with ${k.ascendant.sign} lagna, conferring ${LAGNA_DESC[k.ascendant.sign]||'a unique nature'}. The Moon in ${k.moonSign} (${k.nakshatra} Nakshatra, Pada ${k.nakshatraPada}) shapes emotional instincts. Currently running ${dasha.current}–${dasha.subDasha} Dasha until ${dasha.endDate}. ${yogaStr} provide powerful elevating influences throughout this lifetime.`
}

export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*')
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers','Content-Type')
  if(req.method==='OPTIONS') return res.status(200).end()
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'})
  try {
    const {name,dob,tob,pob,gender}=req.body
    if(!dob||!tob||!pob) return res.status(400).json({error:'Missing required fields'})
    const [year,month,day]=dob.split('-').map(Number)
    const [hour,minute]=tob.split(':').map(Number)
    const {lat,lon}=getCoords(pob)
    const jd=toJulianDay(year,month,day,hour,minute)
    const sunS=toSid(sunLon(jd),jd),moonS=toSid(moonLon(jd),jd),ascS=calcAsc(jd,lat,lon)
    const ascHouse=signFrom(ascS).index
    const rawP=[
      {name:'Surya',abbr:'Su',lon:sunS,retrograde:false},
      {name:'Chandra',abbr:'Mo',lon:moonS,retrograde:false},
      {name:'Mangal',abbr:'Ma',lon:toSid(planetLon('Mangal',jd),jd),retrograde:false},
      {name:'Budha',abbr:'Me',lon:toSid(planetLon('Budha',jd),jd),retrograde:false},
      {name:'Guru',abbr:'Ju',lon:toSid(planetLon('Guru',jd),jd),retrograde:false},
      {name:'Shukra',abbr:'Ve',lon:toSid(planetLon('Shukra',jd),jd),retrograde:false},
      {name:'Shani',abbr:'Sa',lon:toSid(planetLon('Shani',jd),jd),retrograde:false},
    ]
    const rahuLon=toSid(((125.04-1934.136*(jd-2451545)/36525)%360+360)%360,jd)
    rawP.push({name:'Rahu',abbr:'Ra',lon:rahuLon,retrograde:true})
    rawP.push({name:'Ketu',abbr:'Ke',lon:(rahuLon+180)%360,retrograde:true})
    const planets=rawP.map(p=>{const sign=signFrom(p.lon),house=((sign.index-ascHouse+12)%12)+1;return{...p,sign:sign.name,signIndex:sign.index,degree:sign.degree,house,dignity:dignity(p.name,sign.index)}})
    const nak=nakFrom(moonS)
    const sunMoonDiff=((moonS-sunS)+360)%360
    const tithiNum=Math.floor(sunMoonDiff/12)+1
    const TITHIS=['Pratipada','Dwitiya','Tritiya','Chaturthi','Panchami','Shashthi','Saptami','Ashtami','Navami','Dashami','Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Purnima']
    const tithi=`${tithiNum<=15?'Shukla':'Krishna'} ${TITHIS[(tithiNum-1)%15]}`
    const YOGA_NAMES=['Vishkambha','Priti','Ayushman','Saubhagya','Shobhana','Atiganda','Sukarma','Dhriti','Shula','Ganda','Vriddhi','Dhruva','Vyaghata','Harshana','Vajra','Siddhi','Vyatipata','Variyan','Parigha','Shiva','Siddha','Sadhya','Shubha','Shukla','Brahma','Indra','Vaidhriti']
    const yoga=YOGA_NAMES[Math.floor(((sunS+moonS)%360)/(360/27))%27]
    const houses=Array.from({length:12},(_,i)=>({house:i+1,sign:SIGNS[(ascHouse+i)%12],lord:SIGN_LORDS[(ascHouse+i)%12],signIndex:(ascHouse+i)%12}))
    const dashaStartIdx=DASHA_ORDER.indexOf(NAKSHATRAS[nak.index].lord)
    const ascSign=signFrom(ascS)
    const dasha=calcDasha(dashaStartIdx,jd)
    const {yogas,doshas}=detectYogas(planets,houses)
    const kundali={ascendant:{sign:ascSign.name,degree:ascS%30,symbol:getSymbol(ascSign.name),signIndex:ascHouse},sunSign:signFrom(sunS).name,moonSign:signFrom(moonS).name,nakshatra:nak.name,nakshatraPada:nak.pada,nakshatraLord:nak.lord,tithi,yoga,planets,houses,dashaStartIdx,julianDay:jd}
    const summary=buildSummary(name,kundali,dasha,yogas)
    res.json({...kundali,dasha,yogas,doshas,summary,name,gender,pob})
  } catch(err){
    console.error(err)
    res.status(500).json({error:'Calculation error',detail:err.message})
  }
}