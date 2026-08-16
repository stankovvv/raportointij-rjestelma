import express from 'express';
import cors from 'cors';
import pool, { query } from './db.js';

const app = express();

// Sallitaan frontendiin tulevat pyynnöt ja puretaan JSON-body automaattisesti.
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;
// Tuetaan vain niitä osastoja, joille frontendissä on näkymät.
const departments = new Set(['keitto', 'pakkaamo', 'separointi']);

// Jokaisella osastolla on hieman eri kentät, joten validointi tehdään osastokohtaisesti.
const departmentConfig = {
    keitto: {
        required: ['pvm', 'aika', 'tuote', 'maara', 'lampotila', 'kesto', 'operaattori'],
    },
    pakkaamo: {
        required: ['pvm', 'aika', 'tuote', 'pakkaukset', 'paino', 'linja', 'operaattori'],
    },
    separointi: {
        required: ['pvm', 'aika', 'maara', 'rasvapitoisuus', 'lampotila', 'laitteisto', 'operaattori'],
    },
};

// Muuntaa reitistä tulevan osaston nimen turvalliseen muotoon.
function normalizeDepartment(rawDepartment) {
    const department = String(rawDepartment || '').toLowerCase();
    if (!departments.has(department)) {
        const error = new Error('Tuntematon osasto');
        error.statusCode = 400;
        throw error;
    }
    return department;
}

// MySQL-datasta halutaan palauttaa päivämäärä aina muodossa YYYY-MM-DD.
function parseDate(value) {
    if (!value) return null;
    const [year, month, day] = String(value).split('-');
    if (!year || !month || !day) return null;
    return `${year}-${month}-${day}`;
}

// Muuttaa tekstinä tulevan numeron oikeaksi numeroksi tai palauttaa nullin.
function parseNumber(value) {
    if (value === null || value === undefined || value === '') return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

// Muotoilee MySQL-päivämäärän UI:ssa käytettävään suomalaiseen muotoon.
function formatDateFi(value) {
    if (!value) return '';
    const [year, month, day] = String(value).slice(0, 10).split('-');
    if (!year || !month || !day) return String(value);
    return `${day}.${month}.${year}`;
}

// Tarkistaa, että pakolliset kentät ovat mukana ennen tallennusta.
function requireFields(department, body) {
    const missing = departmentConfig[department].required.filter((field) => {
        const value = body[field];
        return value === undefined || value === null || String(value).trim() === '';
    });

    if (missing.length > 0) {
        const error = new Error(`Puuttuvat kentät: ${missing.join(', ')}`);
        error.statusCode = 400;
        throw error;
    }
}

// Muuntaa frontendin suomenkieliset kentät yhteen tietokantamuotoon.
function buildRecordPayload(department, body) {
    const date = parseDate(body.pvm || body.date);
    const time = String(body.aika || body.time || '').slice(0, 5);
    const operatorName = String(body.operaattori || body.operatorName || '').trim();
    const notes = String(body.huomiot || body.notes || '').trim();

    if (department === 'keitto') {
        return {
            department,
            record_date: date,
            record_time: time,
            product: String(body.tuote || body.product || '').trim(),
            amount: parseNumber(body.maara || body.amount),
            temperature: parseNumber(body.lampotila || body.temperature),
            duration_min: parseNumber(body.kesto || body.duration_min || body.duration),
            packages_count: null,
            weight_kg: null,
            line_name: null,
            fat_percentage: null,
            equipment_name: null,
            operator_name: operatorName,
            notes,
        };
    }

    if (department === 'pakkaamo') {
        return {
            department,
            record_date: date,
            record_time: time,
            product: String(body.tuote || body.product || '').trim(),
            amount: null,
            temperature: null,
            duration_min: null,
            packages_count: parseNumber(body.pakkaukset || body.packages_count),
            weight_kg: parseNumber(body.paino || body.weight_kg),
            line_name: String(body.linja || body.line_name || '').trim(),
            fat_percentage: null,
            equipment_name: null,
            operator_name: operatorName,
            notes,
        };
    }

    return {
        department,
        record_date: date,
        record_time: time,
        product: null,
        amount: parseNumber(body.maara || body.amount),
        temperature: parseNumber(body.lampotila || body.temperature),
        duration_min: null,
        packages_count: null,
        weight_kg: null,
        line_name: null,
        fat_percentage: parseNumber(body.rasvapitoisuus || body.fat_percentage),
        equipment_name: String(body.laitteisto || body.equipment_name || '').trim(),
        operator_name: operatorName,
        notes,
    };
}

// Palauttaa tietokannasta tulleen rivin takaisin frontendin käyttämään muotoon.
function toApiRecord(row) {
    const pvm = formatDateFi(row.record_date);
    const aika = row.record_time ? String(row.record_time).slice(0, 5) : '';

    if (row.department === 'keitto') {
        return {
            id: row.id,
            pvm,
            aika,
            tuote: row.product || '',
        // Nopea terveydenhuoltoreitti paikalliseen tarkistukseen.
            maara: row.amount ?? '',
            lampotila: row.temperature ?? '',
            kesto: row.duration_min ?? '',
            operaattori: row.operator_name || '',
        // Sama health-check JSON-muodossa, jos frontendi tarvitsee sitä.
            huomiot: row.notes || '',
        };
    }

        // Kirjautuminen toimii tällä hetkellä demo-tasoisen käyttäjätaulun kautta.
    if (row.department === 'pakkaamo') {
        return {
            id: row.id,
            pvm,
            aika,
            tuote: row.product || '',
            pakkaukset: row.packages_count ?? '',
            paino: row.weight_kg ?? '',
            linja: row.line_name || '',
            operaattori: row.operator_name || '',
            huomiot: row.notes || '',
        };
    }

    return {
        id: row.id,
        pvm,
        aika,
        maara: row.amount ?? '',
        rasvapitoisuus: row.fat_percentage ?? '',
        lampotila: row.temperature ?? '',
        laitteisto: row.equipment_name || '',
        operaattori: row.operator_name || '',
        huomiot: row.notes || '',
    };
}
//toimiiko palvelin
app.get('/health', (req, res) => {
    res.json({ ok: true, message: 'Palvelin toimii' });
});
//toimiiko APIt
app.get('/api/health', (req, res) => {
    res.json({ ok: true, message: 'Backend OK' });
});

app.post('/api/auth/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Käyttäjätunnus ja salasana ovat pakollisia' });
        }

        const rows = await query(
            'SELECT id, username, name, role FROM users WHERE username = ? AND password = ? LIMIT 1',
            [username, password],
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Virheellinen käyttäjätunnus tai salasana' });
        }

        const user = rows[0];
        res.json({
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
});

