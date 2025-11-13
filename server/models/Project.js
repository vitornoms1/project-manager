const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // Nome da tabela no banco
      key: 'id',
    }
  },
  // ===== CAMPO ADICIONADO AQUI =====
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true, // Data de entrega é opcional para projetos
  }
  // ================================
});

module.exports = Project;