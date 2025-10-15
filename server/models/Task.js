const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
  // Foreign Key for the Project this task belongs to
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Projects',
      key: 'id',
    }
  },
  // Foreign Key for the User this task is assigned to
  assignedToId: {
    type: DataTypes.INTEGER,
    allowNull: true, // A task might be unassigned initially
    references: {
      model: 'Users',
      key: 'id',
    }
  }
});

module.exports = Task;