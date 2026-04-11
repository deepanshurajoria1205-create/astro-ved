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
  'surat':{lat:21.1702,lon:72.8311},'kanpur':{lat:26.4499,lon:80.3319},
  'nagpur':{lat:21.1458,lon:79.0882},'indore':{lat:22.7196,lon:75.8577},
  'bhopal':{lat:23.2599,lon:77.4126},'visakhapatnam':{lat:17.6868,lon:83.2185},
  'patna':{lat:25.5941,lon:85.1376},'vadodara':{lat:22.3072,lon:73.1812},
  'abu road':{lat:24.4817,lon:72.7817},'abu':{lat:24.4817,lon:72.7817},
  'london':{lat:51.5074,lon:-0.1278},'new york':{lat:40.7128,lon:-74.006},
  'dubai':{lat:25.2048,lon:55.2708},'singapore':{lat:1.3521,lon:103.8198},
  'sydney':{lat:-33.8688,lon:151.2093},'toronto':{lat:43.6532,lon:-79.3832},
  'paris':{lat:48.8566,lon:2.3522},'berlin':{lat:52.52,lon:13.405},
  'tokyo':{lat:35.6762,lon:139.6503},'kuala lumpur':{lat:3.1390,lon:101.6869},
  'bangkok':{lat:13.7563,lon:100.5018},'riyadh':{lat:24.7136,lon:46.6753},
}

function getCoords(pob) {
  const key = pob.toLowerCase().split(',')[0].trim()
  for (const [city,coords] of Object.entries(CITIES)) {
    if (key.includes(city)||city.includes(key)) return coords
  }
  return {lat:20.5937,lon:78.9629} // centre of India as default
}

// Improved Julian Day
function toJD(year,month,day,hour=12,minute=0,second=0) {
  if(month<=2){year-=1;month+=12}
  const A=Math.floor(year/100),B=2-A+Math.floor(A/4)
  return Math.floor(365.25*(year+4716))+Math.floor(30.6001*(month+1))+day+B-1524.5+(hour+minute/60+second/3600)/24
}

// Improved Sun longitude (Meeus, Astronomical Algorithms Ch.25)
function sunLon(jd) {
  const T=(jd-2451545)/36525
  const L0=280.46646+36000.76983*T+0.0003032*T*T
  const M=(357.52911+35999.05029*T-0.0001537*T*T)*Math.PI/180
  const C=(1.914602-0.004817*T-0.000014*T*T)*Math.sin(M)
    +(0.019993-0.000101*T)*Math.sin(2*M)+0.000289*Math.sin(3*M)
  const sunLon=L0+C
  const omega=(125.04-1934.136*T)*Math.PI/180
  const apparent=sunLon-0.00569-0.00478*Math.sin(omega)
  return ((apparent%360)+360)%360
}

// Improved Moon longitude (Meeus Ch.47)
function moonLon(jd) {
  const T=(jd-2451545)/36525
  const D=(297.85036+445267.111480*T-0.0019142*T*T)*Math.PI/180
  const M=(357.52772+35999.050340*T-0.0001603*T*T)*Math.PI/180
  const Mp=(134.96298+477198.867398*T+0.0086972*T*T)*Math.PI/180
  const F=(93.27191+483202.017538*T-0.0036825*T*T)*Math.PI/180
  const E=1-0.002516*T-0.0000074*T*T
  const lon=218.3165+481267.8813*T
    -1.274*Math.sin(Mp-2*D)
    +0.658*Math.sin(2*D)
    -0.186*E*Math.sin(M)
    -0.059*Math.sin(2*Mp-2*D)
    -0.057*E*Math.sin(Mp-2*D+M)
    +0.053*Math.sin(Mp+2*D)
    +0.046*E*Math.sin(2*D-M)
    +0.041*Math.sin(Mp-M)
    -0.035*Math.sin(D)
    -0.031*Math.sin(Mp+M)
    -0.015*Math.sin(2*F-2*D)
    +0.011*Math.sin(Mp-4*D)
  return ((lon%360)+360)%360
}

