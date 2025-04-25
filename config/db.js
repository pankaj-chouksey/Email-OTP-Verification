const mongoose = require('mongoose');
const User = require('../models/usermodel');

const MONGO_URI = 'mongodb://localhost:27017/your_database_name'; // Replace with your MongoDB URI

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit the process with failure
    }

};

connectDB();

module.exports = connectDB;
// This is a placeholder for the database connection. You can add more configurations as needed.
    