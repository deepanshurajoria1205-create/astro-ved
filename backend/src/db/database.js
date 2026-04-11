import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
let db

export function getDb() {
  if (db) return db
  db = new Database(path.join(__dirname, '../../../astro.db'))
  db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT, dob TEXT, tob TEXT, pob TEXT, gender TEXT,
      chart_json TEXT, created_at TEXT
    );
    CREATE TABLE IF NOT EXISTS readings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      profile_id INTEGER, period TEXT, reading_text TEXT, created_at TEXT
    );
  `)
  return db
}