// Improved planetary longitudes
function planetLon(planet,jd) {
  const T=(jd-2451545)/36525
  const data={
    Mangal: {L0:355.433,dL:19140.29931,e0:0.09341233,de:-0.000092,omega:286.5016,domega:0.4577,i:1.8497,W:49.5574},
    Budha:  {L0:252.2509,dL:149472.6746,e0:0.20563069,de:-0.000028,omega:77.4561,domega:0.1567,i:7.0050,W:48.3313},
    Guru:   {L0:34.3515,dL:3034.9057,e0:0.04839266,de:-0.000013,omega:14.7315,domega:0.2120,i:1.3030,W:100.4542},
    Shukra: {L0:181.9798,dL:58517.8157,e0:0.00677323,de:-0.000048,omega:131.5637,domega:0.5677,i:3.3946,W:76.6799},
    Shani:  {L0:50.0774,dL:1222.1138,e0:0.05551825,de:-0.000346,omega:92.8320,domega:0.5765,i:2.4886,W:113.6634},
  }[planet]
  if(!data) return 0
  const L=data.L0+data.dL*T
  const e=data.e0+data.de*T
  const M=((L-data.omega)%360+360)%360*Math.PI/180
  // Solve Kepler's equation
  let E=M
  for(let i=0;i<10;i++) E=M+e*Math.sin(E)
  const v=2*Math.atan(Math.sqrt((1+e)/(1-e))*Math.tan(E/2))*180/Math.PI
  return ((v+data.omega)%360+360)%360
}

// Lahiri ayanamsha (improved)
function ayanamsha(jd) {
  const T=(jd-2451545)/36525
  return 23.85064+1.396971*T+0.000308*T*T
}

function toSid(lon,jd){return ((lon-ayanamsha(jd))%360+360)%360}

// Improved ascendant
function calcAsc(jd,lat,lon) {
  const T=(jd-2451545)/36525
  const eps=(23.439291111-0.013004167*T-0.000000164*T*T+0.000000504*T*T*T)*Math.PI/180
  const theta=(280.46061837+360.98564736629*(jd-2451545)+0.000387933*T*T)*Math.PI/180
  const lst=theta+lon*Math.PI/180
  const latR=lat*Math.PI/180
  const ascTan=Math.cos(lst)/(-Math.sin(lst)*Math.cos(eps)-Math.tan(latR)*Math.sin(eps))
  let asc=Math.atan(ascTan)*180/Math.PI
  if(Math.cos(lst)<0) asc+=180
  return toSid(((asc%360)+360)%360,jd)
}

function signFrom(lon) {
  const l=((lon%360)+360)%360
  const idx=Math.floor(l/30)%12
  return {index:idx,name:SIGNS[idx],lord:SIGN_LORDS[idx],degree:l%30,
    element:ELEMENTS[idx],nature:NATURES[idx],symbol:SIGN_SYMBOLS[SIGNS[idx]]}
}

function nakFrom(lon) {
  const l=((lon%360)+360)%360
  const idx=Math.floor(l/(360/27))%27
  const pada=Math.floor((l%(360/27))/(360/108))+1
  const degInNak=l%(360/27)
  return {...NAKSHATRAS[idx],index:idx,pada,degreeInNakshatra:degInNak.toFixed(2)}
}

function dignity(planet,si) {
  const OWN={Surya:[4],Chandra:[3],Mangal:[0,7],Budha:[2,5],Guru:[8,11],Shukra:[1,6],Shani:[9,10]}
  const EXALT={Surya:0,Chandra:1,Mangal:9,Budha:5,Guru:3,Shukra:11,Shani:6,Rahu:1,Ketu:7}
  const DEBIL={Surya:6,Chandra:7,Mangal:3,Budha:11,Guru:9,Shukra:5,Shani:0}
  const MOOL={Surya:[4,0,20],Chandra:[1,3,27],Mangal:[0,0,12],Budha:[5,15,20],Guru:[8,0,10],Shukra:[6,0,15],Shani:[10,0,20]}
  if(EXALT[planet]===si) return 'Exalted'
  if(DEBIL[planet]===si) return 'Debilitated'
  if(OWN[planet]?.includes(si)) return 'Own sign'
  if(MOOL[planet]?.[0]===si) return 'Moolatrikona'
  return 'Neutral'
}

// Shadbala-lite: simple strength score 0-100
function calcStrength(planet,sign,house,dignity_) {
  let score=50
  if(dignity_==='Exalted') score+=40
  else if(dignity_==='Own sign') score+=30
  else if(dignity_==='Moolatrikona') score+=25
  else if(dignity_==='Debilitated') score-=30
  const STRONG_HOUSES=[1,4,5,7,9,10]
  const WEAK_HOUSES=[6,8,12]
  if(STRONG_HOUSES.includes(house)) score+=15
  if(WEAK_HOUSES.includes(house)) score-=15
  return Math.max(0,Math.min(100,score))
}

