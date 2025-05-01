const express = require('express');
const router = express.Router();
const Questionnaire_standard = require('../models/questionnaire_standard');

// GET questionnaires (optionnellement filtrés par titre)
router.get('/', async (req, res) => {
  const { titre } = req.query;

  try {
    let filter = {};
    
    if (titre) {
      filter.titre = { $regex: new RegExp(`^${decodeURIComponent(titre)}$`, 'i') };
      console.log("Titre reçu (décodé) :", decodeURIComponent(titre));
    }

    const questionnaires = await Questionnaire_standard.find(filter);
    res.json(questionnaires);
  } catch (err) {
    console.error("❌ Erreur serveur :", err);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

module.exports = router;
