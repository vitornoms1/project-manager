const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const Project = require('../models/Project'); 




router.post('/', auth, async (req, res) => {
  const { title, description } = req.body;

  try {
    const newProject = await Project.create({
      title,
      description,
      ownerId: req.user.id 
    });
    res.status(201).json(newProject);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});




router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.findAll({ 
      where: { ownerId: req.user.id },
      order: [['createdAt', 'DESC']] 
    });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;