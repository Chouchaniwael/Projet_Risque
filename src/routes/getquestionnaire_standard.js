const express = require('express');
const router = express.Router();
const Questionnaire_standard = require('../models/questionnaire_standard');

// GET all questionnaires
router.get('/', async (req, res) => {
  try {
    // Optionally use query parameters for filtering or pagination
    const filter = {}; // You can modify this based on req.query
    const questionnaires = await Questionnaire_standard.find(filter);
    res.json(questionnaires);
  } catch (err) {
    console.error("❌ Erreur serveur :", err);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

module.exports = router;