// Dashboard hakee yhteenvedon ja tuoreimmat kirjaukset kaikista osastoista.
app.get('/api/dashboard/summary', async (req, res, next) => {
    try {
        const summaryRows = await query(
            `SELECT
                department,
                COUNT(*) AS total_entries,
                MAX(CONCAT(record_date, ' ', record_time)) AS latest_entry_at,
                SUM(COALESCE(amount, 0)) AS total_amount,
                SUM(COALESCE(packages_count, 0)) AS total_packages,
                AVG(NULLIF(fat_percentage, 0)) AS avg_fat_percentage
            FROM production_records
            GROUP BY department
            ORDER BY department`,
        );

        const recentRows = await query(
            `SELECT *
             FROM production_records
             ORDER BY record_date DESC, record_time DESC, id DESC
             LIMIT 8`,
        );

        res.json({
            summary: summaryRows.map((row) => ({
                ...row,
                latest_entry_at: row.latest_entry_at ? formatDateFi(String(row.latest_entry_at).slice(0, 10)) + ` ${String(row.latest_entry_at).slice(11, 16)}` : '',
            })),
            recent: recentRows.map(toApiRecord),
        });
    } catch (error) {
        next(error);
    }
});

// Yleinen listausreitti osastokohtaisille kirjauksille.
app.get('/api/records/:department', async (req, res, next) => {
    try {
        const department = normalizeDepartment(req.params.department);
        const { search = '', operator = '', product = '', line = '', equipment = '', from = '', to = '', limit = '100' } = req.query;

        const conditions = ['department = ?'];
        const params = [department];

        if (from) {
            conditions.push('record_date >= ?');
            params.push(from);
        }

        if (to) {
            conditions.push('record_date <= ?');
            params.push(to);
        }

        if (operator) {
            conditions.push('operator_name = ?');
            params.push(operator);
        }

        if (product && department !== 'separointi') {
            conditions.push('product = ?');
            params.push(product);
        }

        if (line && department === 'pakkaamo') {
            conditions.push('line_name = ?');
            params.push(line);
        }

        if (equipment && department === 'separointi') {
            conditions.push('equipment_name = ?');
            params.push(equipment);
        }

        if (search) {
            const searchTerm = `%${String(search).toLowerCase()}%`;
            conditions.push(`(
                LOWER(COALESCE(product, '')) LIKE ? OR
                LOWER(COALESCE(operator_name, '')) LIKE ? OR
                LOWER(COALESCE(notes, '')) LIKE ? OR
                LOWER(COALESCE(line_name, '')) LIKE ? OR
                LOWER(COALESCE(equipment_name, '')) LIKE ?
            )`);
            params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
        }

        const safeLimit = Math.min(Math.max(Number(limit) || 100, 1), 500);
        params.push(safeLimit);

        const rows = await query(
            `SELECT *
             FROM production_records
             WHERE ${conditions.join(' AND ')}
             ORDER BY record_date DESC, record_time DESC, id DESC
             LIMIT ?`,
            params,
        );

        res.json({
            department,
            data: rows.map(toApiRecord),
        });
    } catch (error) {
        next(error);
    }
});

