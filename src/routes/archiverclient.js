const express = require('express');
const router = express.Router();
const Client = require('../models/clientmodel');

// Archiver un client (mettre à jour l'état de l'archivage à 2)
router.put('/archiver/:id', async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { etatarchivage: 2 }, // Passer à l'état archivé (2)
      { new: true }
    );
    if (!client) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }
    res.json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de l\'archivage du client' });
  }
});

// Annuler l'archivage d'un client (mettre à jour l'état de l'archivage à 0)
router.put('/unarchive/:id', async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { etatarchivage: 0 }, // Revenir à l'état non archivé (0)
      { new: true }
    );
    if (!client) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }
    res.json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de l\'annulation de l\'archivage du client' });
  }
});

module.exports = router;