// Detect Sade Sati (Saturn within 3 signs of Moon)
function detectSadeSati(saturnSignIdx,moonSignIdx) {
  const diff=Math.abs(saturnSignIdx-moonSignIdx)
  const minDiff=Math.min(diff,12-diff)
  if(minDiff<=1) return {active:true,phase:minDiff===0?'Peak':'Rising/Setting'}
  return {active:false,phase:null}
}

// Improved yoga detection
function detectYogas(planets,houses,ascIdx) {
  const yogas=[],doshas=[]
  const p=n=>planets.find(x=>x.name===n)
  const KENDRAS=[1,4,7,10],TRIKONAS=[1,5,9],UPACHAYA=[3,6,10,11]
  const moon=p('Chandra'),sun=p('Surya'),jup=p('Guru'),mar=p('Mangal')
  const sat=p('Shani'),ven=p('Shukra'),mer=p('Budha'),rahu=p('Rahu'),ketu=p('Ketu')

  // Gajakesari
  if(moon&&jup){
    const d=Math.abs(moon.house-jup.house),r=d===0?1:(d>6?12-d+1:d+1)
    if(KENDRAS.includes(r)) yogas.push({name:'Gajakesari Yoga',strength:'Strong',desc:'Moon and Jupiter in mutual kendras — bestows wisdom, prosperity, fame and an elephant-like majestic presence in society.'})
  }
  // Budhaditya
  if(sun&&mer&&sun.house===mer.house) yogas.push({name:'Budhaditya Yoga',strength:'Moderate',desc:'Sun and Mercury conjunct — exceptional intellect, eloquence and success in knowledge, writing, government and intellectual professions.'})
  // Hamsa (Pancha Mahapurusha)
  if(jup&&KENDRAS.includes(jup.house)&&['Own sign','Exalted','Moolatrikona'].includes(jup.dignity)) yogas.push({name:'Hamsa Yoga (Pancha Mahapurusha)',strength:'Very Strong',desc:'Jupiter in kendra in own/exalted sign — righteousness, spiritual wisdom, philosophical depth and natural leadership.'})
  // Malavya
  if(ven&&KENDRAS.includes(ven.house)&&['Own sign','Exalted','Moolatrikona'].includes(ven.dignity)) yogas.push({name:'Malavya Yoga (Pancha Mahapurusha)',strength:'Very Strong',desc:'Venus in kendra in own/exalted sign — beauty, artistic excellence, luxury, romance and refined aesthetic sensibilities.'})
  // Ruchaka
  if(mar&&KENDRAS.includes(mar.house)&&['Own sign','Exalted','Moolatrikona'].includes(mar.dignity)) yogas.push({name:'Ruchaka Yoga (Pancha Mahapurusha)',strength:'Very Strong',desc:'Mars in kendra in own/exalted sign — courage, physical excellence, commanding presence and military or athletic distinction.'})
  // Shasha
  if(sat&&KENDRAS.includes(sat.house)&&['Own sign','Exalted','Moolatrikona'].includes(sat.dignity)) yogas.push({name:'Shasha Yoga (Pancha Mahapurusha)',strength:'Very Strong',desc:'Saturn in kendra in own/exalted sign — administrative power, longevity, discipline and mastery over resources and masses.'})
  // Dhana Yoga
  const lord2=houses.find(h=>h.house===2)?.lord,lord11=houses.find(h=>h.house===11)?.lord
  const p2=planets.find(x=>x.name===lord2),p11=planets.find(x=>x.name===lord11)
  if((p2&&[...KENDRAS,...TRIKONAS].includes(p2.house))||(p11&&[...KENDRAS,...TRIKONAS].includes(p11.house)))
    yogas.push({name:'Dhana Yoga',strength:'Moderate',desc:'Lords of wealth houses (2nd and 11th) placed in kendras or trikonas — financial prosperity, accumulation of resources and material success.'})
  // Raja Yoga
  const lord9=houses.find(h=>h.house===9)?.lord,lord10=houses.find(h=>h.house===10)?.lord
  const p9=planets.find(x=>x.name===lord9),p10=planets.find(x=>x.name===lord10)
  if(p9&&p10&&p9.house===p10.house) yogas.push({name:'Raja Yoga',strength:'Strong',desc:'Lords of 9th and 10th house conjunct — bestows authority, power, high status and recognition. A classical indicator of leadership and success.'})
  // Viparita Raja Yoga
  const lords68=[houses.find(h=>h.house===6)?.lord,houses.find(h=>h.house===8)?.lord,houses.find(h=>h.house===12)?.lord]
  const p6=planets.find(x=>x.name===lords68[0]),p8=planets.find(x=>x.name===lords68[1])
  if(p6&&p8&&[6,8,12].includes(p6.house)&&[6,8,12].includes(p8.house))
    yogas.push({name:'Viparita Raja Yoga',strength:'Moderate',desc:'Lords of dusthana houses placed in dusthanas — brings unexpected rise, turning adversity into achievement and sudden reversals of fortune in your favour.'})
  // Chandra-Mangal Yoga
  if(moon&&mar&&moon.house===mar.house) yogas.push({name:'Chandra-Mangal Yoga',strength:'Moderate',desc:'Moon and Mars conjunct — strong financial instincts, courage, dynamic emotional energy and the ability to earn through bold action.'})
  // Neecha Bhanga Raja Yoga (debilitation cancelled)
  planets.filter(pl=>pl.dignity==='Debilitated').forEach(pl=>{
    const cancellor=SIGN_LORDS[pl.signIndex]
    const cancPlanet=planets.find(x=>x.name===cancellor)
    if(cancPlanet&&(KENDRAS.includes(cancPlanet.house)||cancPlanet.dignity==='Exalted'||cancPlanet.dignity==='Own sign'))
      yogas.push({name:'Neecha Bhanga Raja Yoga',strength:'Moderate',desc:`${pl.name}'s debilitation is cancelled by ${cancellor} — what appears as weakness transforms into unexpected strength and rise after initial struggles.`})
  })

  // Mangal Dosha
  if(mar&&[1,2,4,7,8,12].includes(mar.house)) {
    const severity=[7,8].includes(mar.house)?'Severe':[1,4].includes(mar.house)?'Moderate':'Mild'
    doshas.push({name:'Mangal Dosha',severity,desc:`Mars in the ${mar.house}th house creates Mangal Dosha. ${severity==='Severe'?'This strongly affects marriage timing and partnership harmony.':'This mildly influences partnerships.'} Remedy: Recite Hanuman Chalisa every Tuesday, donate red lentils (masoor dal), fast on Tuesdays.`})
  }
  // Kaal Sarpa Dosha
  if(rahu&&ketu) {
    const allBetween=planets.filter(x=>!['Rahu','Ketu'].includes(x.name)).every(x=>{
      const r=rahu.lon,k=ketu.lon,l=x.lon
      return r>k?(l>r||l<k):(l>r&&l<k)
    })
    if(allBetween) doshas.push({name:'Kaal Sarpa Dosha',severity:'Moderate',desc:'All planets fall between Rahu and Ketu. This creates intensity, delays and karmic focus in life. Remedy: Kaal Sarpa puja at Trimbakeshwar, daily recitation of Maha Mrityunjaya mantra 108 times.'})
  }
  // Shakat Yoga (Moon in 6/8/12 from Jupiter)
  if(moon&&jup){
    const d=((moon.house-jup.house+12)%12)+1
    if([6,8,12].includes(d)) yogas.push({name:'Shakat Yoga',strength:'Challenging',desc:'Moon in 6th, 8th or 12th from Jupiter — creates fluctuating fortunes, ups and downs in life. The wheel of fortune turns frequently. Remedy: Strengthen Jupiter through Thursday fasting and yellow sapphire.'})
  }
  return {yogas,doshas}
}

