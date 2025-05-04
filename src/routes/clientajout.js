const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Client = require("../models/clientmodel");
const authenticateToken = require("../middelware/authenticateToken");

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "assets", "images"));
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// ✅ Ajouter un client
// ✅ Ajouter un client (corrigé)
router.post("/", authenticateToken, upload.single("logo"), async (req, res) => {
  try {
    console.log("🧾 Utilisateur connecté :", req.user);
    console.log("📦 Données reçues :", req.body);  // <--- Ajoute ceci
    // Récupérer les données du corps de la requête
    const { nom, secteur, description, mail, phone, address } = req.body;
    const logoPath = req.file ? req.file.filename : "";

    // Définir les valeurs par défaut pour l'état et le statut
    let etat = "pending";
    let Statut = false;
    

    // Vérifier le rôle de l'utilisateur connecté
    if (req.user.role === "admin" || req.user.role === "manager") {
      etat = "approved";
      Statut = true;
    }

    // Création du nouveau client
    const nouveauClient = new Client({
      Nom: nom,
      Logo: logoPath,
      Contact: phone,
      Secteur: secteur,
      Adresse: address,
      Statut,
      etat,
      Description: description,
      Mail: mail,
    });

    // Sauvegarder le client dans la base de données
    await nouveauClient.save();
    res.status(201).json({ message: "Client ajouté avec succès", client: nouveauClient });
  } catch (error) {
    console.error("Erreur lors de l'ajout du client :", error);
    res.status(500).json({ error: "Erreur lors de l'ajout du client" });
  }
});

module.exports = router;
