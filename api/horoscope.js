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
  Surya:{positive:'soul purpose, authority, government, father and recognition',negative:'ego conflicts, eye and heart health, disputes with authority',advice:'Step into leadership. Seek recognition but guard against pride.'},
  Chandra:{positive:'emotional depth, mind, mother, public popularity and intuition',negative:'mental fluctuations, emotional instability, water-related issues',advice:'Honour your emotional needs. Connect with water, nature and feminine energy.'},
  Mangal:{positive:'energy, courage, property, siblings, ambition and physical vitality',negative:'aggression, accidents, inflammation, disputes',advice:'Channel energy into disciplined physical activity and decisive action.'},
  Budha:{positive:'intellect, communication, business, education and travel',negative:'nervousness, skin issues, miscommunication, scattered energy',advice:'Study, write, communicate and engage in intellectual pursuits.'},
  Guru:{positive:'wisdom, spirituality, children, fortune and higher learning',negative:'overindulgence, false optimism, liver issues',advice:'Seek a guru. Study scripture. Be generous and expand philosophically.'},
  Shukra:{positive:'relationships, creativity, luxury, beauty and material comforts',negative:'over-indulgence, relationship issues, reproductive health',advice:'Cultivate beauty, art and loving relationships.'},
  Shani:{positive:'discipline, karma, longevity, service and hard-earned rewards',negative:'delays, restrictions, depression, joint issues',advice:'Be patient and disciplined. Serve others. Avoid shortcuts.'},
  Rahu:{positive:'foreign connections, innovation, technology and unconventional gains',negative:'illusions, obsessions, sudden disruptions and anxiety',advice:'Stay grounded. Avoid shortcuts. Foreign connections may be beneficial.'},
  Ketu:{positive:'spirituality, psychic ability, moksha and past-life wisdom',negative:'isolation, confusion, loss and karmic debts surfacing',advice:'Embrace meditation and spiritual practice. Let go of the past.'}
}

function getFavourableDays(dashaLord,moonSign) {
  const DAYS={Surya:'Sunday',Chandra:'Monday',Mangal:'Tuesday',Budha:'Wednesday',Guru:'Thursday',Shukra:'Friday',Shani:'Saturday',Rahu:'Saturday',Ketu:'Tuesday'}
  const moonDays={Mesha:'Tuesday',Vrishabha:'Friday',Mithuna:'Wednesday',Karka:'Monday',Simha:'Sunday',Kanya:'Wednesday',Tula:'Friday',Vrischika:'Tuesday',Dhanu:'Thursday',Makara:'Saturday',Kumbha:'Saturday',Meena:'Thursday'}
  return [DAYS[dashaLord],moonDays[moonSign]].filter((v,i,a)=>v&&a.indexOf(v)===i).join(' and ')
}

function getWeeklyCareer(dl,al,h10lord,favDays) {
  const opening = dl==='Shani'||al==='Shani'
    ? 'Saturn\'s steady hand governs your professional week — this is not the time for grand gestures but for disciplined, focused work on existing tasks.'
    : dl==='Guru'||al==='Guru'
    ? 'Jupiter casts an expansive light on your career this week — look for a small but meaningful opportunity to expand your role or demonstrate your expertise.'
    : dl==='Surya'||al==='Surya'
    ? 'Solar energy heightens your visibility at work this week — a good time to present ideas, seek recognition or initiate conversations with authority figures.'
    : 'The week calls for focused effort on immediate tasks rather than long-range planning.'
  return `${opening} The 10th house lord **${h10lord}** indicates that ${favDays} are the most productive days for important meetings, presentations or financial decisions. Mid-week may bring a minor obstacle — approach it with patience rather than force. Avoid signing contracts or making large financial commitments on unfavourable days.`
}

