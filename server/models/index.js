'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const db = {};
const basename = path.basename(__filename);

// Carrega todos os modelos do diretório atual
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file));
    if (model && model.prototype instanceof Sequelize.Model) {
        db[model.name] = model;
    } else {
        console.warn(`File ${file} does not export a Sequelize model, skipping.`);
    }
  });

// ===== ASSOCIAÇÕES DEFINIDAS AQUI =====
// Depois que TODOS os modelos foram carregados em 'db', podemos definir as associações.
Object.keys(db).forEach(modelName => {
  // Verifica se o modelo tem um método estático 'associate' (padrão comum)
  // Se não tiver, definimos as associações diretamente aqui.
  
  // Exemplo: Definindo associações explicitamente
  if (modelName === 'Project') {
    db.Project.belongsTo(db.User, { foreignKey: 'ownerId', as: 'owner' });
    db.Project.hasMany(db.Task, { foreignKey: 'projectId', onDelete: 'CASCADE' });
  }
  if (modelName === 'Task') {
    db.Task.belongsTo(db.Project, { foreignKey: 'projectId' });
    db.Task.belongsTo(db.User, { foreignKey: 'assignedToId', as: 'assignee' });
  }
  if (modelName === 'User') {
    db.User.hasMany(db.Project, { foreignKey: 'ownerId', onDelete: 'CASCADE' });
    db.User.hasMany(db.Task, { foreignKey: 'assignedToId', onDelete: 'SET NULL' });
  }

});
// =====================================

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;