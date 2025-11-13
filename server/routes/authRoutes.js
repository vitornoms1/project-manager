const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Certifique-se que o caminho está correto
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config(); // Carrega variáveis do .env, como JWT_SECRET

// Rota de Registro
router.post('/register', async (req, res) => {
  // 1. Extrai os dados do corpo da requisição
  const { name, email, password } = req.body;

  // Validação básica (pode ser aprimorada)
  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Por favor, inclua nome, email e senha.' });
  }

  try {
    // 2. Verifica se o usuário já existe
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ msg: 'Usuário já existe com este email.' });
    }

    // 3. Cria o novo usuário no banco de dados
    // O hook beforeCreate no modelo User.js cuidará do hash da senha
    user = await User.create({
      name,
      email,
      password, // Passa a senha em texto plano, o hook fará o hash
    });

    // 4. Cria o payload para o token JWT
    const payload = {
      user: {
        id: user.id, // Inclui o ID do usuário no token
      },
    };

    // 5. Assina o token JWT
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Usa a chave secreta do seu arquivo .env
      { expiresIn: '5h' }, // Define a expiração do token (ajuste conforme necessário)
      (err, token) => {
        if (err) throw err;
        // 6. Envia o token (e opcionalmente os dados do usuário) como resposta
        res.status(201).json({ // Status 201 Created
          token,
          user: { // Enviar dados básicos do usuário pode ser útil para o frontend
            id: user.id,
            name: user.name,
            email: user.email
          }
        });
      }
    );
  } catch (err) {
    console.error('Erro no registro:', err.message);
    res.status(500).send('Erro no servidor');
  }
});

// Rota de Login (seu código existente)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ msg: 'Por favor, inclua email e senha.' });
  }

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
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Usa a chave secreta do .env aqui também
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        // Retorna também os dados do usuário no login
        res.json({ 
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email
          } 
        });
      }
    );
  } catch (err) {
    console.error('Erro no login:', err.message);
    res.status(500).send('Erro no servidor');
  }
});

// Rota GET /auth/me (para validar token e buscar dados do usuário)
// ADICIONADO: Esta rota é usada pelo useEffect do AuthContext
const authMiddleware = require('../middleware/auth'); // Você precisará criar este middleware
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // req.user é adicionado pelo authMiddleware após validar o token
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] } // Não envia a senha de volta
    });
    if (!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado.' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});


module.exports = router;