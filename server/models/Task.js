const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
// Removidas as linhas: const Project = require('./Project');
// Removidas as linhas: const User = require('./User');

const Task = sequelize.define('Task', {
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
  status: {
    type: DataTypes.ENUM('To Do', 'In Progress', 'Done'),
    allowNull: false,
    defaultValue: 'To Do',
  },
  priority: {
    type: DataTypes.ENUM('Low', 'Medium', 'High'),
    allowNull: false,
    defaultValue: 'Medium',
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  projectId: { // A definição da coluna com 'references' é mantida
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Projects', // Nome da tabela
      key: 'id',
    }
  },
  assignedToId: { // A definição da coluna com 'references' é mantida
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users', // Nome da tabela
      key: 'id',
    }
  }
});

// Removido o bloco de associações Task.belongsTo(...)

module.exports = Task;