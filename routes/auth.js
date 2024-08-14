const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
require('dotenv').config();

const router = express.Router();

// Configuração do banco de dados
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Função para gerar um token JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user.idUsuario, email: user.email }, // Payload com o ID e e-mail do usuário
        process.env.JWT_SECRET, // Chave secreta para assinar o token
        { expiresIn: process.env.JWT_EXPIRES_IN } // Tempo de expiração do token
    );
};

// Rota para registro de usuário
router.post('/register', async (req, res) => {
    const { nome, peso, dataNasc, email, idTipoDeUsuario, senha } = req.body;

    console.log('Corpo da requisição:', req.body);

    if (!nome || !peso || !dataNasc || !email || !senha || !idTipoDeUsuario) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    try {
        // Verificar se o e-mail já está em uso
        connection.query('SELECT * FROM Usuario WHERE email = ?', [email], async (error, results) => {
            if (error) {
                console.error('Erro ao verificar e-mail:', error);
                return res.status(500).json({ error: 'Erro ao verificar e-mail' });
            }

            if (results.length > 0) {
                return res.status(400).json({ error: 'E-mail já cadastrado' });
            }

            try {
                // Hash da senha com 10 rounds de salt
                const hashedPassword = await bcrypt.hash(senha, 10);

                // Inserir novo usuário usando a PROCEDURE armazenada
                connection.query('CALL AddUser(?, ?, ?, ?, ?, ?)', [nome, email, peso, dataNasc, idTipoDeUsuario, hashedPassword], (error) => {
                    if (error) {
                        console.error('Erro ao registrar usuário:', error);
                        return res.status(500).json({ error: 'Erro ao registrar usuário' });
                    }

                    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
                });
            } catch (err) {
                console.error('Erro ao processar a senha:', err);
                res.status(500).json({ error: 'Erro ao processar a senha' });
            }
        });
    } catch (err) {
        console.error('Erro inesperado:', err);
        res.status(500).json({ error: 'Erro inesperado' });
    }
});


// Rota para login de usuário
router.post('/login', (req, res) => {
    const { email, nome, password } = req.body; // Altere 'senha' para 'password'

    console.log('Login request body:', req.body); // Log para depuração

    if ((!email && !nome) || !password) {
        return res.status(400).json({ error: 'Nome ou e-mail, e senha são obrigatórios' });
    }

    // Verificar credenciais
    const query = email ? 'SELECT * FROM Usuario WHERE email = ?' : 'SELECT * FROM Usuario WHERE nome = ?';
    const identifier = email || nome;

    connection.query(query, [identifier], async (error, results) => {
        if (error) {
            console.error('Erro no servidor:', error);
            return res.status(500).json({ error: 'Erro no servidor' });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const user = results[0];
        try {
            const match = await bcrypt.compare(password, user.senha);

            if (!match) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            // Gerar e retornar token
            const token = generateToken(user);
            res.json({ token });
        } catch (err) {
            console.error('Erro ao comparar a senha:', err);
            res.status(500).json({ error: 'Erro ao comparar a senha' });
        }
    });
});


// Rota para pesquisar usuarios
router.get('/user/:id', (req, res) => {
    const userId = req.params.id;

    // Verificar se o ID do usuário foi fornecido
    if (!userId) {
        return res.status(400).json({ error: 'ID do usuário é obrigatório' });
    }

    // Consultar usuário e aplicar FUNCTIONS para obter idade e tipo
    connection.query(`
        SELECT 
            nome, 
            peso, 
            dataNasc, 
            idTipoDeUsuario,
            CalculateAge(dataNasc) AS idade,
            GetUserType(idTipoDeUsuario) AS tipo
        FROM Usuario
        WHERE idUsuario = ?`, [userId], (error, results) => {
        if (error) {
            console.error('Erro ao obter detalhes do usuário:', error);
            return res.status(500).json({ error: 'Erro ao obter detalhes do usuário' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const user = results[0];
        res.json(user);
    });
});


module.exports = router;
