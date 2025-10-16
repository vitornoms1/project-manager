const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 


router.post('/register', async (req, res) => {
  
});






router.post('/login', async (req, res) => {
  
  const { email, password } = req.body;

  try {
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: 'Credenciais inválidas.' }); 
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciais inválidas.' }); 
    }

    
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      'seu_segredo_jwt', 
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});



module.exports = router;