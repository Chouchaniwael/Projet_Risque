const express = require('express');
const router = express.Router();
const Client = require('../models/Client');

router.post('/', async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).json(client);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
