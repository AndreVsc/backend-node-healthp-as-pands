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
    port: process.env.DB_PORT,
});

// Rota para obter dados do usuário logado
router.get('/profile', authenticateJWT, (req, res) => {
    const userId = req.user.id;

    connection.query(`
        SELECT
            email,
            nome, 
            peso, 
            dataNasc, 
            idTipoDeUsuario,
            CalculateAge(dataNasc) AS idade,
            GetUserType(idTipoDeUsuario) AS tipo
        FROM Usuario
        WHERE idUsuario = ?`, [userId], (error, results) => {
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

// Rota para deletar o usuário
router.delete('/delete', authenticateJWT, (req, res) => {
    const userId = req.user.id;
  
    if (!userId) {
      console.error('ID do usuário não fornecido');
      return res.status(400).json({ error: 'ID do usuário é obrigatório' });
    }
  
    // Primeiro, exclua registros relacionados na tabela AguaRegistro
    connection.query('DELETE FROM AguaRegistro WHERE idUsuario = ?', [userId], (error) => {
      if (error) {
        console.error('Erro ao excluir registros relacionados na tabela AguaRegistro:', error);
        return res.status(500).json({ error: 'Erro ao excluir registros relacionados' });
      }
  
      // Em seguida, exclua o usuário
      connection.query('DELETE FROM Usuario WHERE idUsuario = ?', [userId], (error, results) => {
        if (error) {
          console.error('Erro ao executar query de exclusão:', error);
          return res.status(500).json({ error: 'Erro ao deletar o usuário', details: error.message });
        }
        
        if (results.affectedRows === 0) {
          console.error('Nenhum usuário encontrado para exclusão:', userId);
          return res.status(404).json({ error: 'Usuário não encontrado' });
        }
  
        res.status(200).json({ message: 'Usuário deletado com sucesso!' });
      });
    });
  });
  
  

// Rota para criar um registro de água para o usuário logado
router.post('/create-water-record', authenticateJWT, (req, res) => {
    const { tamanhoCopo } = req.body;
    const userId = req.user.id;

    if (tamanhoCopo == null) {
        return res.status(400).json({ error: 'Tamanho do copo é obrigatório' });
    }

    connection.query('INSERT INTO AguaRegistro (tamanhoCopo, idUsuario) VALUES (?, ?)', [tamanhoCopo, userId], (error, results) => {
        if (error) {
            console.error('Erro ao criar registro de água:', error);
            return res.status(500).json({ error: 'Erro ao criar registro de água' });
        }
        res.status(201).json({ message: 'Registro de água criado com sucesso!' });
    });
});

// Rota para obter o registro de água do usuário logado
router.get('/water-record', authenticateJWT, (req, res) => {
    const userId = req.user.id;

    connection.query('SELECT * FROM AguaRegistro WHERE idUsuario = ?', [userId], (error, results) => {
        if (error) {
            console.error('Erro ao obter registro de água:', error);
            return res.status(500).json({ error: 'Erro ao obter registro de água' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Registro de água não encontrado' });
        }

        res.json(results[0]);
    });
});

// Rota para atualizar a ingestão de água
router.post('/update-water', authenticateJWT, (req, res) => {
    const { day, amount } = req.body;
    const userId = req.user.id;

    if (!day || !amount) {
        return res.status(400).json({ error: 'Dia e quantidade são obrigatórios' });
    }

    connection.query('CALL UpdateWaterIntake(?, ?, ?)', [userId, day, amount], (error, results) => {
        if (error) {
            console.error('Erro ao atualizar ingestão de água:', error);
            return res.status(500).json({ error: 'Erro ao atualizar ingestão de água' });
        }
        res.json({ message: 'Ingestão de água atualizada com sucesso!' });
    });
});


// Rota para obter os dados de ingestão de água
router.get('/water-data', authenticateJWT, (req, res) => {
    const userId = req.user.id;

    connection.query('SELECT * FROM AguaRegistro WHERE idUsuario = ?', [userId], (error, results) => {
        if (error) {
            console.error('Erro ao obter dados de ingestão de água:', error);
            return res.status(500).json({ error: 'Erro ao obter dados de ingestão de água' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Dados de ingestão de água não encontrados' });
        }

        res.json(results[0]);
    });
});


module.exports = router;
