const express = require('express');
const { register, verifyOtp, resendOtp, login, logout, dashboard } = require('../controllers/authcontroller');
const authMiddleware = require('../middleware/authmiddleware');

const router = express.Router();


router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/login', login);
router.get('/logout', authMiddleware, logout);
router.get('/dashboard', authMiddleware, dashboard);

module.exports = router;
