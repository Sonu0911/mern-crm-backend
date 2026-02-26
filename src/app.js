require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// app.use(cors({ 
//   origin: ['http://localhost:5173', 'https://mern-crm-frontend.vercel.app'], 
//   credentials: true 
// }));
app.use(cors({ 
  origin: ['http://localhost:5173', 'mern-crm-frontend-chi.vercel.app'], 
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const activityRoutes = require('./routes/activityRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/activities', activityRoutes);

module.exports = app;