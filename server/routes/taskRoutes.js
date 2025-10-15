const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Task, Project } = require('../models'); // Import from the central models/index.js

// @route   POST /api/tasks
// @desc    Create a new task for a specific project
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, description, priority, projectId } = req.body;

  try {
    // Security check: ensure the user owns the project they're adding a task to
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

// @route   GET /api/tasks/project/:projectId
// @desc    Get all tasks for a specific project
// @access  Private
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    // Security check: ensure the user owns the project they're trying to view
    const project = await Project.findOne({ where: { id: req.params.projectId, ownerId: req.user.id } });
    if (!project) {
      return res.status(404).json({ msg: 'Project not found or you are not the owner.' });
    }
    
    const tasks = await Task.findAll({
      where: { projectId: req.params.projectId },
      order: [['createdAt', 'ASC']]
    });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;