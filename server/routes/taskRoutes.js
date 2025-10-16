const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Task, Project } = require('../models');
const sequelize = require('../config/database'); 




router.post('/', auth, async (req, res) => {
  const { title, description, priority, projectId } = req.body;

  try {
    
    const project = await Project.findOne({ where: { id: projectId, ownerId: req.user.id } });
    if (!project) {
      return res.status(404).json({ msg: 'Project not found or you are not the owner.' });
    }

    const newTask = await Task.create({
      title,
      description,
      priority,
      projectId,
    });
    res.status(201).json(newTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});




router.get('/project/:projectId', auth, async (req, res) => {
  try {
    
    const project = await Project.findOne({ where: { id: req.params.projectId, ownerId: req.user.id } });
    if (!project) {
      return res.status(404).json({ msg: 'Project not found or you are not the owner.' });
    }
    
    const tasks = await Task.findAll({
      where: { projectId: req.params.projectId },
      
      order: [
        
        sequelize.literal(`
          CASE
            WHEN priority = 'High' THEN 1
            WHEN priority = 'Medium' THEN 2
            WHEN priority = 'Low' THEN 3
            ELSE 4
          END
        `),
        
        ['createdAt', 'ASC']
      ]
    });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});




router.put('/:id', auth, async (req, res) => {
  const { title, description, status, priority, assignedToId } = req.body;

  try {
    const task = await Task.findByPk(req.params.id, {
      include: { model: Project, attributes: ['ownerId'] }
    });

    if (!task) {
      return res.status(404).json({ msg: 'Task not found.' });
    }

    
    if (task.Project.ownerId !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized.' });
    }

    
    await task.update({ title, description, status, priority, assignedToId });

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});




router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: { model: Project, attributes: ['ownerId'] }
    });

    if (!task) {
      return res.status(404).json({ msg: 'Task not found.' });
    }

    
    if (task.Project.ownerId !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized.' });
    }

    await task.destroy();

    res.json({ msg: 'Task removed.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;