const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const Project = require('../models/Project'); 
const Task = require('../models/Task');
const sequelize = require('../config/database');

// Rota para CRIAR um novo projeto (POST /api/projects)
router.post('/', auth, async (req, res) => {
  // 1. Adicionado 'dueDate' ao destructuring
  const { title, description, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ msg: 'O título do projeto é obrigatório.' });
  }

  try {
    const newProject = await Project.create({
      title,
      description,
      dueDate: dueDate || null, // 2. Adicionado 'dueDate' à criação
      ownerId: req.user.id
    });
    res.status(201).json(newProject);
  } catch (err) {
    console.error('Erro ao criar projeto:', err.message);
    res.status(500).send('Erro no servidor');
  }
});

// Rota para LISTAR os projetos do usuário logado (GET /api/projects)
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.findAll({ 
      where: { ownerId: req.user.id },
      order: [['createdAt', 'DESC']] 
    });
    res.json(projects);
  } catch (err) {
    console.error('Erro ao buscar projetos:', err.message);
    res.status(500).send('Erro no servidor');
  }
});

// Rota para BUSCAR UM projeto específico (GET /api/projects/:id)
router.get('/:id', auth, async (req, res) => {
    try {
        const project = await Project.findOne({
            where: {
                id: req.params.id,
                ownerId: req.user.id
            },
            include: [{
                model: Task,
            }]
        });

        if (!project) {
            return res.status(404).json({ msg: 'Projeto não encontrado ou acesso não autorizado.' });
        }

        res.json(project);
    } catch (err) {
        console.error('Erro ao buscar projeto:', err.message);
        res.status(500).send('Erro no servidor');
    }
});


// Rota para ATUALIZAR um projeto (PUT /api/projects/:id)
router.put('/:id', auth, async (req, res) => {
    // 1. Adicionado 'dueDate' ao destructuring
    const { title, description, dueDate } = req.body;
    
    if (!title) {
        return res.status(400).json({ msg: 'O título do projeto é obrigatório.' });
    }

    try {
        const project = await Project.findOne({
            where: {
                id: req.params.id,
                ownerId: req.user.id
            }
        });

        if (!project) {
            return res.status(404).json({ msg: 'Projeto não encontrado ou acesso não autorizado.' });
        }

        // 2. Atualiza os campos, incluindo 'dueDate'
        project.title = title;
        project.description = description;
        project.dueDate = dueDate || null; // Salva a data ou null se for removida
        await project.save();

        res.json(project); // Retorna o projeto atualizado
    } catch (err) {
        console.error('Erro ao atualizar projeto:', err.message);
        res.status(500).send('Erro no servidor');
    }
});


// Rota para DELETAR um projeto (DELETE /api/projects/:id)
router.delete('/:id', auth, async (req, res) => {
  const transaction = await sequelize.transaction(); 
  try {
    const project = await Project.findOne({
      where: {
        id: req.params.id,
        ownerId: req.user.id
      },
      transaction
    });

    if (!project) {
      await transaction.rollback();
      return res.status(404).json({ msg: 'Projeto não encontrado ou acesso não autorizado.' });
    }

    await project.destroy({ transaction });
    await transaction.commit();

    res.json({ msg: 'Projeto removido com sucesso.' });

  } catch (err) {
    await transaction.rollback();
    console.error('Erro ao deletar projeto:', err.message);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;