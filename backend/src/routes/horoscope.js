import express from 'express'
import { generateHoroscope } from '../engine/horoscope.js'

const router = express.Router()

router.post('/', (req, res) => {
  try {
    const {chartData, period} = req.body
    if (!chartData||!period) return res.status(400).json({error:'Missing chartData or period'})
    const horoscope = generateHoroscope(chartData, period)
    res.json({horoscope, period})
  } catch(err) {
    res.status(500).json({error:err.message})
  }
})

export default router