function getMonthlyCareer(dl,al,h10lord) {
  const opening = dl==='Shani'||al==='Shani'
    ? 'This month Saturn asks you to consolidate, organise and eliminate what is inefficient in your professional life. A slow month for new beginnings but excellent for completing pending work.'
    : dl==='Guru'||al==='Guru'
    ? 'Jupiter\'s monthly influence opens meaningful doors — a mentor, institution or higher authority may play a significant role in your professional growth this month.'
    : dl==='Mangal'||al==='Mangal'
    ? 'Mars energises your professional month with drive and initiative. Take bold action in the first half; the second half calls for consolidation and review.'
    : dl==='Shukra'||al==='Shukra'
    ? 'Venus brings charm and creative energy to your professional interactions this month — collaborations, client relationships and creative projects are especially favoured.'
    : 'This month brings steady professional progress with one notable development around the middle of the month.'
  return `${opening} The 10th house lord **${h10lord}** suggests that career themes evolve meaningfully over the coming weeks. Focus on building one key professional relationship this month — it will prove valuable in the months ahead. Financially, the second half of the month is stronger than the first.`
}

function getAnnualCareer(dl,al,h10lord,dasha) {
  const opening = dl==='Shani'
    ? 'This is a Saturn year of your life — defined by hard work, karmic accountability and the slow but certain building of something lasting. Shortcuts will not work; disciplined effort will be richly rewarded by year\'s end.'
    : dl==='Guru'
    ? 'Jupiter Mahadasha makes 2026 a year of significant professional expansion. New opportunities in education, advisory roles, international connections or leadership positions are strongly favoured. Say yes to growth.'
    : dl==='Shukra'
    ? 'Venus Mahadasha colours 2026 with creativity, collaboration and material prosperity. Careers in arts, beauty, finance, relationships and luxury sectors are especially activated.'
    : dl==='Rahu'
    ? 'Rahu Mahadasha in 2026 accelerates unconventional career moves — technology, foreign work, entrepreneurship and breaking out of traditional paths are highlighted. Embrace the unexpected.'
    : `The ${dl} Mahadasha continues to shape your career arc in 2026, activating themes of ${DASHA_THEMES[dl]?.positive}.`
  return `${opening}\n\nThe ${al} Antardasha ending ${dasha?.antarEndDate||'later this year'} focuses these energies specifically on ${DASHA_THEMES[al]?.positive}. This year is a karmic checkpoint — the professional decisions made in 2026 will define the trajectory of the next 3-5 years. Invest in skill development, build your reputation consciously and avoid burning bridges.`
}

function getWeeklyRelationships(dl,al,moonSign) {
  if(dl==='Shukra'||al==='Shukra') return `Venus rules your relational week with a warm, harmonious glow. This is an excellent week for romance, social connection and heartfelt conversations. Plan something beautiful with a loved one — even a simple shared meal becomes meaningful now. Singles may have a significant encounter mid-week.`
  if(dl==='Mangal'||al==='Mangal') return `Mars brings intensity to relationships this week — passion runs high but so does the potential for friction. Choose words carefully in close relationships, especially ${moonSign==='Vrischika'||moonSign==='Mesha'?'on Tuesday and Wednesday':'mid-week'}. Physical activity shared with a partner transforms tension into bonding energy.`
  if(dl==='Shani'||al==='Shani') return `Saturn\'s influence this week calls for honest, practical relationship conversations rather than romantic gestures. Address a longstanding issue with patience and maturity — what you resolve this week may lift a burden that has lingered for months.`
  return `Relationships this week benefit from simple, genuine presence. Put the phone away during shared time. Listen more than you speak. A small, thoughtful gesture will be remembered far longer than an elaborate plan.`
}

