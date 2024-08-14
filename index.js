const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const reminderRoutes = require('./routes/reminder');

//Views
const userDetailsRoutes = require('./routes/views/userDetails');
const weightRoutes = require('./routes/views/averageWeightByType');
const heavyUserRoutes = require('./routes/views/heavyUsers');
const exerciseRoutes = require('./routes/views/exerciseDetails');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/reminder', reminderRoutes);
app.use('/views', userDetailsRoutes);
app.use('/views', weightRoutes);
app.use('/views', heavyUserRoutes);
app.use('/views', exerciseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
