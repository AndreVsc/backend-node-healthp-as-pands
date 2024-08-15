const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const router = express.Router();

// Configuração do banco de dados
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

// Rota para adicionar lembrete
router.post('/reminder', (req, res) => {

    const { idUsuario, descricao, horarioFinal } = req.body;

    if (!idUsuario || !descricao || !horarioFinal) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const query = 'INSERT INTO Lembrete (idUsuario, descricao, horarioFinal) VALUES (?, ?, ?)';
    connection.query(query, [idUsuario, descricao, horarioFinal], (error, results) => {
        if (error) {
            console.error('Erro ao adicionar lembrete:', error);
            return res.status(500).json({ error: 'Erro ao adicionar lembrete' });
        }
        res.status(201).json({ message: 'Lembrete adicionado com sucesso!' });
    });
});

// Rota para atualizar lembrete
router.put('/reminder/:id', (req, res) => {
    const { horarioFinal } = req.body;
    const idLembrete = req.params.id;

    if (!horarioFinal) {
        return res.status(400).json({ error: 'O horário final é obrigatório' });
    }

    const query = 'UPDATE Lembrete SET horarioFinal = ? WHERE idLembrete = ?';
    connection.query(query, [horarioFinal, idLembrete], (error, results) => {
        if (error) {
            console.error('Erro ao atualizar lembrete:', error);
            return res.status(500).json({ error: 'Erro ao atualizar lembrete' });
        }
        res.status(200).json({ message: 'Lembrete atualizado com sucesso!' }); // GATILHO
    });
});

module.exports = router;
