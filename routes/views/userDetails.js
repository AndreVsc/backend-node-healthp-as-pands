const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

router.get('/userDetails', (req, res) => {
    const query = 'SELECT * FROM UserDetails';
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Erro ao buscar UserDetails:', error);
            return res.status(500).json({ error: 'Erro ao buscar UserDetails' });
        }
        res.status(200).json(results);
    });
});

module.exports = router;
