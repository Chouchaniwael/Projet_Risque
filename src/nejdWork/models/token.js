const jwt = require("jsonwebtoken");

const secret = process.env.RESET_TOKEN_SECRET || "your-reset-token-secret";

/**
 * Generate a reset password JWT with user info
 * @param {Object} user - user object (like {_id, email})
 * @returns {{ token: string, expires: Date }}
 */
function generateResetToken(user) {
  const payload = {
    identifiant: user.identifiant,
    email: user.email,
  };

  const expiresIn = "1h";
  const token = jwt.sign(payload, secret, { expiresIn });
  const expires = new Date(Date.now() + 3600000); // 1 hour

  return { token, expires };
}

module.exports = {
  generateResetToken,
};
