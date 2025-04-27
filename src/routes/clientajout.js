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

// ✅ Valider un client
router.post("/:id/approve", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "manager") {
    return res.status(403).json({ error: "Accès refusé" });
  }

  try {
    // Mettre à jour l'état du client en "approved"
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { etat: "approved", Statut: true },
      { new: true }
    );
    res.json({ message: "Client approuvé", client });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la validation" });
  }
});

// ❌ Rejeter un client
router.post("/:id/reject", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "manager") {
    return res.status(403).json({ error: "Accès refusé" });
  }

  try {
    // Mettre à jour l'état du client en "rejected"
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { etat: "rejected", Statut: false },
      { new: true }
    );
    res.json({ message: "Client rejeté", client });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du rejet" });
  }
});

module.exports = router;
