const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");

router.post("/login", async (req, res) => {
  const { identifiant, mot_de_passe } = req.body;
  
  console.log("Identifiant reçu :", identifiant); // Log l'identifiant reçu dans la requête
  console.log("Mot de passe reçu :", mot_de_passe); // Log le mot de passe reçu dans la requête

  try {
    // 1. Trouver l'utilisateur par identifiant
    const user = await User.findOne({ identifiant });  // Cherche un utilisateur avec cet identifiant

    // Vérifier si l'utilisateur existe
    if (!user) {
      console.log("Aucun utilisateur trouvé avec cet identifiant.");
      return res.status(401).json({ success: false, message: "Identifiant incorrect" });
    }

    // 2. Comparaison du mot de passe
    if (user.mot_de_passe !== mot_de_passe) {
      console.log("Mot de passe incorrect");
      return res.status(401).json({ success: false, message: "Mot de passe incorrect" });
    }

    // 3. Création du token JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // on inclut le rôle dans le token
      "SECRET_KEY",
      { expiresIn: "1h" }
    );

    // 4. Réponse réussie avec le token
    res.json({
      success: true,
      user: {
        id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        poste: user.poste,
      },
      token, // Renvoie le token au frontend
    });

  } catch (err) {
    console.error("Erreur de connexion:", err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
});

  
  

module.exports = router;