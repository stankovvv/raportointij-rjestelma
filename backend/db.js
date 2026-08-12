import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Lataa .env-arvot ennen kuin luodaan tietokantayhteys.
dotenv.config();

// Käytetään poolia, jotta useat pyynnöt voivat käyttää samaa MySQL-yhteysjoukkoa.
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'raportointijarjestelma',
  port: Number(process.env.DB_PORT || 3306),
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