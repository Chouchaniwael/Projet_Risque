// routes/userEdit.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Route PUT pour modifier un utilisateur
router.put("/modifieruser/:identifiant", async (req, res) => {
  try {
    const { identifiant } = req.params;
    const { nom, prenom, email, adresse, role } = req.body;

    const user = await User.findOne({ identifiant });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    user.nom = nom || user.nom;
    user.prenom = prenom || user.prenom;
    user.email = email || user.email;
    user.adresse = adresse || user.adresse;
    user.role = role || user.role;

    await user.save();

    res.status(200).json({ message: "Utilisateur modifié avec succès." });
  } catch (error) {
    console.error("Erreur modification utilisateur:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

module.exports = router;
