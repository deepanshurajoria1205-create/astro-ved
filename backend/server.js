import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import calculateRoute from './src/routes/calculate.js'
import horoscopeRoute from './src/routes/horoscope.js'
import userRoute from './src/routes/user.js'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/calculate', calculateRoute)
app.use('/api/horoscope', horoscopeRoute)
app.use('/api/user', userRoute)

app.get('/api/health', (_, res) => res.json({ status: 'ok' }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Jyotish API running on port ${PORT}`))