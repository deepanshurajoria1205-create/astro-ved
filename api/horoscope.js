const REMEDIES={
  Surya:{mantra:'Om Hraam Hreem Hraum Sah Suryaya Namah (108x at sunrise)',gem:'Ruby (Manikya) in gold on ring finger, Sunday',charity:'Donate wheat, jaggery, copper on Sundays',fast:'Sunday fast, eat once after sunset',colour:'Red and orange'},
  Chandra:{mantra:'Om Shraam Shreem Shraum Sah Chandraya Namah (108x on Monday)',gem:'Pearl (Moti) or Moonstone in silver on ring finger, Monday',charity:'Donate white rice, milk, silver on Mondays',fast:'Monday fast, offer milk to Shiva',colour:'White and silver'},
  Mangal:{mantra:'Om Kraam Kreem Kraum Sah Bhaumaya Namah (108x on Tuesday)',gem:'Red Coral (Moonga) in gold or copper on ring finger, Tuesday',charity:'Donate red lentils, copper, blood donation on Tuesdays',fast:'Tuesday fast, visit Hanuman temple',colour:'Red'},
  Budha:{mantra:'Om Braam Breem Braum Sah Budhaya Namah (108x on Wednesday)',gem:'Emerald (Panna) in gold on little finger, Wednesday',charity:'Donate green mung dal, green cloth on Wednesdays',fast:'Wednesday fast',colour:'Green'},
  Guru:{mantra:'Om Graam Greem Graum Sah Gurave Namah (108x on Thursday)',gem:'Yellow Sapphire (Pukhraj) in gold on index finger, Thursday',charity:'Donate yellow sweets, turmeric, books to Brahmins on Thursdays',fast:'Thursday fast, eat yellow food',colour:'Yellow'},
  Shukra:{mantra:'Om Draam Dreem Draum Sah Shukraya Namah (108x on Friday)',gem:'Diamond or White Sapphire in silver on middle finger, Friday',charity:'Donate white sweets, rice, white cloth on Fridays',fast:'Friday fast, worship Lakshmi',colour:'White and pink'},
  Shani:{mantra:'Om Praam Preem Praum Sah Shanaischaraya Namah (108x on Saturday)',gem:'Blue Sapphire (Neelam) in silver on middle finger — only after trial period',charity:'Donate black sesame, mustard oil, iron on Saturdays',fast:'Saturday fast, light sesame oil lamp',colour:'Black and dark blue'},
  Rahu:{mantra:'Om Bhram Bhreem Bhraum Sah Rahave Namah (108x)',gem:'Hessonite Garnet (Gomed) in silver',charity:'Donate to lepers, donate blue cloth, feed dogs',fast:'Saturday fast for Rahu',colour:'Smoky grey'},
  Ketu:{mantra:"Om Sraam Sreem Sraum Sah Ketave Namah (108x)",gem:"Cat's Eye (Lehsunia) in silver",charity:'Donate blankets, multi-coloured cloth',fast:'Tuesday fast for Ketu',colour:'Smoke and multi-colour'}
}

