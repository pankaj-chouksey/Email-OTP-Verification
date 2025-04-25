const User = require('../models/usermodel');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

//Email Transporter setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'pankajchouksey521@gmail.com',
    pass: 'carzghcraqqztndz',
  },
});

//Generate otp
const generateOtp = () => crypto.randomInt(100000, 999999).toString();

//Send otp to email
exports.register = async (req, res) => {
try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) 
      return res.status(400).json({ message: 'User already exists' });

      const otp = generateOtp();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
      
      user = new User({ name, email, password, otp, otpExpiry });
      await user.save();

      await transporter.sendMail({
        from: 'pankajchouksey521@gmail.com',
        to: email,
        subject: 'OTP verification',
        text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
      });

        return res.status(200).json({ message: 'User registered. Please verify OTP sent to your email' });
    

} catch (error) {
    return res.status(500).json({ message: 'Error resgistering user', error });
  }
};

//Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'User already verified' });

    if (user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return res.status(200).json({ message: 'Email verified successfully. You can now login.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error verifying OTP', error });
  }
};

//Resend OTP
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'User already verified' });
    
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    await user.save();

    await transporter.sendMail({
      from: 'pankajchouksey521@gmail.com',
      to: email,
      subject: 'OTP Resend',
      text: `Your new OTP code is ${otp}. It is valid for 10 minutes.`,
    });

    return res.status(200).json({ message: 'New OTP sent to your email' });
  } catch (error) {
    return res.status(500).json({ message: 'Error resending OTP', error });
  } 
};

//Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'User not found' });
    if (user.password !== password) return res.status(400).json({ message: 'Incorrect password' });

    if (!user.isVerified) { 
        res.status(400).json({ message: 'Email not verified. Please verify OTP' });
  }

  req.session.user = { id: user._id, email: user.email, name: user.name };
  res.json({ message: 'Login successful'});

  
  } catch (error) {
    return res.status(500).json({ message: 'Error logging in', error });
  }
};

//Logout user
exports.logout =  (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out', error: err });
        }
        return res.status(200).json({ message: 'Logout successful' });
    });
};

//Dashboard (protected route)
exports.dashboard = async (req, res) => {
    res.json({ message: 'Welcome to the dashboard', user: req.session.user });  
};
  

    