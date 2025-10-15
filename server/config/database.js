const { Sequelize } = require('sequelize');
require('dotenv').config(); // Carrega as variáveis do arquivo .env

// Cria uma nova instância do Sequelize para conectar ao banco de dados
const sequelize = new Sequelize(
  process.env.DB_NAME,   // Nome do banco de dados
  process.env.DB_USER,   // Usuário do banco de dados
  process.env.DB_PASS,   // Senha do banco de dados
  {
    host: process.env.DB_HOST, // O endereço do servidor do banco (seu computador)
    dialect: 'mysql'           // Informa ao Sequelize que estamos usando MySQL
  }
);

module.exports = sequelize;