const DASHA_THEMES={
  Surya:{positive:'soul purpose, authority, government, father, vitality and recognition',negative:'ego conflicts, health of eyes and heart, disputes with authority',advice:'Step into leadership roles. Seek recognition but guard against pride.'},
  Chandra:{positive:'emotional depth, mind, mother, public popularity, intuition and nurturing',negative:'mental fluctuations, water-related issues, emotional instability',advice:'Honour your emotional needs. Connect with water, nature and feminine energy.'},
  Mangal:{positive:'energy, courage, property, siblings, ambition and physical vitality',negative:'aggression, accidents, inflammation, disputes with brothers',advice:'Channel your energy into disciplined physical activity and decisive action.'},
  Budha:{positive:'intellect, communication, business, education, travel and analytical skills',negative:'nervousness, skin issues, miscommunication, scattered energy',advice:'Study, write, communicate and engage in intellectual pursuits actively.'},
  Guru:{positive:'wisdom, spirituality, children, fortune, higher learning and expansion',negative:'overindulgence, false optimism, liver issues, weight gain',advice:'Seek a guru. Study scripture. Be generous. Expand your philosophical horizons.'},
  Shukra:{positive:'relationships, creative expression, luxury, vehicles, beauty and material comforts',negative:'over-indulgence, relationship issues, reproductive health',advice:'Cultivate beauty, art and loving relationships. Balance pleasure with spiritual practice.'},
  Shani:{positive:'discipline, karma, longevity, real estate, service and hard-earned rewards',negative:'delays, restrictions, depression, joint issues, hard karmic lessons',advice:'Be patient and disciplined. Do karma seva. Avoid shortcuts — Saturn rewards steady effort.'},
  Rahu:{positive:'foreign connections, innovation, technology, ambition and unconventional gains',negative:'illusions, obsessions, sudden disruptions, anxiety and deception',advice:'Stay grounded. Avoid shortcuts. Foreign connections may be highly beneficial.'},
  Ketu:{positive:'spirituality, psychic ability, moksha, detachment and past-life wisdom',negative:'isolation, confusion, loss, separation and karmic debts surfacing',advice:'Embrace meditation and spiritual practice. Let go of what no longer serves your soul.'}
}

const TRANSIT_EFFECTS={
  Guru:{positive:'expansion, wisdom, new opportunities and divine grace',duration:'~12 months per sign'},
  Shani:{positive:'discipline, karmic lessons and structural changes',duration:'~2.5 years per sign'},
  Mangal:{positive:'energy, action and courage',duration:'~6 weeks per sign'},
  Rahu:{positive:'ambition, innovation and worldly desires',duration:'~18 months per sign'},
}

function getFavourableDays(dashaLord,moonSign) {
  const DAYS={Surya:'Sunday',Chandra:'Monday',Mangal:'Tuesday',Budha:'Wednesday',Guru:'Thursday',Shukra:'Friday',Shani:'Saturday',Rahu:'Saturday',Ketu:'Tuesday'}
  const moonDays={Mesha:'Tuesday',Vrishabha:'Friday',Mithuna:'Wednesday',Karka:'Monday',Simha:'Sunday',Kanya:'Wednesday',Tula:'Friday',Vrischika:'Tuesday',Dhanu:'Thursday',Makara:'Saturday',Kumbha:'Saturday',Meena:'Thursday'}
  return [DAYS[dashaLord],moonDays[moonSign]].filter((v,i,a)=>a.indexOf(v)===i).join(' and ')
}

function getTransitAnalysis(currentTransits,birthPlanets,ascIdx) {
  const insights=[]
  const satTransit=currentTransits?.find(t=>t.name==='Shani')
  const jupTransit=currentTransits?.find(t=>t.name==='Guru')
  const moonBirth=birthPlanets?.find(p=>p.name==='Chandra')
  if(satTransit&&moonBirth) {
    const satSign=satTransit.sign,moonBirthSign=moonBirth.sign
    if(satSign===moonBirthSign) insights.push(`🔴 Saturn is currently transiting your natal Moon sign (${moonBirthSign}) — this is the peak of Sade Sati. This 2.5 year period brings karmic intensity, delays and deep transformation. Patience and spiritual practice are essential.`)
    else insights.push(`Saturn is currently in ${satSign}, activating themes of discipline and karmic resolution in that area of your chart.`)
  }
  if(jupTransit) insights.push(`Jupiter in ${jupTransit.sign} is expanding opportunities in the corresponding house of your birth chart — look for growth, wisdom and good fortune from this direction.`)
  return insights
}

