const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
// O 'require('../models')' puxa todos os modelos (incluindo Project e Task) do 'models/index.js'
const { Task, Project } = require('../models'); 
const sequelize = require('../config/database'); 

// Rota POST / (Criar Tarefa) - ATUALIZADA
router.post('/', auth, async (req, res) => {
  // 1. Adicionado 'dueDate' (e outros campos do modelo) ao destructuring
  const { title, description, priority, projectId, dueDate, status, assignedToId } = req.body;

  try {
    const project = await Project.findOne({ where: { id: projectId, ownerId: req.user.id } });
    if (!project) {
      return res.status(404).json({ msg: 'Project not found or you are not the owner.' });
    }

    const newTask = await Task.create({
      title,
      description,
      priority: priority || 'Medium', // Garante valor padrão
      status: status || 'To Do',       // Garante valor padrão
      projectId,
      dueDate: dueDate || null, // 2. Salva dueDate (ou null se não for enviado)
      assignedToId: assignedToId || null // Salva null se não for enviado
    });
    res.status(201).json(newTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Rota GET /project/:projectId (Listar Tarefas) - Sem alterações
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

// Rota PATCH /:id/status (Atualizar Status) - Sem alterações
router.patch('/:id/status', auth, async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  try {
    const task = await Task.findByPk(id, {
      include: { model: Project, attributes: ['ownerId'] }
    });

    if (!task) {
      return res.status(404).json({ msg: 'Task not found.' });
    }

    if (task.Project.ownerId !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized.' });
    }

    task.status = status;
    await task.save();

    res.json(task);
  } catch (err) {
    console.error('Error updating task status:', err.message);
    res.status(500).send('Server Error');
  }
});

// Rota PUT /:id (Atualizar Tarefa Completa) - ATUALIZADA
router.put('/:id', auth, async (req, res) => {
  // 1. Adicionado 'dueDate' ao destructuring
  const { title, description, status, priority, assignedToId, dueDate } = req.body;

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
    
    // 2. Adicionado 'dueDate' ao objeto de atualização
    await task.update({ 
      title, 
      description, 
      status, 
      priority, 
      assignedToId, 
      dueDate: dueDate || null // Salva a data ou null se for removida
    });

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Rota DELETE /:id (Deletar Tarefa) - Sem alterações
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