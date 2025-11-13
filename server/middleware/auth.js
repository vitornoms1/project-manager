// server/middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req, res, next) {
  // Pega o token do header
  const authHeader = req.header('Authorization');

  // Verifica se existe o header Authorization e se começa com Bearer
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Nenhum token, autorização negada.' });
  }

  // Extrai o token (remove o "Bearer ")
  const token = authHeader.split(' ')[1];

  // Verifica se não há token após extrair
  if (!token) {
    return res.status(401).json({ msg: 'Formato de token inválido, autorização negada.' });
  }

  try {
    // Verifica o token usando o segredo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adiciona o payload do usuário (que contém o id) ao objeto req
    req.user = decoded.user;
    next(); // Passa para a próxima função (a rota /me)
  } catch (err) {
    res.status(401).json({ msg: 'Token inválido.' });
  }
};