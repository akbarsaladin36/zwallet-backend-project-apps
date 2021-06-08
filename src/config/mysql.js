const mysql = require('mysql2')
require('dotenv').config()

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASES
})

connection.connect((error) => {
  if (error) throw error
  console.log('Database connected to server.')
})

module.exports = connection
