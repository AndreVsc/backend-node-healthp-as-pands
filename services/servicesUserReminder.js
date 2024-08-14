const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

dotenv.config();

// Criar o pool de conexões
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Função para atualizar o peso do usuário e o horário final do lembrete
async function updateUserAndReminder(userId, newWeight, newReminderTime) {
  const connection = await pool.getConnection(); // Obter uma conexão do pool
  try {
    await connection.beginTransaction();

    // Atualizar o peso do usuário
    await connection.query(
      'UPDATE Usuario SET peso = ? WHERE idUsuario = ?',
      [newWeight, userId]
    );

    // Atualizar o horário final de um lembrete associado ao usuário
    await connection.query(
      'UPDATE Lembrete SET horarioFinal = ? WHERE idUsuario = ?',
      [newReminderTime, userId]
    );

    // Confirmar a transação
    await connection.commit();
    console.log('Transação concluída com sucesso');
  } catch (error) {
    // Reverter a transação em caso de erro
    await connection.rollback();
    console.error('Erro ao realizar a transação:', error);
  } finally {
    // Libere a conexão de volta ao pool
    connection.release();
  }
}

module.exports = {
  updateUserAndReminder
};