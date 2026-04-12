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
    const strongPlanets = planets?.filter(p => p.strength >= 65).map(p => `${p.name}(${p.sign},H${p.house},${p.dignity})`).join(', ')
    const weakPlanets = planets?.filter(p => p.strength <= 35).map(p => `${p.name}(${p.sign},${p.dignity})`).join(', ')
    const yogaList = yogas?.slice(0,3).map(y => y.name).join(', ') || 'none'
    const doshaList = doshas?.map(d => d.name).join(', ') || 'none'
    const h10 = houses?.find(h => h.house === 10)
    const h7 = houses?.find(h => h.house === 7)

    const PERIOD_FOCUS = {
      weekly: 'Focus ONLY on this specific week. Mention specific days (Monday, Thursday etc). Be very practical and immediate.',
      monthly: 'Focus on this month as a whole. Divide into early/mid/late month phases. Give evolving monthly trends.',
      annual: 'Focus on the full year 2026. Mention specific quarters or months. Give major life themes and turning points.'
    }[period]

    const prompt = `You are Jyotish Acharya, a master Vedic astrologer with 40 years experience. Speak with warmth, authority and genuine spiritual insight.

BIRTH CHART:
- Name: ${name || 'the native'}
- Lagna: ${ascendant?.sign} | Moon: ${moonSign} | Nakshatra: ${nakshatra} Pada ${nakshatraPada} (lord: ${nakshatraLord})
- Dasha: ${dl} → ${al} → ${pl} (ends ${dasha?.endDate})
- Strong planets: ${strongPlanets || 'none'}
- Weak planets: ${weakPlanets || 'none'}
- Yogas: ${yogaList} | Doshas: ${doshaList}
- 10th lord: ${h10?.lord} | 7th lord: ${h7?.lord}
- Sade Sati: ${sadeSati?.active ? 'YES - ' + sadeSati.phase : 'No'}

TASK: Write a complete ${period} horoscope reading.
${PERIOD_FOCUS}

USE THESE EXACT SECTION HEADERS:
## 🌌 Cosmic Theme
## 💼 Career & Finance
## 💞 Relationships & Love
## 🌿 Health & Vitality
## 🪔 Spirituality
## 🙏 Remedies

RULES:
- Each section: 3-4 sentences
- Reference their actual chart (mention specific planets, signs, houses)
- Use Sanskrit terms naturally
- Be specific to this ${period} period - not generic
- End with an inspiring Sanskrit closing line
- Total: 400-500 words`

    // Use streaming response
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Transfer-Encoding', 'chunked')
    res.setHeader('X-Content-Type-Options', 'nosniff')

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 1200,
            topP: 0.9,
          }
        })
      }
    )

    if (!response.ok) {
      const err = await response.json()
      return res.status(500).json({ error: err.error?.message || 'Gemini error' })
    }

    // Stream the response
    let fullText = ''
    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n')
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6)
          if (data === '[DONE]') continue
          try {
            const parsed = JSON.parse(data)
            const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text
            if (text) fullText += text
          } catch(e) {}
        }
      }
    }

    // Send complete response as JSON
    res.end(JSON.stringify({ horoscope: fullText, period, ai: true }))

  } catch (err) {
    console.error('Gemini error:', err)
    res.status(500).json({ error: err.message })
  }
}