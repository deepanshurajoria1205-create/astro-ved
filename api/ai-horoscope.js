export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { chartData, period } = req.body
    if (!chartData || !period) return res.status(400).json({ error: 'Missing chartData or period' })

    const { ascendant, moonSign, nakshatra, nakshatraPada, nakshatraLord, dasha, yogas, doshas, planets, houses, name, sadeSati } = chartData
    const dl = dasha?.current || 'Guru'
    const al = dasha?.subDasha || 'Shani'
    const strongPlanets = planets?.filter(p => p.strength >= 65).map(p => `${p.name} in ${p.sign} H${p.house}`).join(', ')
    const yogaList = yogas?.slice(0,2).map(y => y.name).join(', ') || 'none'
    const h10 = houses?.find(h => h.house === 10)
    const h7 = houses?.find(h => h.house === 7)
    const h6 = houses?.find(h => h.house === 6)

    const PERIOD_FOCUS = {
      weekly: 'this specific week only. Mention Mon/Thu/Sat as key days.',
      monthly: 'this month. Split into early/mid/late month.',
      annual: 'the full year 2026. Mention key quarters.'
    }[period]

    const prompt = `You are a Vedic astrologer. Write a ${period} horoscope. START IMMEDIATELY with the first section header. NO preamble or greeting.

Chart: ${name}, ${ascendant?.sign} lagna, ${moonSign} Moon, ${nakshatra} Pada ${nakshatraPada}, ${dl}-${al} Dasha, strong: ${strongPlanets}, yogas: ${yogaList}, 10H lord: ${h10?.lord}, 7H lord: ${h7?.lord}, 6H lord: ${h6?.lord}, Sade Sati: ${sadeSati?.active ? 'Yes' : 'No'}.

Period focus: ${PERIOD_FOCUS}

## 🌌 Cosmic Theme
[2-3 sentences specific to their dasha and this ${period}]

## 💼 Career & Finance
[2-3 sentences mentioning their 10th house lord ${h10?.lord}]

## 💞 Relationships & Love  
[2-3 sentences mentioning their 7th house lord ${h7?.lord}]

## 🌿 Health & Vitality
[2-3 sentences mentioning their moon sign ${moonSign}]

## 🪔 Spirituality
[2-3 sentences referencing ${nakshatra} nakshatra]

## 🙏 Remedies
[2-3 specific remedies for ${dl} dasha]

*Sanskrit closing line here*

Keep each section to 2-3 sentences ONLY. Total 200 words maximum.`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
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