function calcDasha(startIdx,birthJD,currentJD) {
  const daysSinceBirth=currentJD-birthJD
  const yearsSinceBirth=daysSinceBirth/365.25
  const dashas=[]
  let cum=0
  for(let i=0;i<9;i++){
    const pl=DASHA_ORDER[(startIdx+i)%9],yrs=DASHA_YEARS[pl]
    dashas.push({planet:pl,startYear:cum,endYear:cum+yrs,years:yrs})
    cum+=yrs
  }
  const y=yearsSinceBirth%120
  const current=dashas.find(d=>y>=d.startYear&&y<d.endYear)||dashas[0]
  const prog=y-current.startYear
  const antardashas=[]
  let ac=0
  for(let i=0;i<9;i++){
    const ap=DASHA_ORDER[(DASHA_ORDER.indexOf(current.planet)+i)%9]
    const ay=(DASHA_YEARS[ap]*current.years)/120
    antardashas.push({planet:ap,startYear:ac,endYear:ac+ay,years:ay})
    ac+=ay
  }
  const currentAntar=antardashas.find(a=>prog>=a.startYear&&prog<a.endYear)||antardashas[0]
  const remainingDasha=current.endYear-y
  const remainingAntar=currentAntar.endYear-prog
  const dashaEndDate=new Date(Date.now()+remainingDasha*365.25*86400000).toISOString().split('T')[0]
  const antarEndDate=new Date(Date.now()+remainingAntar*365.25*86400000).toISOString().split('T')[0]
  // Pratyantardasha
  const pratIdx=DASHA_ORDER.indexOf(currentAntar.planet)
  const pratPlanet=DASHA_ORDER[(pratIdx+Math.floor(prog*9/currentAntar.years))%9]
  return {
    current:current.planet,subDasha:currentAntar.planet,pratyantar:pratPlanet,
    endDate:dashaEndDate,antarEndDate,allDashas:dashas,
    yearsSinceBirth:y,progressInDasha:prog
  }
}

