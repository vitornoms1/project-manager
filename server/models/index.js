const User = require('./User');
const Project = require('./Project');
const Task = require('./Task');


User.hasMany(Project, { foreignKey: 'ownerId', onDelete: 'CASCADE' });
Project.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });


Project.hasMany(Task, { foreignKey: 'projectId', onDelete: 'CASCADE' });
Task.belongsTo(Project, { foreignKey: 'projectId' });


User.hasMany(Task, { foreignKey: 'assignedToId', onDelete: 'SET NULL' });
Task.belongsTo(User, { as: 'assignedTo', foreignKey: 'assignedToId' });


module.exports = {
  User,
  Project,
  Task
};