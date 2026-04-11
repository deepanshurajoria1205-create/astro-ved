import express from 'express'
import { calculateKundali } from '../engine/ephemeris.js'
import { calculateVimshottariDasha } from '../engine/dasha.js'
import { detectYogas } from '../engine/yogas.js'

const router = express.Router()

const CITIES = {
  'hyderabad':{lat:17.385,lon:78.4867},'mumbai':{lat:19.076,lon:72.8777},
  'delhi':{lat:28.6139,lon:77.209},'bangalore':{lat:12.9716,lon:77.5946},
  'chennai':{lat:13.0827,lon:80.2707},'kolkata':{lat:22.5726,lon:88.3639},
  'pune':{lat:18.5204,lon:73.8567},'ahmedabad':{lat:23.0225,lon:72.5714},
  'london':{lat:51.5074,lon:-0.1278},'new york':{lat:40.7128,lon:-74.006},
  'dubai':{lat:25.2048,lon:55.2708},'singapore':{lat:1.3521,lon:103.8198},
  'sydney':{lat:-33.8688,lon:151.2093},'toronto':{lat:43.6532,lon:-79.3832},
  'paris':{lat:48.8566,lon:2.3522},'berlin':{lat:52.52,lon:13.405},
  'tokyo':{lat:35.6762,lon:139.6503},'beijing':{lat:39.9042,lon:116.4074},
}

function getCoords(pob) {
  const key = pob.toLowerCase().split(',')[0].trim()
  for (const [city, coords] of Object.entries(CITIES)) {
    if (key.includes(city) || city.includes(key)) return coords
  }
  return {lat:17.385,lon:78.4867}
}

function buildSummary(name, k, dasha, yogas) {
  const LAGNA_DESC = {
    Mesha:'dynamic leadership, pioneering spirit and a fiercely independent nature',
    Vrishabha:'steadfast determination, material sensibility and an appreciation for beauty',
    Mithuna:'intellectual versatility, communicative brilliance and adaptable curiosity',
    Karka:'deep emotional intelligence, nurturing instincts and strong intuition',
    Simha:'natural authority, creative self-expression and a generous, regal spirit',
    Kanya:'analytical precision, service orientation and discriminating intellect',
    Tula:'diplomatic grace, aesthetic refinement and a strong sense of justice',
    Vrischika:'penetrating insight, transformative power and unwavering intensity',
    Dhanu:'philosophical wisdom, optimistic vision and a love of freedom and truth',
    Makara:'disciplined ambition, practical wisdom and the capacity for enduring achievement',
    Kumbha:'humanitarian vision, original thinking and a progressive, idealistic nature',
    Meena:'compassionate sensitivity, spiritual depth and rich imaginative perception',
  }
  const yogaStr = yogas?.slice(0,2).map(y=>y.name).join(' and ') || 'benefic planetary combinations'
  return `${name||'The native'} is born with ${k.ascendant.sign} lagna, conferring ${LAGNA_DESC[k.ascendant.sign]||'a unique and powerful nature'}. The Moon in ${k.moonSign} (${k.nakshatra} Nakshatra, Pada ${k.nakshatraPada}) shapes the emotional world and instinctive responses. Currently running ${dasha.current}–${dasha.subDasha} Dasha until ${dasha.endDate}, a period that strongly activates the life themes of this nativity. ${yogaStr} in the chart provide powerful and lasting elevating influences throughout this lifetime.`
}

router.post('/', async (req, res) => {
  try {
    const {name,dob,tob,pob,gender} = req.body
    if (!dob||!tob||!pob) return res.status(400).json({error:'Missing required fields'})
    const [year,month,day] = dob.split('-').map(Number)
    const [hour,minute] = tob.split(':').map(Number)
    const coords = getCoords(pob)
    const kundali = calculateKundali({year,month,day,hour,minute,...coords})
    const dasha = calculateVimshottariDasha(kundali.dashaStartIdx, kundali.julianDay, kundali.julianDay)
    const {yogas,doshas} = detectYogas(kundali.planets, kundali.houses)
    const summary = buildSummary(name, kundali, dasha, yogas)
    res.json({...kundali, dasha, yogas, doshas, summary, name, gender, pob})
  } catch(err) {
    console.error(err)
    res.status(500).json({error:'Calculation error', detail:err.message})
  }
})

export default router