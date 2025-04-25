const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const connectDB = require('./config/db');
const session = require('express-session');

connectDB(); // Connect to the database

const app = express();
app.use(express.json()); // Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());
// app.use(express.static('public')); // optional for frontend files

app.use(session({
  secret: 'supersecretkey123', // Change this to a strong secret key in production
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
})); 

const authRoutes = require('./routes/authRoute'); // Import auth routes

app.use('/api/auth', authRoutes); // Use auth routes

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
