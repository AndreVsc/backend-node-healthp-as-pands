const express = require('express');
const authenticateJWT = require('../middleware/authMiddleware');
const { updateUserAndReminder } = require("../services/servicesUserReminder");
const mysql = require('mysql2');
require('dotenv').config();

const router = express.Router();

// Configuração do banco de dados (você pode reutilizar a configuração existente)
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Rota para obter dados do usuário logado
router.get('/profile', authenticateJWT, (req, res) => {
    const userId = req.user.id;

    connection.query('SELECT nome, peso, dataNasc, email FROM Usuario WHERE idUsuario = ?', [userId], (error, results) => {
        if (error) {
            console.error('Erro ao obter dados do usuário:', error);
            return res.status(500).json({ error: 'Erro ao obter dados do usuário' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.json(results[0]);
    });
});

// Rota para atualizar o peso do usuário
router.post('/update-weight', authenticateJWT, (req, res) => {
    const { novoPeso } = req.body;
    const userId = req.user.id;

    if (novoPeso == null) {
        return res.status(400).json({ error: 'Novo peso é obrigatório' });
    }

    connection.query('CALL UpdateUserWeight(?, ?)', [userId, novoPeso], (error, results) => {
        if (error) {
            console.error('Erro ao atualizar peso do usuário:', error);
            return res.status(500).json({ error: 'Erro ao atualizar peso do usuário' });
        }
        res.json({ message: 'Peso atualizado com sucesso!' });
    });
});

// Rota para atualizar o lembrete
router.put('/updateUserAndReminder', async (req, res) => {
    const { userId, newWeight, newReminderTime } = req.body;
  
    if (!userId || !newWeight || !newReminderTime) {
      return res.status(400).json({ message: 'Parâmetros inválidos' });
    }
  
    try {
      await updateUserAndReminder(userId, newWeight, newReminderTime);
      res.status(200).json({ message: 'Atualização bem-sucedida' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar os dados', error });
    }
});

module.exports = router;