function generateHoroscope(chartData,period) {
  const {ascendant,moonSign,nakshatra,nakshatraPada,nakshatraLord,nakshatraQuality,nakshatraDeity,dasha,yogas,doshas,planets,houses,name,currentTransits,ashtakavarga,sadeSati,panchanga}=chartData
  const dl=dasha?.current||'Guru',al=dasha?.subDasha||'Shani',pl=dasha?.pratyantar||'Budha'
  const lagna=ascendant?.sign||moonSign
  const remedy=REMEDIES[dl],theme=DASHA_THEMES[dl]
  const antarTheme=DASHA_THEMES[al]
  const strongYogas=yogas?.filter(y=>['Very Strong','Strong'].includes(y.strength))
  const yogaNames=strongYogas?.length?strongYogas.map(y=>y.name).join(', '):'auspicious planetary combinations'
  const h10=houses?.find(h=>h.house===10),h7=houses?.find(h=>h.house===7),h6=houses?.find(h=>h.house===6),h2=houses?.find(h=>h.house===2)
  const favDays=getFavourableDays(dl,moonSign)
  const transitInsights=getTransitAnalysis(currentTransits,planets,ascendant?.signIndex)
  const periodLabel=period==='weekly'?'this week':period==='monthly'?'this month':'this year (2026)'
  const periodFocus=period==='weekly'?'day-to-day energies and immediate decisions':period==='monthly'?'evolving trends and month-long opportunities':'major life themes, annual patterns and long-range planning'

  const sections=[]

  sections.push(`# ${period.charAt(0).toUpperCase()+period.slice(1)} Horoscope — ${name||'Native'}

**Lagna:** ${lagna} | **Rashi:** ${moonSign} | **Nakshatra:** ${nakshatra} Pada ${nakshatraPada}
**Dasha:** ${dl} → ${al} → ${pl} | **Dasha ends:** ${dasha?.endDate||'N/A'}
${sadeSati?.active?`\n⚠️ **Sade Sati Active (${sadeSati.phase} Phase)** — A period of deep karmic transformation and inner growth.\n`:''}
---`)

  sections.push(`## 🌌 Cosmic Theme for ${periodLabel.charAt(0).toUpperCase()+periodLabel.slice(1)}

The celestial currents governing your ${periodFocus} flow primarily through the ${dl} Mahadasha — a period activating **${theme?.positive}**. ${al} Antardasha colours this with ${antarTheme?.positive}, while ${pl} Pratyantardasha adds its specific texture to immediate events.

${yogaNames} in your nativity continue to act as powerful protective and elevating forces. Your ${nakshatra} Nakshatra — ruled by ${nakshatraLord}, presided over by ${nakshatraDeity||'the cosmic deity'} — carries the quality of **${nakshatraQuality||'wisdom and inner strength'}**, giving you natural gifts to draw upon ${periodLabel}.

${theme?.advice||''}`)

  // Transit section
  if(transitInsights?.length) {
    sections.push(`## 🪐 Current Planetary Transits

${transitInsights.join('\n\n')}

${currentTransits?.slice(0,5).map(t=>`- **${t.name}** is in ${t.sign} (${t.degree}°)`).join('\n')||''}`)
  }

  sections.push(`## 💼 Career & Finance (Artha)

The 10th house of dharma and career is ruled by **${h10?.lord||'Shani'}** in your chart. ${dl==='Shani'||al==='Shani'?'Saturn\'s influence demands methodical, patient effort this period — avoid shortcuts and focus on building solid long-term structures. The rewards will come, but slowly and durably.':dl==='Guru'||al==='Guru'?'Jupiter\'s benevolent rays open doors to growth, higher knowledge, mentorship and recognition. This is an auspicious period for expansion and new ventures.':dl==='Surya'||al==='Surya'?'Sun dasha activates career ambitions strongly — government connections, authority and recognition are highlighted.':'The current dasha activates ambition, professional transformation and karmic career themes.'}

${period==='annual'?'This year marks a significant karmic juncture in your professional trajectory — the seeds planted now will determine your career direction for years ahead. Focus on building skills, reputation and meaningful relationships in your field.':period==='monthly'?'Professional momentum builds through the month. Watch for an important opportunity or decision around the middle of the month — act decisively but after careful reflection.':'Early in the week favours planning and communication; action and decisions are best taken on '+favDays+'.'}

The 2nd house of wealth (${h2?.lord||'lord'}) and 11th house of gains indicate ${['Guru','Shukra','Chandra'].includes(dl)?'a period of financial expansion and material blessing':'the importance of disciplined financial management and avoiding speculative investments this period'}. ${doshas?.find(d=>d.name==='Mangal Dosha')?'The Mars influence creates impulsiveness in financial decisions — pause before committing significant resources.':''}`)

  sections.push(`## 💞 Relationships & Love (Kama)

The 7th house of partnerships is governed by **${h7?.lord||'Shukra'}**. ${dl==='Shukra'||al==='Shukra'?'Venus Dasha brings beautiful, harmonious energy to relationships. Love deepens, new meaningful bonds form, and existing partnerships flourish with attention and affection.':dl==='Mangal'||al==='Mangal'?'Mars energy intensifies passions and desires — while attraction is magnetic, guard against aggression, impulsiveness and conflict in close relationships. Channel this fire constructively.':dl==='Shani'||al==='Shani'?'Saturn period tests relationships for depth and commitment. Superficial connections may fall away, but genuine bonds strengthen and crystallise during this time.':'Relationships call for authentic communication, patience and emotional presence this period.'}

${moonSign==='Karka'||moonSign==='Meena'||moonSign==='Vrishabha'?'Your Moon sign bestows deep emotional sensitivity — use this gift to create genuine intimacy and soulful connection rather than withdrawing when emotions feel overwhelming.':moonSign==='Mesha'||moonSign==='Simha'||moonSign==='Dhanu'?'Your fiery Moon sign brings warmth and passion to relationships — ensure you also create space to listen and receive, not only to give and lead.':'Your Moon\'s placement calls for balancing your rational nature with heartfelt emotional availability in relationships.'}

${period==='annual'?'This year holds significant potential for relationship milestones — whether deepening commitment, healing old wounds, or opening to new love. For couples, joint spiritual practice or travel together is especially beneficial.':'Quality undivided time and sincere appreciation will significantly strengthen your most cherished relationships this period.'}`)

  sections.push(`## 🌿 Health & Vitality (Arogya)

The 6th house of health is ruled by **${h6?.lord||'Budha'}**. ${dl==='Shani'?'Saturn Mahadasha can manifest as chronic fatigue, joint issues or structural body concerns — prioritise adequate sleep, warm nourishing foods, Ayurvedic oil massage (abhyanga) and avoiding excessive cold.':dl==='Mangal'?'Mars Dasha brings high physical energy but risks overexertion, inflammation, fever or accidents — avoid reckless activities and channel this energy through structured exercise.':dl==='Rahu'?'Rahu Dasha can create mysterious or difficult-to-diagnose health issues, stress and nervous system strain — grounding practices, nature walks and reducing screen time are beneficial.':'Health is generally supportive this period with consistent attention to daily routine and lifestyle.'}

Your ${moonSign} Moon suggests ${moonSign==='Karka'||moonSign==='Meena'?'the digestive system and emotional body are most sensitive — avoid cold, heavy, processed foods and nourish yourself with warm, easily digestible meals':'Vata balance is key — maintain regular meal times, sleep schedule and warm oil self-massage daily'}. 

**Recommended practices ${periodLabel}:** Daily Anulom Vilom pranayama (10 minutes at dawn), a short walk in nature, and avoiding overcommitment of your time and energy.`)

  sections.push(`## 🪔 Spirituality & Inner Growth (Dharma-Moksha)

${nakshatra} Nakshatra — presided over by ${nakshatraDeity||'divine forces'} — carries the profound quality of **${nakshatraQuality||'spiritual wisdom'}**. This is the lens through which your soul perceives reality and the energy that animates your deepest spiritual seeking.

${dl==='Ketu'||al==='Ketu'?'Ketu\'s influence is powerfully activating the moksha dimension of your life — this is one of the most spiritually charged periods you will experience. Meditation, solitude, pilgrimage, scripture study and letting go of worldly attachments will yield extraordinary inner fruits.':dl==='Guru'||al==='Guru'?'Jupiter\'s Mahadasha is among the most auspicious for genuine spiritual development. Seek a qualified guru or teacher, deepen your study of sacred texts, practice daily japa and expand your dharmic service to others.':dl==='Shani'||al==='Shani'?'Saturn\'s period strips away illusions and forces genuine inner work. This is a time of karmic maturation — embrace simplicity, serve others without expectation, and find the sacred in disciplined daily practice.':'Your sadhana practice, however modest, carries accelerated spiritual results during this dasha period.'}

${period==='annual'?'Consider making a meaningful spiritual commitment this year — a daily mantra practice for the full year, a pilgrimage to a sacred site, or dedicated weekly seva (selfless service).':'Even 20-30 minutes of morning meditation, mantra or pranayama will create a noticeable and lasting shift in inner clarity, peace and outer circumstances.'}`)

  // Ashtakavarga insight
  const strongHouses=ashtakavarga?.filter(h=>h.score>=5).slice(0,3)
  if(strongHouses?.length) {
    sections.push(`## ⭐ Ashtakavarga Strength Analysis

Your chart shows particular strength in the following areas based on Sarva Ashtakavarga:

${strongHouses.map(h=>`- **${h.sign} (House ${h.house})** — Score ${h.score}/8: ${['Self and physical vitality','Wealth and family','Communication and courage','Home and mother','Children and intelligence','Health and service','Marriage and partnerships','Transformation and longevity','Fortune and dharma','Career and reputation','Gains and aspirations','Liberation and foreign lands'][h.house-1]}`).join('\n')}

These houses are particularly activated and productive during transits — pay special attention when benefic planets move through them.`)
  }

  sections.push(`## 🙏 Vedic Remedies (Upaya) for ${period.charAt(0).toUpperCase()+period.slice(1)}

### Primary Remedy — ${dl} Mahadasha
**Mantra:** ${remedy?.mantra||'Gayatri Mantra 108x daily'}
**Gemstone:** ${remedy?.gem||'Consult a qualified Jyotishi'}
**Charity (Dana):** ${remedy?.charity||'Donate according to ruling planet'}
**Favourable colour:** ${remedy?.colour||'As per ruling planet'}

### Supporting Remedy — ${al} Antardasha
**Mantra:** ${REMEDIES[al]?.mantra||''}
**Dana:** ${REMEDIES[al]?.charity||''}

### Favourable Days ${periodLabel.charAt(0).toUpperCase()+periodLabel.slice(1)}
**${favDays}** are particularly auspicious for important decisions, new beginnings and spiritual practices.

### Universal Daily Sadhana
Recite the **Gayatri Mantra** 108 times at dawn facing east. Light a pure ghee lamp before your home altar each evening. Practice gratitude through a daily journal — even three lines before sleep transforms consciousness. Acts of selfless charity (dana) aligned with your ruling planet dissolve karmic blockages and accelerate divine grace.

${doshas?.length?`\n### Dosha Remedies\n${doshas.map(d=>`**${d.name}:** ${d.desc}`).join('\n')}`:''} 

---
*ॐ तत् सत् · सर्वे भवन्तु सुखिनः · May all beings be happy*
*This reading is generated by the Jyotish engine based on classical Vedic principles.*`)

  return sections.join('\n\n')
}

export default async function handler(req,res) {
  res.setHeader('Access-Control-Allow-Origin','*')
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers','Content-Type')
  if(req.method==='OPTIONS') return res.status(200).end()
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'})
  try {
    const {chartData,period}=req.body
    if(!chartData||!period) return res.status(400).json({error:'Missing chartData or period'})
    const horoscope=generateHoroscope(chartData,period)
    res.json({horoscope,period})
  } catch(err){
    res.status(500).json({error:err.message})
  }
}