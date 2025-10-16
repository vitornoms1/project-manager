const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  
  const token = req.header('x-auth-token');

  
  if (!token) {
    return res.status(401).json({ msg: 'Nenhum token, autorização negada.' });
  }

  
  try {
    const decoded = jwt.verify(token, 'seu_segredo_jwt'); 
    req.user = decoded.user; 
    next(); 
  } catch (err) {
    res.status(401).json({ msg: 'Token inválido.' });
  }
};