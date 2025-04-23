// /routes/client.js ou clientRoute.js

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
router.post("/", authenticateToken, upload.single("logo"), async (req, res) => {
  try {
    console.log("🧾 Utilisateur connecté :", req.user);
    const { name, secteur, description, mail, phone, address } = req.body;
    const logoPath = req.file ? req.file.filename : "";

    let etat = "pending";
    let statut = false;

    if (req.user.role === "admin" || req.user.role === "manager") {
      etat = "approved";
      statut = true;
    }

    const nouveauClient = new Client({
      Nom: name,
      Logo: logoPath,
      Contact: phone,
      Secteur: secteur,
      Adresse: address,
      etat,
      Statut: statut,
      createdBy: req.user.id,
    });

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
