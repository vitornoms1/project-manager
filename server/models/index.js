const User = require('./User');
const Project = require('./Project');
const Task = require('./Task');

// A User can own many Projects
User.hasMany(Project, { foreignKey: 'ownerId', onDelete: 'CASCADE' });
Project.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });

// A Project has many Tasks
Project.hasMany(Task, { foreignKey: 'projectId', onDelete: 'CASCADE' });
Task.belongsTo(Project, { foreignKey: 'projectId' });

// A User can be assigned to many Tasks
User.hasMany(Task, { foreignKey: 'assignedToId', onDelete: 'SET NULL' });
Task.belongsTo(User, { as: 'assignedTo', foreignKey: 'assignedToId' });


module.exports = {
  User,
  Project,
  Task
};