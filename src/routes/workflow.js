const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Client = require("../models/clientmodel");

// Route pour confirmer un client
router.put("/clients/:id/confirm", async (req, res) => {
  try {
    // Récupérer l'ID du client à partir des paramètres de l'URL
    const clientId = req.params.id;

    // Vérifier que l'ID du client est valide
    if (!clientId) {
      return res.status(400).json({ message: "ID du client manquant." });
    }

    // Mettre à jour le client avec l'ID spécifié et définir le statut sur true
    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      { Statut: true },
      { new: true } // Retourner le client mis à jour
    );

    // Si le client n'a pas été trouvé, envoyer un message d'erreur
    if (!updatedClient) {
      return res.status(404).json({ message: "Client non trouvé" });
    }

    // Répondre avec le client mis à jour
    res.status(200).json(updatedClient); // Retourner le client mis à jour
  } catch (error) {
    console.error("Erreur lors de la mise à jour du client:", error);
    // Envoi de l'erreur serveur avec un code 500
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
