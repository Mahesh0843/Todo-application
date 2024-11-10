const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const path = require('path'); 
dotenv.config();

connectDB()
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1); 
  });

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
  res.send('Welcome to the Task Manager API!');
});

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

console.log('Database URL:', process.env.DATABASE_URL);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
