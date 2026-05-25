import cors from 'cors'
import 'dotenv/config'
import express from 'express'
import pg from 'pg'

const { Pool } = pg
const app = express()
const port = Number(process.env.PORT) || 5000

// Имя таблицы без кавычек для логирования
const tableName = process.env.PGTABLE || 'F-Logistics'
// Убираем кавычки из переменной, если они есть
const cleanTableName = tableName.replace(/^"|"$/g, '')
// Экранируем для SQL запроса
const quotedTableName = `"${cleanTableName.replace(/"/g, '""')}"`

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'F-Logistics',
  port: Number(process.env.PGPORT) || 5432,
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
})

app.use(cors())
app.use(express.json())

// Тестовый маршрут для проверки соединения
app.get('/test', async (_req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as time, current_database() as db_name')
    res.json({ 
      success: true, 
      time: result.rows[0].time,
      database: result.rows[0].db_name
    })
  } catch (error) {
    console.error('DB Connection Error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Основной маршрут для получения данных
app.get('/F-Logistics', async (_req, res) => {
  try {
    console.log(`Querying table: ${quotedTableName}`)
    const { rows } = await pool.query(`SELECT * FROM ${quotedTableName}`)
    console.log(`Found ${rows.length} records in ${cleanTableName}`)
    res.json(rows)
  } catch (error) {
    console.error('Query Error:', error)
    res.status(500).json({ 
      message: `Failed to load data from ${cleanTableName}`,
      error: error.message,
      table: quotedTableName
    })
  }
})

app.listen(port, () => {
  console.log(`=================================`)
  console.log(`Server is running on http://localhost:${port}`)
  console.log(`Database: ${process.env.PGDATABASE || 'F-Logistics'}`)
  console.log(`Table: ${quotedTableName}`)
  console.log(`=================================`)
})