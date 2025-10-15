const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

// Definimos o modelo 'User' que representa a tabela 'users' no banco de dados
const User = sequelize.define('User', {
  // Definimos as colunas da tabela
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Garante que não haverá dois usuários com o mesmo email
    validate: {
      isEmail: true // Validação para garantir que o formato é de um email
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

User.beforeCreate(async (user, options) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

module.exports = User;