const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // <-- Precisamos do bcrypt para comparar as senhas

// Rota de Registro... (código que você já tem)
router.post('/register', async (req, res) => {
  // ... seu código de registro aqui ...
});

// ▼▼▼ ADICIONE O CÓDIGO ABAIXO ▼▼▼

// @route   POST /api/auth/login
// @desc    Autentica um usuário e retorna o token
// @access  Public
router.post('/login', async (req, res) => {
  // 1. Extrai email e senha do corpo da requisição
  const { email, password } = req.body;

  try {
    // 2. Verifica se o usuário com este email existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: 'Credenciais inválidas.' }); // Mensagem genérica por segurança
    }

    // 3. Compara a senha enviada com a senha criptografada no banco
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciais inválidas.' }); // Mesma mensagem genérica
    }

    // 4. Se as senhas correspondem, cria e retorna um token JWT
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      'seu_segredo_jwt', // Lembre-se de mudar isso para uma variável de ambiente!
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

// ▲▲▲ FIM DO NOVO CÓDIGO ▲▲▲

module.exports = router;