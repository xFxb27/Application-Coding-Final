const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = 3000;

// MySQL connection pool setup
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'fabio',  // Ändern Sie dies zu Ihrem MySQL-Benutzernamen
    password: 'ApplicationCoding',  // Ändern Sie dies zu Ihrem MySQL-Passwort
    database: 'taschenrechner'  // Ändern Sie dies zu Ihrem Datenbanknamen
});

app.use(bodyParser.json());
app.use(express.static('public'));

// Endpoint to save calculations
app.post('/save-calculation', (req, res) => {
    const { expression, result } = req.body;
    const query = 'INSERT INTO CalculationHistory (expression, result) VALUES (?, ?)';
    
    pool.query(query, [expression, result], (error, results, fields) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.status(200).send({ id: results.insertId });
    });
});

// Endpoint to fetch last 10 calculations
app.get('/get-history', (req, res) => {
    const query = 'SELECT expression, result FROM CalculationHistory ORDER BY created_at DESC LIMIT 10';
    pool.query(query, (error, results, fields) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.status(200).send(results);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
