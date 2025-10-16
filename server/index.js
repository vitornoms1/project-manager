const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');


require('./models');

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


sequelize.sync() 
  .then(() => {
    console.log('Database & tables synchronized.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => console.error('Failed to sync database:', err));