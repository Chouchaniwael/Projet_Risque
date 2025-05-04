const express = require('express');
const router = express.Router();
const Questionnaire_standard = require('../models/questionnaire_standard');

// GET all questionnaires or filter by titre
router.get('/', async (req, res) => {
  try {
    const filter = {}; // Declare filter before using it

    const { titre } = req.query;
    if (titre !== undefined) {
      filter.titre = titre;
    }

    const questionnaires = await Questionnaire_standard.find(filter);
    res.json(questionnaires);
  } catch (err) {
    console.error("❌ Erreur serveur :", err);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

module.exports = router;
