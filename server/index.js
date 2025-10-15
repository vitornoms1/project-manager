const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

// ▼▼▼ ADICIONE ESTAS LINHAS AQUI ▼▼▼
// Definindo as rotas da API
app.use('/api/auth', require('./routes/authRoutes'));
// ▲▲▲ FIM DAS NOVAS LINHAS ▲▲▲

app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API de Gestão de Projetos!' });
});

const PORT = process.env.PORT || 5000;

sequelize.sync()
  .then(() => {
    console.log('Tabelas sincronizadas com o banco de dados.');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => console.error('Não foi possível sincronizar as tabelas:', err));