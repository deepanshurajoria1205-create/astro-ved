const REMEDIES={Surya:'Offer water to Sun at sunrise, recite Aditya Hridayam, wear Ruby on Sundays.',Chandra:'Fast on Mondays, offer white flowers to Shiva, wear Pearl or Moonstone.',Mangal:'Recite Hanuman Chalisa on Tuesdays, donate red lentils, wear Red Coral.',Budha:'Recite Vishnu Sahasranama on Wednesdays, donate green vegetables, wear Emerald.',Guru:'Feed Brahmins on Thursdays, recite Guru Stotram, wear Yellow Sapphire.',Shukra:'Offer white sweets to Lakshmi on Fridays, recite Shri Sukta, wear Diamond.',Shani:'Light sesame oil lamp on Saturdays, recite Shani Stotra, donate black sesame.',Rahu:'Recite Durga Saptashati, donate to the needy, wear Hessonite Garnet.',Ketu:"Recite Ganesh Stotra, donate blankets, wear Cat's Eye."}
const DASHA_THEMES={Surya:'authority, government, father and vitality',Chandra:'emotions, mind, mother and public life',Mangal:'energy, property, siblings and courage',Budha:'intellect, communication, business and travel',Guru:'wisdom, children, spirituality and fortune',Shukra:'relationships, creativity, luxury and comforts',Shani:'discipline, karma, longevity and hard lessons',Rahu:'foreign lands, innovation, ambition and sudden gains',Ketu:'spirituality, detachment, past karma and moksha'}

function generateHoroscope(chartData,period){
  const {ascendant,moonSign,nakshatra,nakshatraPada,dasha,yogas,doshas,planets,houses,name}=chartData
  const dl=dasha?.current||'Guru',al=dasha?.subDasha||'Shani'
  const lagna=ascendant?.sign||moonSign
  const yogaNames=yogas?.length?yogas.slice(0,2).map(y=>y.name).join(' and '):'auspicious planetary combinations'
  const h10=houses?.find(h=>h.house===10),h7=houses?.find(h=>h.house===7),h6=houses?.find(h=>h.house===6)
  const sections=[]

  sections.push(`# ${period.charAt(0).toUpperCase()+period.slice(1)} Horoscope for ${name||'Native'}
*${lagna} Lagna · ${moonSign} Rashi · ${nakshatra} Nakshatra Pada ${nakshatraPada}*
*Running: ${dl}–${al} Dasha (ends ${dasha?.endDate||'N/A'})*\n---`)

  sections.push(`## 🌌 Cosmic Overview\nThe celestial canvas ${period==='weekly'?'this week':period==='monthly'?'this month':'this year'} is painted by your ${dl} Mahadasha and ${al} Antardasha. This period activates the themes of **${DASHA_THEMES[dl]}**, with ${al} adding its flavour of **${DASHA_THEMES[al]}** to daily life. ${yogaNames} in your chart act as a protective and elevating force. Your ${nakshatra} Nakshatra nature gives you instinctive strength to channel powerfully now.`)

  sections.push(`## 💼 Career & Finance (Artha)\nThe 10th house of karma is ruled by ${h10?.lord||'Shani'} in your chart. ${dl==='Shani'||al==='Shani'?'Saturn demands disciplined, patient effort — consistent work yields solid rewards.':dl==='Guru'||al==='Guru'?'Jupiter opens doors to growth, higher learning and recognition.':'The current dasha activates professional ambition and achievement.'} ${period==='annual'?'This year marks a karmic turning point — lay strong foundations now.':period==='monthly'?'Mid-month brings a significant professional development.':'Avoid major financial decisions early in the week; Thursday onwards is auspicious.'}`)

  sections.push(`## 💞 Relationships & Love (Kama)\nThe 7th house is governed by ${h7?.lord||'Shukra'}. ${dl==='Shukra'||al==='Shukra'?'Venus dasha brings harmonious energy — love deepens and new bonds form with ease.':dl==='Mangal'||al==='Mangal'?'Mars energy intensifies passions but can create friction — channel into honest dialogue.':'Relationships call for nurturing communication and patient understanding.'} ${period==='annual'?'For singles, this year holds meaningful connection potential. For couples, a deepening phase.':'Quality time and heartfelt appreciation strengthen your most cherished bonds.'}`)

  sections.push(`## 🌿 Health & Vitality (Arogya)\nThe 6th house of health is ruled by ${h6?.lord||'Budha'}. ${dl==='Shani'?'Saturn can create fatigue — prioritise rest, warm foods and regular oil massage.':dl==='Mangal'?'Mars energy is powerful but risks overexertion — avoid reckless physical activity.':'Health is generally supportive with mindful attention to routine.'} ${moonSign==='Karka'||moonSign==='Meena'?'Digestive and emotional health are linked — avoid cold, heavy foods.':'Maintain steady daily routines to prevent Vata imbalance.'} Short daily pranayama practice is especially beneficial this period.`)

  sections.push(`## 🪔 Spirituality & Inner Growth (Dharma-Moksha)\n${nakshatra} Nakshatra carries deep ${['Ashwini','Magha','Mula'].includes(nakshatra)?'transformative and healing energy':['Rohini','Uttara Phalguni','Uttara Ashadha'].includes(nakshatra)?'sattvic and dharmic grace':'intuitive and devotional energy'}. ${dl==='Ketu'||al==='Ketu'?'Ketu strongly activates moksha — meditation, solitude and scripture are deeply rewarding now.':dl==='Guru'||al==='Guru'?'Jupiter\'s dasha is auspicious for spiritual development — seek a teacher and deepen your practice.':'Your sadhana practice carries accelerated results in this dasha period.'} ${period==='annual'?'Consider a yearly pilgrimage or daily mantra commitment this year.':'Even 20 minutes of morning meditation creates noticeable inner clarity.'}`)

  sections.push(`## 🙏 Vedic Remedies (Upaya)\n**Primary remedy (${dl} Mahadasha):**\n${REMEDIES[dl]}\n\n**Supporting remedy (${al} Antardasha):**\n${REMEDIES[al]}\n\n**Universal daily practice:**\nRecite the Gayatri Mantra 108 times at dawn. Light a ghee lamp each evening. Acts of selfless charity (dana) aligned with the ruling planet dissolve karmic blockages and invite divine grace.\n\n---\n*ॐ तत् सत् · May the eternal light of Jyotish illuminate your path*`)

  return sections.join('\n\n')
}

export default async function handler(req,res){
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