// Current transits
function getCurrentTransits(currentJD) {
  const planets=['Surya','Chandra','Mangal','Budha','Guru','Shukra','Shani']
  const transits=[]
  const sunT=toSid(sunLon(currentJD),currentJD)
  const moonT=toSid(moonLon(currentJD),currentJD)
  const rawLons={Surya:sunT,Chandra:moonT}
  for(const p of ['Mangal','Budha','Guru','Shukra','Shani']) rawLons[p]=toSid(planetLon(p,currentJD),currentJD)
  const rahuT=toSid(((125.04-1934.136*(currentJD-2451545)/36525)%360+360)%360,currentJD)
  rawLons['Rahu']=rahuT
  rawLons['Ketu']=(rahuT+180)%360
  for(const [name,lon] of Object.entries(rawLons)) {
    const sign=signFrom(lon)
    transits.push({name,sign:sign.name,degree:sign.degree.toFixed(1),lon})
  }
  return transits
}

// Ashtakavarga simplified (Sarva Ashtakavarga score per house)
function calcAshtakavarga(planets,ascIdx) {
  const scores=Array(12).fill(0)
  const BENEFIC_HOUSES_FROM={
    Surya:[1,2,4,7,8,9,10,11],Chandra:[3,6,10,11],Mangal:[1,2,4,7,8,9,10,11],
    Budha:[1,2,3,4,5,6,9,10,11],Guru:[1,2,3,4,7,8,9,10,11],
    Shukra:[1,2,3,4,5,8,9,11],Shani:[3,5,6,11]
  }
  planets.filter(p=>!['Rahu','Ketu'].includes(p.name)).forEach(pl=>{
    const houses=BENEFIC_HOUSES_FROM[pl.name]||[]
    if(!houses) return
    houses.forEach(h=>{
      const houseIdx=((pl.signIndex+h-1)%12)
      scores[houseIdx]+=1
    })
  })
  return scores.map((score,i)=>({house:i+1,sign:SIGNS[(ascIdx+i)%12],score,strength:score>=5?'Strong':score>=4?'Moderate':'Weak'}))
}

function buildSummary(name,k,dasha,yogas) {
  const LAGNA_DESC={
    Mesha:'dynamic leadership, pioneering spirit and a fiercely independent, courageous nature',
    Vrishabha:'steadfast determination, material sensibility, love of beauty and earthy practicality',
    Mithuna:'intellectual versatility, communicative brilliance, adaptable curiosity and wit',
    Karka:'deep emotional intelligence, strong intuition, nurturing instincts and empathic sensitivity',
    Simha:'natural authority, creative self-expression, generosity and a regal, magnanimous spirit',
    Kanya:'analytical precision, service orientation, discriminating intellect and methodical excellence',
    Tula:'diplomatic grace, aesthetic refinement, love of harmony and a strong sense of justice',
    Vrischika:'penetrating insight, transformative intensity, psychological depth and magnetic power',
    Dhanu:'philosophical wisdom, optimistic vision, love of truth, freedom and higher learning',
    Makara:'disciplined ambition, practical wisdom, patient persistence and capacity for lasting achievement',
    Kumbha:'humanitarian vision, original thinking, progressive idealism and a uniquely independent nature',
    Meena:'compassionate sensitivity, spiritual depth, rich imagination and mystical perception',
  }
  const strongYogas=yogas?.filter(y=>['Very Strong','Strong'].includes(y.strength)).slice(0,3)
  const yogaStr=strongYogas?.length?strongYogas.map(y=>y.name).join(', '):'benefic planetary combinations'
  return `${name||'The native'} is born with ${k.ascendant.sign} lagna (${k.ascendant.symbol}), conferring ${LAGNA_DESC[k.ascendant.sign]||'a uniquely powerful nature'}. The Moon in ${k.moonSign} and ${k.nakshatra} Nakshatra (Pada ${k.nakshatraPada}) — ruled by ${k.nakshatraLord} — shapes emotional intelligence, instinctive nature and the soul's deepest orientation. Currently in ${dasha.current} Mahadasha–${dasha.subDasha} Antardasha–${dasha.pratyantar} Pratyantardasha, activating complex karmic threads in this lifetime. ${yogaStr} strengthen the chart and confer lasting blessings.`
}

