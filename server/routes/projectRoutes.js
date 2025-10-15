const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Importamos nosso "guarda"
const Project = require('../models/Project'); // Importamos o modelo de projeto

// @route   POST /api/projects
// @desc    Cria um novo projeto
// @access  Private (Protegido)
router.post('/', auth, async (req, res) => {
  const { title, description } = req.body;

  try {
    const newProject = await Project.create({
      title,
      description,
      ownerId: req.user.id // O ID do usuário vem do nosso middleware 'auth'
    });
    res.status(201).json(newProject);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

// @route   GET /api/projects
// @desc    Busca todos os projetos do usuário logado
// @access  Private (Protegido)
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.findAll({ 
      where: { ownerId: req.user.id },
      order: [['createdAt', 'DESC']] // Ordena pelos mais recentes
    });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;