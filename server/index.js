const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Import all models and their associations
require('./models');

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes')); // <-- Add the new task routes

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the TaskFlow API!' });
});

const PORT = process.env.PORT || 5000;

// Sync all defined models to the DB and then start the server
sequelize.sync() 
  .then(() => {
    console.log('Database & tables synchronized.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => console.error('Failed to sync database:', err));