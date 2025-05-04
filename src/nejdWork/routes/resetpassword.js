const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const secret = process.env.RESET_TOKEN_SECRET || "your-reset-token-secret";

router.post('/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, secret);
    const user = await User.findOne({ identifiant: decoded.identifiant, email: decoded.email });
    console.log(user)

    if (!user || decoded.expires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    console.log(password)
    user.mot_de_passe = password; 

    await user.save();
    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid token" });
  }
});

module.exports = router;