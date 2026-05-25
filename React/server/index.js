const { Pool } = require('pg')

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'my_db',
    user: 'postgres',
    password: '1234',
})