function getMonthlyRelationships(dl,al,moonSign) {
  if(dl==='Shukra'||al==='Shukra') return `Venus Dasha makes this a beautiful month for love and connection. Existing relationships deepen with natural ease — plan a meaningful experience together. Singles are in a magnetically attractive phase; social events in the first half of the month are especially promising. Beauty, art and shared aesthetic experiences strengthen bonds.`
  if(dl==='Shani'||al==='Shani') return `Saturn\'s monthly influence tests relationships for genuine depth and mutual commitment. Some relationships may feel strained or require difficult conversations — approach these with maturity and compassion. What survives this period is built to last. For singles, this month calls for honest self-reflection on relationship patterns before seeking new connections.`
  if(dl==='Guru'||al==='Guru') return `Jupiter\'s expansive energy this month brings wisdom and generosity to your relationships. You may play the role of guide or counsellor for someone close. Philosophical conversations and shared learning experiences deepen bonds. For singles, connections made through educational or spiritual settings are particularly meaningful.`
  return `Relationships this month follow the rhythm of the ${dl} Dasha — ${DASHA_THEMES[dl]?.positive}. Focus on quality over quantity in your social interactions. One or two deeply nourishing relationships will serve you better than many surface-level connections this month.`
}

function getAnnualRelationships(dl,al,moonSign,doshas) {
  const mangalDosha = doshas?.find(d=>d.name==='Mangal Dosha')
  const base = dl==='Shukra'
    ? 'Venus Mahadasha makes 2026 one of the most significant years for relationships in your entire dasha cycle. Marriage, deep commitment, artistic partnership or a transformative love connection is strongly possible. Existing relationships reach new levels of intimacy and understanding.'
    : dl==='Shani'
    ? 'Saturn\'s annual influence on relationships in 2026 is one of maturation and karmic resolution. Old relationship patterns that no longer serve you will be challenged and transformed. This is a year to build partnership on the foundation of shared values, mutual respect and long-term commitment rather than surface attraction.'
    : dl==='Rahu'
    ? 'Rahu\'s influence in 2026 may bring unconventional, intense or foreign connections into your relational world. Relationships formed this year may feel fated or karmic. Exercise discernment — not every intense connection is meant to last, but the lessons are always valuable.'
    : `The ${dl} Dasha colours 2026\'s relational landscape with themes of ${DASHA_THEMES[dl]?.positive}.`
  return `${base}\n\n${mangalDosha?`**Note on Mangal Dosha:** ${mangalDosha.desc} This year, the dosha remedy is particularly important for relationship harmony.`:''} Your ${moonSign} Moon sign calls for ${moonSign==='Karka'||moonSign==='Meena'?'emotional depth and nurturing as the foundation of all meaningful bonds':'authentic expression and honesty as the cornerstone of lasting partnership'} in 2026.`
}

function getWeeklyHealth(dl,moonSign) {
  const base = dl==='Shani'?'Saturn may manifest as lower back tightness, fatigue or joint stiffness this week — prioritise warm sesame oil massage, adequate sleep and avoiding prolonged sitting.':dl==='Mangal'?'Mars energy is high this week — great for exercise but watch for overexertion, inflammation or minor injuries. Stay hydrated and avoid reckless physical activity.':dl==='Rahu'?'Rahu can create restlessness and disrupted sleep this week — establish a calming bedtime routine, reduce screen time after sunset and practice grounding breathwork.':'Health this week is generally supportive. Maintain your existing routines and avoid skipping meals or sleep.'
  const moonHealth = moonSign==='Karka'||moonSign==='Meena'?'Watch digestive sensitivity — eat warm, easily digestible foods and avoid cold or raw foods.':moonSign==='Mesha'||moonSign==='Simha'?'Pitta energy may run high — cooling foods, adequate water and avoiding excessive heat or sun are beneficial.':'Vata balance is key this week — warm oil massage, regular meal times and avoiding excessive multitasking.'
  return `${base} ${moonHealth} **Weekly practice:** 10 minutes of Anulom Vilom pranayama each morning will noticeably stabilise energy and mental clarity throughout the week.`
}

function getMonthlyHealth(dl,moonSign) {
  const base = dl==='Shani'?'This month, Saturn calls for a serious look at structural health habits — sleep, posture, joint care and chronic issues deserve attention. Schedule any overdue medical check-ups this month.':dl==='Guru'?'Jupiter\'s monthly influence generally supports vitality and healing. A good month to begin a new health regimen, consult an Ayurvedic practitioner or deepen a yoga practice.':dl==='Mangal'?'Mars brings physical energy and drive this month — channel it through consistent structured exercise. Be cautious of inflammatory conditions, fevers or accidents in the second half.':'Health this month responds well to consistency — whatever practices you establish in the first week tend to carry through the month.'
  return `${base} For your ${moonSign} constitution, this month\'s focus should be on ${moonSign==='Karka'||moonSign==='Meena'?'gut health, emotional processing and reducing anxiety through routine':'maintaining energy levels through balanced activity, nourishing food and avoiding over-stimulation'}. A monthly Ayurvedic oil massage (Abhyanga) at the new moon is especially restorative.`
}

