const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Client = require("../models/clientmodel");

// Configuration multer
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

// POST /api/clientajout
router.post("/", upload.single("logo"), async (req, res) => {
  try {
    const { name, secteur, description, mail, phone, address } = req.body;
    const logoPath = req.file ? req.file.filename : "";
    console.log("Logo Path:", logoPath);
    const nouveauClient = new Client({
      Nom: name,
      Logo: logoPath,
      Contact: phone,
      Secteur: secteur,
      Adresse: address,
      Statut: true,
    });

    await nouveauClient.save();
    res.status(201).json({ message: "Client ajouté avec succès", client: nouveauClient });
  } catch (error) {
    console.error("Erreur lors de l'ajout du client :", error);
    res.status(500).json({ error: "Erreur lors de l'ajout du client" });
  }
});

module.exports = router;
