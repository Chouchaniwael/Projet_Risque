const express = require('express');
const router = express.Router();
const Client = require('../models/clientmodel');

router.get('/', async (req, res) => {
  try {
    const { name } = req.query;
    let clients;
    
    if (name) {
      clients = await Client.find({
        Nom: { $regex: name, $options: 'i' }
      });
    } else {
      clients = await Client.find();
    }

    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;