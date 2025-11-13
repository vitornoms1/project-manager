const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

require('./models'); // Isso carrega os modelos, incluindo o Project.js atualizado

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes')); 

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the TaskFlow API!' });
});

const PORT = process.env.PORT || 5000;

// ===== ALTERAÇÃO AQUI =====
// Adicionado { alter: true }
// Isso irá comparar os modelos com o banco e adicionar a coluna 'dueDate'
// na tabela 'Projects' sem apagar nenhum dado.
sequelize.sync({ alter: true }) 
  .then(() => {
    console.log('Database & tables altered (if needed) and synchronized.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => console.error('Failed to sync database:', err));