import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import pg from 'pg'

const { Pool } = pg
const app = express()
const port = Number(process.env.PORT) || 5000

const tableName = process.env.PGTABLE || 'F-Logistics'
const quotedTableName = tableName
  .split('.')
  .map((part) => `"${part.replaceAll('"', '""')}"`)
  .join('.')

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT) || 5432,
  database: process.env.PGDATABASE || 'my_db',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '1234',
})

app.use(cors())
app.use(express.json())

app.get('/characters', async (_req, res) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM ${quotedTableName}`)
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to load characters' })
  }
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