function getAnnualHealth(dl,moonSign) {
  const base = dl==='Shani'?'Saturn Mahadasha in 2026 calls for proactive, preventive healthcare. Joints, bones, teeth and chronic conditions associated with Saturn deserve particular attention this year. Begin or deepen a consistent yoga and pranayama practice — the investment in daily discipline now creates robust health for years ahead.':dl==='Rahu'?'Rahu Mahadasha can create unusual, hard-to-diagnose health patterns in 2026 — trust your body\'s signals and seek qualified medical advice promptly. Mental health, nervous system care and sleep quality are priority areas.':dl==='Mangal'?'Mars Mahadasha in 2026 gives excellent physical energy but requires channelling — structured athletic training, martial arts or an intensive yoga practice will convert this Martian fire into sustained vitality rather than inflammation or injury.':'This year\'s health theme is building sustainable foundations — nutrition, sleep, movement and stress management deserve conscious attention in 2026.'
  return `${base}\n\nFor your ${moonSign} Moon constitution, 2026\'s annual health focus is ${moonSign==='Karka'||moonSign==='Meena'?'the gut-brain connection — emotional health directly impacts physical vitality. Prioritise stress reduction, regular nature immersion and a sattvic diet':moonSign==='Mesha'||moonSign==='Simha'?'managing Pitta — cooling practices, meditation and avoiding excessive competition or anger will protect cardiovascular health':'maintaining Vata balance through routine, warmth and grounding — irregular schedules are your primary health risk this year'}.`
}

function getWeeklySpirituality(dl,al,nakshatra,nakshatraLord) {
  if(dl==='Ketu'||al==='Ketu') return `Ketu\'s influence makes this one of the most spiritually charged weeks in your current cycle. Silence, solitude and inner listening will reveal something profound. A spontaneous visit to a temple, river or natural sacred site may carry unexpected significance. Dreams may be particularly vivid and meaningful — keep a dream journal.`
  if(dl==='Guru'||al==='Guru') return `Jupiter illuminates your spiritual week with wisdom and philosophical insight. A teaching, book, conversation or inner realisation may expand your understanding significantly. Chanting, mantra recitation and scriptural study are particularly potent now. Generosity of spirit — giving your time, attention or resources — accelerates spiritual merit.`
  if(dl==='Shani'||al==='Shani') return `Saturn\'s spiritual lesson this week is about consistency over inspiration. Spiritual practice that feels routine and undramatic is exactly what Saturn rewards — show up daily, do the practice, and trust the invisible accumulation of merit. Karma seva (selfless service) is especially powerful now.`
  return `Your ${nakshatra} Nakshatra, ruled by ${nakshatraLord}, gifts you with natural spiritual sensitivity this week. Even 15 minutes of morning stillness — before the day's noise begins — will create a thread of inner peace that carries through every interaction.`
}

