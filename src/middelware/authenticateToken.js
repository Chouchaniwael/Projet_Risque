const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    console.log("🛡️ Vérification du token...");
  
    const authHeader = req.headers["authorization"];
    console.log("🔐 Header reçu :", authHeader);
  
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      console.log("⛔ Aucun token reçu");
      return res.status(401).json({ error: "Token manquant" });
    }
  
    jwt.verify(token, "SECRET_KEY", (err, user) => {
      if (err) {
        console.log("❌ Token invalide");
        return res.status(403).json({ error: "Token invalide" });
      }
  
      console.log("✅ Token valide :", user);
      req.user = user;
      next();
    });
  }
  

module.exports = authenticateToken;
