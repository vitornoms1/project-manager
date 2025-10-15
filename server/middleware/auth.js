const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // 1. Pega o token do cabeçalho da requisição
  const token = req.header('x-auth-token');

  // 2. Se não houver token, recusa o acesso
  if (!token) {
    return res.status(401).json({ msg: 'Nenhum token, autorização negada.' });
  }

  // 3. Se houver token, verifica se ele é válido
  try {
    const decoded = jwt.verify(token, 'seu_segredo_jwt'); // Usa o mesmo segredo
    req.user = decoded.user; // Adiciona os dados do usuário (ex: id) ao objeto da requisição
    next(); // Permite que a requisição continue para a rota principal
  } catch (err) {
    res.status(401).json({ msg: 'Token inválido.' });
  }
};