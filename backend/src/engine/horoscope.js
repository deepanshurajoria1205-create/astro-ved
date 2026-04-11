const REMEDIES = {
  Surya:'Offer water to Sun at sunrise, recite Aditya Hridayam, wear Ruby on Sundays.',
  Chandra:'Fast on Mondays, offer white flowers to Shiva, wear Pearl or Moonstone.',
  Mangal:'Recite Hanuman Chalisa on Tuesdays, donate red lentils, wear Red Coral.',
  Budha:'Recite Vishnu Sahasranama on Wednesdays, donate green vegetables, wear Emerald.',
  Guru:'Feed Brahmins on Thursdays, recite Guru Stotram, wear Yellow Sapphire.',
  Shukra:'Offer white sweets to Lakshmi on Fridays, recite Shri Sukta, wear Diamond or White Sapphire.',
  Shani:'Light sesame oil lamp on Saturdays, recite Shani Stotra, donate black sesame, wear Blue Sapphire.',
  Rahu:'Recite Durga Saptashati, donate to the needy, wear Hessonite Garnet.',
  Ketu:'Recite Ganesh Stotra, donate blankets, wear Cat\'s Eye.'
}
const DASHA_THEMES = {
  Surya:'authority, government, father, vitality and leadership',
  Chandra:'emotions, mind, mother, public life and nurturing',
  Mangal:'energy, property, siblings, courage and ambition',
  Budha:'intellect, communication, business, travel and education',
  Guru:'wisdom, children, spirituality, fortune and expansion',
  Shukra:'relationships, creativity, luxury, vehicles and comforts',
  Shani:'discipline, karma, longevity, service and hard lessons',
  Rahu:'foreign lands, innovation, ambition, illusions and sudden gains',
  Ketu:'spirituality, detachment, past karma, moksha and healing'
}

