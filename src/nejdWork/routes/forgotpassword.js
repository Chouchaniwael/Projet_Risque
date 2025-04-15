const express = require("express");
const User = require("../../models/User");
const router = express.Router();
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'testmailsenderspringboot@gmail.com',
      pass: 'eqyi dvnm cypi skrc'
    }
  });

const { generateResetToken } = require("../models/token");

router.post('/', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { token, expires } = generateResetToken(user);
    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();

    const resetUrl = `http://localhost:3000/authentication/reset-password/${token}`;

    // Send reset link with the token
    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    });

    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;