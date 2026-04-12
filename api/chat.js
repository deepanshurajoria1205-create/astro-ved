export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { question, chartData, history } = req.body
    if (!question || !chartData) return res.status(400).json({ error: 'Missing question or chartData' })

    const { ascendant, moonSign, nakshatra, nakshatraPada, nakshatraLord, dasha, yogas, doshas, planets, houses, name } = chartData
    const dl = dasha?.current || 'Guru'
    const al = dasha?.subDasha || 'Shani'

    const chartSummary = `
Name: ${name || 'the native'}
Lagna: ${ascendant?.sign} | Moon: ${moonSign} | Nakshatra: ${nakshatra} Pada ${nakshatraPada} (lord: ${nakshatraLord})
Dasha: ${dl} → ${al} (ends ${dasha?.endDate})
Planets: ${planets?.map(p => `${p.name}(${p.sign},H${p.house},${p.dignity})`).join(' | ')}
Yogas: ${yogas?.map(y => y.name).join(', ') || 'none'}
Doshas: ${doshas?.map(d => d.name).join(', ') || 'none'}
Houses: ${houses?.map(h => `H${h.house}:${h.sign}(${h.lord})`).join(' | ')}`

    // Build conversation history for context
    const historyText = history?.slice(-6).map(h =>
      `${h.role === 'user' ? 'Seeker' : 'Jyotishi'}: ${h.content}`
    ).join('\n') || ''

    const prompt = `You are Jyotish Acharya — a master Vedic astrologer with deep knowledge of all classical texts. You are having a personal consultation with ${name || 'a seeker'}.

THEIR BIRTH CHART:
${chartSummary}

${historyText ? `CONVERSATION SO FAR:\n${historyText}\n` : ''}

SEEKER'S QUESTION: ${question}

Answer as a wise, warm Vedic astrologer:
- Be specific to their actual chart data above
- Use Sanskrit terms naturally where appropriate
- Keep response conversational and focused — 3-6 sentences usually
- If asking about timing, reference their Dasha period
- If asking about relationships, reference 7th house lord (${houses?.find(h => h.house === 7)?.lord || 'relevant planets'})
- If asking about career, reference 10th house lord (${houses?.find(h => h.house === 10)?.lord || 'relevant planets'})
- Be honest but compassionate — mention remedies when relevant
- Do NOT use bullet points — write in flowing conversational prose
- End with a brief encouraging note when appropriate`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
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

    res.json({ answer: text })
  } catch (err) {
    console.error('Chat error:', err)
    res.status(500).json({ error: err.message })
  }
}