export function generateHoroscope(chartData, period) {
  const {ascendant,moonSign,nakshatra,nakshatraPada,dasha,yogas,doshas,planets,houses,name} = chartData
  const dl = dasha?.current || 'Guru'
  const al = dasha?.subDasha || 'Shani'
  const lagna = ascendant?.sign || moonSign
  const yogaNames = yogas?.length ? yogas.slice(0,2).map(y=>y.name).join(' and ') : 'auspicious planetary combinations'
  const h10 = houses?.find(h=>h.house===10), h7=houses?.find(h=>h.house===7), h6=houses?.find(h=>h.house===6)

  const sections = []

  sections.push(`# ${period.charAt(0).toUpperCase()+period.slice(1)} Horoscope for ${name||'Native'}
*${lagna} Lagna · ${moonSign} Rashi · ${nakshatra} Nakshatra Pada ${nakshatraPada}*
*Running: ${dl}–${al} Dasha (ends ${dasha?.endDate || 'N/A'})*

---`)

  sections.push(`## 🌌 Cosmic Overview
The celestial canvas ${period==='weekly'?'this week':period==='monthly'?'this month':'this year'} is painted by your ${dl} Mahadasha and ${al} Antardasha. This period activates the themes of **${DASHA_THEMES[dl]}**, with ${al} adding its flavour of **${DASHA_THEMES[al]}** to daily life. ${yogaNames} in your chart act as a protective shield and elevating force, ensuring that even challenges become stepping stones. Your ${nakshatra} Nakshatra nature gives you an instinctive strength that can be powerfully channelled now.`)

  sections.push(`## 💼 Career & Finance (Artha)
The 10th house of karma is ruled by ${h10?.lord||'Shani'} in your chart. ${dl==='Shani'||al==='Shani'?'Saturn\'s influence demands disciplined, patient effort — shortcuts will not serve you. Consistent work will yield solid, lasting rewards.':dl==='Guru'||al==='Guru'?'Jupiter\'s blessing opens doors to growth, higher learning and recognition. This is an excellent time to expand your professional sphere.':'The current dasha activates professional ambition and the drive to achieve.'} ${period==='annual'?'This year marks a karmic turning point in career — lay strong foundations now.':period==='monthly'?'Mid-month brings a significant professional development to watch for.':'Avoid major financial commitments early in the week; Thursday onwards is more auspicious.'} ${doshas?.find(d=>d.name==='Mangal Dosha')?'Mars dosha energy can create impulsiveness in financial decisions — pause before committing.':''}`)

  sections.push(`## 💞 Relationships & Love (Kama)
The 7th house of partnerships is governed by ${h7?.lord||'Shukra'}. ${dl==='Shukra'||al==='Shukra'?'Venus dasha brings a beautiful, harmonious energy to relationships — love deepens and new bonds form with ease.':dl==='Mangal'||al==='Mangal'?'Mars energy can intensify passions but also create friction. Channel this into healthy physical activity and honest conversation.':'Relationships call for nurturing communication and patient understanding this period.'} ${moonSign==='Karka'||moonSign==='Meena'||moonSign==='Vrishabha'?'Your Moon sign\'s sensitivity is a gift — use emotional depth to create genuine intimacy rather than withdrawing inward.':'Staying grounded emotionally will help you navigate relationship dynamics with grace.'} ${period==='annual'?'For singles, this year holds significant potential for meaningful connections. For couples, a period of deepening commitment.':'Quality time and heartfelt appreciation will strengthen your most cherished bonds this period.'}`)

  sections.push(`## 🌿 Health & Vitality (Arogya)
The 6th house of health is ruled by ${h6?.lord||'Budha'}. ${dl==='Shani'?'Saturn\'s mahadasha can create fatigue and joint-related concerns — prioritise rest, warm foods and regular oil massage (abhyanga).':dl==='Mangal'?'Mars energy is powerful but can lead to overexertion, inflammation or accidents — avoid reckless physical activity.':'Health is generally supportive this period with mindful attention to routine.'} ${moonSign==='Karka'||moonSign==='Meena'?'Digestive health and emotional wellbeing are deeply linked for your rashi — avoid cold, heavy or processed foods.':moonSign==='Mesha'||moonSign==='Simha'?'Pitta constitution needs cooling foods, adequate hydration and avoiding excessive sun exposure.':'Maintain steady daily routines — Vata imbalance through irregular habits is the main concern.'} ${period==='annual'?'This year, investing in a sustained Ayurvedic or yoga practice will yield compounding health benefits.':'Short daily pranayama practice (Anulom Vilom, 10 minutes) is especially beneficial this period.'}`)

  sections.push(`## 🪔 Spirituality & Inner Growth (Dharma-Moksha)
${nakshatra} Nakshatra carries the essence of ${['Ashwini','Magha','Mula','Jyeshtha'].includes(nakshatra)?'transformation, healing and ancestral wisdom':['Rohini','Uttara Phalguni','Uttara Ashadha','Uttara Bhadrapada'].includes(nakshatra)?'sattvic refinement, dharmic steadiness and divine grace':['Ardra','Vishakha','Shatabhisha'].includes(nakshatra)?'fierce inquiry, breakthrough insight and unconventional wisdom':'deep intuition, devotion and the whisper of inner knowing'}. ${dl==='Ketu'||al==='Ketu'?'Ketu\'s presence strongly activates the moksha dimension of life — meditation, solitude, scripture study and pilgrimage will be unusually rewarding and transformative now.':dl==='Guru'||al==='Guru'?'Jupiter\'s dasha is among the most auspicious for spiritual development — seek a teacher, deepen scriptural study, and expand your dharmic service.':'Your sadhana practice, however modest, carries accelerated results in this dasha period.'} ${period==='annual'?'Consider undertaking a significant spiritual commitment this year — a daily mantra practice, a pilgrimage, or dedicated service (seva).':'Even 20 minutes of morning meditation will create a noticeable shift in inner clarity and outer circumstances.'}`)

  sections.push(`## 🙏 Vedic Remedies (Upaya)
To harmonise and strengthen the current ${dl}–${al} period:

**Primary remedy (${dl} Mahadasha):**
${REMEDIES[dl]}

**Supporting remedy (${al} Antardasha):**
${REMEDIES[al]}

**Universal daily practice:**
Recite the Gayatri Mantra 108 times at dawn. Light a ghee lamp before your home altar each evening. Practice gratitude — it is the most powerful attractor of cosmic grace. Acts of selfless charity (dana) aligned with the ruling planet dissolve karmic blockages and invite divine blessings.

---
*ॐ तत् सत् · May the eternal light of Jyotish illuminate your path*`)

  return sections.join('\n\n')
}