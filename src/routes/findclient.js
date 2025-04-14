const express = require('express');
const router = express.Router();
const Client = require('../models/clientlist');

// GET tous les clients
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET un client par son nom
router.get('/search/:name', async (req, res) => {
  try {
    // Recherche du client par le nom
    const client = await Client.findOne({ Nom: req.params.name });
    
    if (!client) {
      return res.status(404).json({ message: 'Client non trouvé' });
    }
    
    res.json(client); // Renvoie les données du client trouvé
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