export default async function handler(req,res) {
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
      const strength=calcStrength(p.name,sign.index,house,dig)
      return {...p,sign:sign.name,signIndex:sign.index,degree:sign.degree.toFixed(2),house,dignity:dig,strength}
    })
    const nak=nakFrom(moonS)
    const sunMoonDiff=((moonS-sunS)+360)%360
    const tithiNum=Math.floor(sunMoonDiff/12)+1
    const TITHIS=['Pratipada','Dwitiya','Tritiya','Chaturthi','Panchami','Shashthi','Saptami','Ashtami','Navami','Dashami','Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Purnima']
    const tithi=`${tithiNum<=15?'Shukla':'Krishna'} ${TITHIS[(tithiNum-1)%15]}`
    const KARANA_NAMES=['Bava','Balava','Kaulava','Taitila','Garaja','Vanija','Vishti','Shakuni','Chatushpada','Naga','Kimstughna']
    const karana=KARANA_NAMES[Math.floor(sunMoonDiff/6)%11]
    const YOGA_NAMES=['Vishkambha','Priti','Ayushman','Saubhagya','Shobhana','Atiganda','Sukarma','Dhriti','Shula','Ganda','Vriddhi','Dhruva','Vyaghata','Harshana','Vajra','Siddhi','Vyatipata','Variyan','Parigha','Shiva','Siddha','Sadhya','Shubha','Shukla','Brahma','Indra','Vaidhriti']
    const yoga=YOGA_NAMES[Math.floor(((sunS+moonS)%360)/(360/27))%27]
    const houses=Array.from({length:12},(_,i)=>({house:i+1,sign:SIGNS[(ascHouse+i)%12],lord:SIGN_LORDS[(ascHouse+i)%12],signIndex:(ascHouse+i)%12}))
    const dashaStartIdx=DASHA_ORDER.indexOf(NAKSHATRAS[nak.index].lord)
    const ascSign=signFrom(ascS)
    const dasha=calcDasha(dashaStartIdx,birthJD,currentJD)
    const {yogas,doshas}=detectYogas(planets,houses,ascHouse)
    const currentTransits=getCurrentTransits(currentJD)
    const ashtakavarga=calcAshtakavarga(planets,ascHouse)
    const saturnTransit=currentTransits.find(t=>t.name==='Shani')
    const moonSign=signFrom(moonS)
    const sadeSati=saturnTransit?detectSadeSati(signFrom(saturnTransit.lon).index,moonSign.index):{active:false}
    const kundali={
      ascendant:{sign:ascSign.name,degree:parseFloat((ascS%30).toFixed(2)),symbol:SIGN_SYMBOLS[ascSign.name],signIndex:ascHouse},
      sunSign:signFrom(sunS).name,moonSign:moonSign.name,
      nakshatra:nak.name,nakshatraPada:nak.pada,nakshatraLord:nak.lord,
      nakshatraQuality:nak.quality,nakshatraDeity:nak.deity,
      tithi,yoga,karana,planets,houses,dashaStartIdx,julianDay:birthJD
    }
    const summary=buildSummary(name,kundali,dasha,yogas)
    res.json({
      ...kundali,dasha,yogas,doshas,summary,name,gender,pob,
      currentTransits,ashtakavarga,sadeSati,
      panchanga:{tithi,yoga,karana,nakshatra:nak.name,vara:['Ravivar','Somvar','Mangalvar','Budhvar','Guruvar','Shukravar','Shanivar'][new Date().getDay()]}
    })
  } catch(err){
    console.error(err)
    res.status(500).json({error:'Calculation error',detail:err.message})
  }
}