// Palauttaa pudotusvalikoissa käytettäviä uniikkeja arvoja.
app.get('/api/records/:department/filters', async (req, res, next) => {
    try {
        const department = normalizeDepartment(req.params.department);

        const [productRows, operatorRows, lineRows, equipmentRows] = await Promise.all([
            query('SELECT DISTINCT product AS value FROM production_records WHERE department = ? AND product IS NOT NULL AND product <> "" ORDER BY value', [department]),
            query('SELECT DISTINCT operator_name AS value FROM production_records WHERE department = ? AND operator_name IS NOT NULL AND operator_name <> "" ORDER BY value', [department]),
            query('SELECT DISTINCT line_name AS value FROM production_records WHERE department = ? AND line_name IS NOT NULL AND line_name <> "" ORDER BY value', [department]),
            query('SELECT DISTINCT equipment_name AS value FROM production_records WHERE department = ? AND equipment_name IS NOT NULL AND equipment_name <> "" ORDER BY value', [department]),
        ]);

        res.json({
            products: productRows.map((row) => row.value),
            operators: operatorRows.map((row) => row.value),
            lines: lineRows.map((row) => row.value),
            equipment: equipmentRows.map((row) => row.value),
        });
    } catch (error) {
        next(error);
    }
});

// Tallentaa yhden tuotantokirjauksen oikeaan osastotauluun.
app.post('/api/records/:department', async (req, res, next) => {
    try {
        const department = normalizeDepartment(req.params.department);
        const body = req.body || {};

        const missing = departmentConfig[department].required.filter((field) => {
            const value = body[field];
            return value === undefined || value === null || String(value).trim() === '';
        });

        if (missing.length > 0) {
            return res.status(400).json({ message: `Puuttuvat kentät: ${missing.join(', ')}` });
        }

        const payload = buildRecordPayload(department, body);

        const [result] = await pool.execute(
            `INSERT INTO production_records
                (department, record_date, record_time, product, amount, temperature, duration_min, packages_count, weight_kg, line_name, fat_percentage, equipment_name, operator_name, notes)
             VALUES
                (:department, :record_date, :record_time, :product, :amount, :temperature, :duration_min, :packages_count, :weight_kg, :line_name, :fat_percentage, :equipment_name, :operator_name, :notes)`,
            payload,
        );

        const insertedRows = await query('SELECT * FROM production_records WHERE id = ? LIMIT 1', [result.insertId]);

        res.status(201).json({
            message: 'Kirjaus tallennettu',
            record: toApiRecord(insertedRows[0]),
        });
    } catch (error) {
        next(error);
    }
});

// Palauttaa virheen, jos reittiä ei löytynyt.
app.use((req, res) => {
    res.status(404).json({ message: 'Reittiä ei löytynyt' });
});

// Keskitetty virhekäsittelijä, jotta kaikki API-virheet palaavat siistinä JSONina.
app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
        message: error.message || 'Tuntematon virhe',
    });
});

// Käynnistetään palvelin vasta sen jälkeen, kun MySQL-yhteys on todettu toimivaksi.
pool.getConnection()
    .then((connection) => {
        connection.release();
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error('Virhe tietokantayhteydessä:', error);
        process.exitCode = 1;
    });