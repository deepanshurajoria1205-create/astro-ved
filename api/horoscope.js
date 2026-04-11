import { generateHoroscope } from '../backend/src/engine/horoscope.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'})
  try {
    const {chartData, period} = req.body
    if (!chartData||!period) return res.status(400).json({error:'Missing chartData or period'})
    const horoscope = generateHoroscope(chartData, period)
    res.json({horoscope, period})
  } catch(err) {
    res.status(500).json({error:err.message})
  }
}