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
    port: process.env.DB_PORT,
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
                        return res.status(500).json({ error: 'Erro ao registrar usuário' });
                    }

                    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
                });
            } catch (err) {
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
    const { email , password } = req.body; 

    console.log('Login request body:', req.body);

    if ((!email) || !password) {
        return res.status(400).json({ error: 'Nome ou e-mail, e senha são obrigatórios' });
    }

    // Verificar credenciais
    const query = 'SELECT * FROM Usuario WHERE email = ?';

    connection.query(query, [email], async (error, results) => {
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




module.exports = router;
