// v2 - gemini-1.5-flash-8b
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { chartData, period } = req.body
    if (!chartData || !period) return res.status(400).json({ error: 'Missing chartData or period' })

    const { ascendant, moonSign, nakshatra, nakshatraPada, nakshatraLord, dasha, yogas, doshas, planets, houses, name, sadeSati, currentTransits } = chartData
    const dl = dasha?.current || 'Guru'
    const al = dasha?.subDasha || 'Shani'
    const pl = dasha?.pratyantar || 'Budha'

    const strongPlanets = planets?.filter(p => p.strength >= 65).map(p => `${p.name} in ${p.sign} (${p.dignity}, House ${p.house})`).join(', ')
    const weakPlanets = planets?.filter(p => p.strength <= 35).map(p => `${p.name} in ${p.sign} (${p.dignity}, House ${p.house})`).join(', ')
    const yogaList = yogas?.map(y => `${y.name} (${y.strength})`).join(', ') || 'none detected'
    const doshaList = doshas?.map(d => `${d.name} (${d.severity})`).join(', ') || 'none'
    const transitList = currentTransits?.slice(0, 5).map(t => `${t.name} in ${t.sign}`).join(', ') || ''

    const PERIOD_INSTRUCTION = {
      weekly: 'Focus on THIS WEEK ONLY — specific day-by-day energy, immediate decisions, short-term opportunities. Be very specific about what to do and avoid this week. Mention specific days like Monday, Thursday etc.',
      monthly: 'Focus on THIS MONTH — evolving trends over 4 weeks, monthly milestones, opportunities building over weeks. Divide the month into early/mid/late phases with different energies.',
      annual: 'Focus on THE FULL YEAR 2026 — major life themes, significant turning points by quarter, long-range karmic direction. Mention specific months where possible.'
    }[period]

    const prompt = `You are Jyotish Acharya — a master Vedic astrologer with 40 years of experience, deeply versed in Brihat Parashara Hora Shastra, Jaimini sutras, Brihat Jataka and all classical texts. You speak with authority, warmth and genuine spiritual insight.

BIRTH CHART DATA:
- Name: ${name || 'the native'}
- Ascendant (Lagna): ${ascendant?.sign} (${ascendant?.degree}°)
- Moon Sign (Rashi): ${moonSign}
- Nakshatra: ${nakshatra} Pada ${nakshatraPada} — ruled by ${nakshatraLord}
- Current Dasha: ${dl} Mahadasha → ${al} Antardasha → ${pl} Pratyantardasha
- Dasha ends: ${dasha?.endDate}
- Strong planets: ${strongPlanets || 'none notably strong'}
- Weak planets: ${weakPlanets || 'none notably weak'}
- Active Yogas: ${yogaList}
- Doshas: ${doshaList}
- Current transits: ${transitList}
- Sade Sati: ${sadeSati?.active ? `YES — ${sadeSati.phase} phase` : 'No'}
- House lords: ${houses?.slice(0,6).map(h => `H${h.house}:${h.lord}`).join(', ')}

TASK: Write a ${period} horoscope reading for ${name || 'this native'}.
${PERIOD_INSTRUCTION}

FORMAT YOUR RESPONSE WITH THESE EXACT SECTIONS:
## 🌌 Cosmic Theme
## 💼 Career & Finance  
## 💞 Relationships & Love
## 🌿 Health & Vitality
## 🪔 Spirituality & Inner Growth
## 🙏 Remedies & Guidance

STYLE GUIDELINES:
- Write in flowing, authoritative prose — NOT bullet points
- Use Sanskrit terms naturally (Karma, Dharma, Dasha, Lagna, Graha etc.)
- Be SPECIFIC to this person's chart — mention their actual planets, signs, houses
- Be warm but honest — mention both opportunities AND challenges
- Each section should be 3-5 sentences minimum
- - Total length: 300-400 words maximum — be concise but specific
- End with an inspiring closing line in both English and Sanskrit
- Do NOT be generic — every sentence should reflect this specific chart`

    const response = await fetch(
     `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
  temperature: 0.8,
  maxOutputTokens: 600,
  topP: 0.9,
}
        })
      }
    )

    const data = await response.json()
    if (data.error) throw new Error(data.error.message)
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) throw new Error('No response from Gemini')

    res.json({ horoscope: text, period, ai: true })
  } catch (err) {
    console.error('Gemini error:', err)
    res.status(500).json({ error: err.message })
  }
}