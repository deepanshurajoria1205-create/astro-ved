import express from 'express'
import { getDb } from '../db/database.js'

const router = express.Router()

router.post('/save', (req, res) => {
  try {
    const db = getDb()
    const {name,dob,tob,pob,gender,chartData} = req.body
    const r = db.prepare(`INSERT OR REPLACE INTO profiles (name,dob,tob,pob,gender,chart_json,created_at) VALUES (?,?,?,?,?,?,datetime('now'))`).run(name,dob,tob,pob,gender,JSON.stringify(chartData))
    res.json({id:r.lastInsertRowid, saved:true})
  } catch(err) { res.status(500).json({error:err.message}) }
})

router.get('/profiles', (req, res) => {
  const db = getDb()
  res.json(db.prepare('SELECT id,name,dob,pob,created_at FROM profiles ORDER BY created_at DESC').all())
})

router.get('/:id', (req, res) => {
  const db = getDb()
  const row = db.prepare('SELECT * FROM profiles WHERE id=?').get(req.params.id)
  if (!row) return res.status(404).json({error:'Not found'})
  res.json({...row, chartData:JSON.parse(row.chart_json)})
})

export default router