function getMonthlySpirituality(dl,al,nakshatra) {
  if(dl==='Ketu'||al==='Ketu') return `This month, Ketu\'s moksha energy is particularly strong. Consider a one-day silent retreat, a visit to a powerful temple or sacred site, or beginning a 40-day daily mantra discipline (sadhana). Ancestral healing practices — Pitru Tarpan, offering to ancestors — are especially beneficial and create powerful karmic resolution.`
  if(dl==='Guru'||al==='Guru') return `Jupiter\'s monthly spiritual influence is one of expansion and divine grace. This is an excellent month to seek initiation into a new practice, find a qualified teacher or commit to a serious study of Vedic or spiritual philosophy. Your prayers and intentions carry particular power this month — be conscious of what you put into words.`
  return `This month invites you to deepen whatever spiritual practice already resonates with you rather than seeking something new. The ${nakshatra} Nakshatra quality of your Moon suggests that ${['Rohini','Uttara Phalguni','Uttara Ashadha','Uttara Bhadrapada'].includes(nakshatra)?'devotional practice — bhakti, puja, kirtan and heartfelt prayer':['Ardra','Vishakha','Jyeshtha','Mula'].includes(nakshatra)?'inquiry and philosophical investigation — Jnana yoga and self-inquiry':'consistent disciplined practice — Karma yoga and selfless service'} is your most natural path to the divine this month.`
}

function getAnnualSpirituality(dl,nakshatra,nakshatraDeity) {
  if(dl==='Ketu') return `Ketu Mahadasha in 2026 is potentially the most spiritually transformative period of your life. The soul is pulling powerfully toward moksha, detachment and inner liberation. Material desires may feel hollow; spiritual seeking feels urgent. Follow this call — meditate deeply, find a genuine guru, undertake pilgrimage and read the great liberation texts. What you realise about your true nature this year may reshape your entire life trajectory.`
  if(dl==='Guru') return `Jupiter Mahadasha makes 2026 a year of genuine spiritual expansion and fortune. The door to authentic spiritual teaching and transformation is wide open — walk through it consciously. This year, the quality of your spiritual practice will determine the quality of grace that flows into every area of your life. Consider formal initiation, an extended retreat or a significant pilgrimage.`
  if(dl==='Shani') return `Saturn Mahadasha in 2026 teaches spirituality through lived experience rather than inspiration. Service, humility, consistency and facing uncomfortable truths about oneself are Saturn\'s spiritual curriculum. The practice is simple: do your duty without complaint, serve without expectation, and find the sacred in the ordinary. This is the yoga of everyday life.`
  return `2026\'s spiritual theme is shaped by the ${dl} Mahadasha — a journey into ${DASHA_THEMES[dl]?.positive}. Your natal ${nakshatra} Nakshatra, presided over by ${nakshatraDeity||'divine forces'}, indicates that your spiritual nature is most deeply expressed through consistent practice, sincere devotion and service to others. Make one meaningful spiritual commitment for the full year — keep it, and watch how it transforms you.`
}

