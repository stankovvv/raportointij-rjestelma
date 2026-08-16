import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Ladataan ympäristömuuttujat .env-tiedostosta.
dotenv.config();


const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  dateStrings: true,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: true,
});

// Yksinkertainen apufunktio SQL-kyselyille, jotta server.js pysyy siistinä.
export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

export default pool;