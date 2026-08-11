import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
//import db from './db.js';


const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;
//tarkistetaan että tietokantayhteys toimii




app.get('/health', (req, res) => {
    res.send('Palvelin toimii');
});
// Käynnistetään palvelin
app.listen(port, () => {
    console.log(`Server is running on localhost:${port}`);
});