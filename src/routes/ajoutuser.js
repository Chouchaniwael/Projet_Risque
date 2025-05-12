const express = require("express");
const User = require("../models/User");

const router = express.Router();

// POST /api/utilisateurs
router.post("/", async (req, res) => {
  try {
    const { identifiant, nom, prenom, email, adresse, mot_de_passe, role } = req.body;

    if (!identifiant || !nom || !prenom || !email || !mot_de_passe) {
      return res.status(400).json({ message: "Champs requis manquants." });
    }

    // Vérifie si email ou identifiant déjà existant
    const existingUser = await User.findOne({ $or: [{ email }, { identifiant }] });
    if (existingUser) {
      return res.status(409).json({ message: "Email ou identifiant déjà utilisé." });
    }

   

    // Création du nouvel utilisateur
    const newUser = new User({
      identifiant,
      nom,
      prenom,
      email,
      adresse,
      mot_de_passe,
      role,
      statut: false,
      date_creation: new Date(),
    });

    await newUser.save();

    res.status(201).json({ message: "Utilisateur ajouté avec succès." });
  } catch (error) {
    console.error("Erreur lors de l'ajout:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

module.exports = router;
