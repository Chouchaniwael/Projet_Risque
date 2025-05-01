const express = require('express');
const router = express.Router();
const QuestionnaireProjet = require('../models/questionnaire_projet');

// GET: Get all questionnaires for a specific project
router.get('/', async (req, res) => {
  try {
    const { projet } = req.query;

    if (!projet) {
      return res.status(400).json({ message: "Le paramètre 'projet' est requis." });
    }

    const questionnaires = await QuestionnaireProjet.find({ projet });
    res.status(200).json(questionnaires);
  } catch (err) {
    console.error("Erreur lors de la récupération des questionnaires du projet :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

module.exports = router;
