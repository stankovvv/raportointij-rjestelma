import mysql from 'mysql2';
import dotenv from 'dotenv';
// lisätään tietokantayhteys .env tiedostosta
dotenv.config();
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Virhe tietokantayhteydessä:', err);
    return;
  }
  console.log('Yhdistetty tietokantaan');
});

export default db;