function generateHoroscope(chartData,period) {
  const {ascendant,moonSign,nakshatra,nakshatraPada,nakshatraLord,nakshatraQuality,nakshatraDeity,dasha,yogas,doshas,planets,houses,name,currentTransits,ashtakavarga,sadeSati}=chartData
  const dl=dasha?.current||'Guru',al=dasha?.subDasha||'Shani',pl=dasha?.pratyantar||'Budha'
  const lagna=ascendant?.sign||moonSign
  const remedy=REMEDIES[dl]
  const strongYogas=yogas?.filter(y=>['Very Strong','Strong'].includes(y.strength))
  const yogaNames=strongYogas?.length?strongYogas.map(y=>y.name).join(', '):'auspicious planetary combinations'
  const h10=houses?.find(h=>h.house===10),h7=houses?.find(h=>h.house===7),h6=houses?.find(h=>h.house===6)
  const favDays=getFavourableDays(dl,moonSign)
  const strongHouses=ashtakavarga?.filter(h=>h.score>=5).slice(0,3)

  const PERIOD_HEADER={
    weekly:`# Weekly Horoscope — ${name||'Native'}\n*Week of ${new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}*`,
    monthly:`# Monthly Horoscope — ${name||'Native'}\n*${new Date().toLocaleDateString('en-IN',{month:'long',year:'numeric'})}*`,
    annual:`# Annual Horoscope 2026 — ${name||'Native'}\n*Varsha Phal — Annual Forecast*`
  }

  const PERIOD_INTRO={
    weekly:`This week's reading focuses on **immediate energies, day-to-day decisions and short-term opportunities** specific to the next 7 days.`,
    monthly:`This month's reading addresses **evolving trends, opportunities building over weeks and meaningful monthly themes** for the coming 30 days.`,
    annual:`This annual reading covers **major life themes, significant turning points and the overarching karmic direction** for the year 2026.`
  }

  const sections=[]

  sections.push(`${PERIOD_HEADER[period]}

**Lagna:** ${lagna} | **Rashi:** ${moonSign} | **Nakshatra:** ${nakshatra} Pada ${nakshatraPada}
**Dasha:** ${dl} → ${al} → ${pl} | **Dasha ends:** ${dasha?.endDate||'N/A'}
${sadeSati?.active?`\n⚠️ **Sade Sati Active (${sadeSati.phase} Phase)**\n`:''}
${PERIOD_INTRO[period]}

---`)

  // Period-specific cosmic overview
  const WEEKLY_THEME=`The dominant planetary energy this week flows through ${dl} Mahadasha and ${al} Antardasha. On a week-by-week level, ${pl} Pratyantardasha is the most immediate influence shaping daily events. ${DASHA_THEMES[pl]?.positive||DASHA_THEMES[dl]?.positive} is the specific lens through which this week's experiences will be filtered. Your ${nakshatra} Nakshatra gives you the gift of **${nakshatraQuality||'inner wisdom'}** — draw on this consciously as you navigate the week ahead. **Favourable days this week: ${favDays}.**`

  const MONTHLY_THEME=`This month, the ${al} Antardasha (ending ${dasha?.antarEndDate||'coming months'}) is the primary shaper of monthly experiences, operating within the broader ${dl} Mahadasha. The month unfolds in three phases: the first 10 days are governed by initiating energy — begin new things; the middle 10 days are for action and development; the final 10 days call for reflection and completion. ${yogaNames} continue to provide protection and elevation throughout. **Most powerful days this month: ${favDays}.**`

  const ANNUAL_THEME=`2026 is defined by your ${dl} Mahadasha — ${DASHA_THEMES[dl]?.positive}. This is not just another year; it is a specific chapter in your karmic biography, coloured by the distinct qualities of ${dl}. The ${al} Antardasha (ending ${dasha?.antarEndDate||'N/A'}) shapes the first part of the year, transitioning to the next Antardasha with a noticeable shift in life themes. ${yogaNames} are the permanent elevated foundation upon which 2026's events unfold. **Key advice for the year: ${DASHA_THEMES[dl]?.advice}**`

  sections.push(`## 🌌 ${period==='weekly'?'This Week\'s':period==='monthly'?'This Month\'s':'2026\'s'} Cosmic Theme\n\n${period==='weekly'?WEEKLY_THEME:period==='monthly'?MONTHLY_THEME:ANNUAL_THEME}`)

  // Transit section — only meaningful for weekly/monthly
  if(period!=='annual'&&currentTransits?.length) {
    const satT=currentTransits.find(t=>t.name==='Shani')
    const jupT=currentTransits.find(t=>t.name==='Guru')
    const marsT=currentTransits.find(t=>t.name==='Mangal')
    const transitLines=[]
    if(satT) transitLines.push(`**Saturn** transiting ${satT.sign} (${satT.degree}°) — ${period==='weekly'?'activates discipline, karmic themes and long-term restructuring in your life':'continues its 2.5-year transit, deepening karmic lessons and structural life changes'}`)
    if(jupT) transitLines.push(`**Jupiter** in ${jupT.sign} (${jupT.degree}°) — ${period==='weekly'?'brings weekly opportunities for growth, wisdom and good fortune':'opens monthly doors to expansion, learning and divine grace'}`)
    if(marsT&&period==='weekly') transitLines.push(`**Mars** in ${marsT.sign} (${marsT.degree}°) — adds ${['Mesha','Vrischika'].includes(marsT.sign)?'powerful, intense energy — channel it productively':'dynamic forward momentum'} to the week`)
    if(transitLines.length) sections.push(`## 🪐 ${period==='weekly'?'Key Transits This Week':'Active Transits This Month'}\n\n${transitLines.join('\n')}`)
  }

  // Career
  sections.push(`## 💼 Career & Finance (Artha)\n\n${period==='weekly'?getWeeklyCareer(dl,al,h10?.lord||'the house lord',favDays):period==='monthly'?getMonthlyCareer(dl,al,h10?.lord||'the house lord'):getAnnualCareer(dl,al,h10?.lord||'the house lord',dasha)}`)

  // Relationships
  sections.push(`## 💞 Relationships & Love (Kama)\n\n${period==='weekly'?getWeeklyRelationships(dl,al,moonSign):period==='monthly'?getMonthlyRelationships(dl,al,moonSign):getAnnualRelationships(dl,al,moonSign,doshas)}`)

  // Health
  sections.push(`## 🌿 Health & Vitality (Arogya)\n\n${period==='weekly'?getWeeklyHealth(dl,moonSign):period==='monthly'?getMonthlyHealth(dl,moonSign):getAnnualHealth(dl,moonSign)}`)

  // Spirituality
  sections.push(`## 🪔 Spirituality & Inner Growth (Dharma-Moksha)\n\n${period==='weekly'?getWeeklySpirituality(dl,al,nakshatra,nakshatraLord):period==='monthly'?getMonthlySpirituality(dl,al,nakshatra):getAnnualSpirituality(dl,nakshatra,nakshatraDeity)}`)

  // Ashtakavarga — only for monthly and annual
  if(period!=='weekly'&&strongHouses?.length) {
    sections.push(`## ⭐ Ashtakavarga Strength — ${period==='monthly'?'This Month\'s Focus':'2026 Power Areas'}\n\nYour chart shows particular planetary strength in these houses — ${period==='monthly'?'this month\'s transits activate them meaningfully':'these are your primary power areas for 2026'}:\n\n${strongHouses.map(h=>`- **House ${h.house} (${h.sign})** — Score ${h.score}/8: ${['Self and vitality','Wealth and speech','Courage and siblings','Home and mother','Children and intelligence','Health and service','Marriage and partnerships','Transformation','Fortune and dharma','Career and status','Gains and social circle','Liberation and foreign lands'][h.house-1]}`).join('\n')}`)
  }

  // Remedies — tailored to period
  sections.push(`## 🙏 ${period==='weekly'?'This Week\'s':period==='monthly'?'This Month\'s':'2026\'s'} Vedic Remedies (Upaya)

### For ${dl} Mahadasha
**Mantra:** ${remedy?.mantra||'Gayatri Mantra 108x daily'}
**Gemstone:** ${remedy?.gem||'Consult a qualified Jyotishi'}
**Charity:** ${remedy?.charity||'Donate according to ruling planet'}

${period==='weekly'?`### Quick Weekly Practices
- **${favDays}:** Most auspicious for important decisions and new beginnings
- Light a ghee diya each morning before leaving home
- Recite your Mahadasha mantra at least 27 times daily this week
- Avoid arguments and major decisions on inauspicious days`
:period==='monthly'?`### Monthly Sadhana
- Begin a 40-day mantra discipline (starts at the next new or full moon)
- Visit a Shiva or Vishnu temple on your most auspicious day this month
- Donate to a cause aligned with your ruling planet on **${favDays}**
- Journal daily — even 5 minutes of reflective writing creates powerful self-awareness`
:`### Annual Commitment for 2026
- Choose ONE mantra and recite it every single day of 2026 — consistency is the key
- Make one significant charitable commitment for the year aligned with ${dl}
- Plan at least one pilgrimage or sacred journey this year
- Begin an Ayurvedic health protocol at the start of the year`}

${doshas?.length?`\n### Dosha Remedies\n${doshas.map(d=>`**${d.name} (${d.severity}):** ${d.desc}`).join('\n\n')}`:''}

---
*ॐ तत् सत् · ${period==='weekly'?'Shubh Saptaha — Blessed Week':'period'==='monthly'?'Shubh Masa — Blessed Month':'Shubh Varsha 2026 — Blessed Year'}*
*May the eternal light of Jyotish illuminate your path*`)

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