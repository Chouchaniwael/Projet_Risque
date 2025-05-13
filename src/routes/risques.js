// routes/risques.js
const express = require('express');
const router = express.Router();
const QuestionnaireProjet = require('../models/questionnaire_projet');

router.get('/stats/risques', async (req, res) => {
  try {
    const projets = await QuestionnaireProjet.find({}, 'analyse.risqueNet');

    const compteur = {};

    projets.forEach(projet => {
      const risqueNet = projet.analyse?.risqueNet;
      if (risqueNet) {
        compteur[risqueNet] = (compteur[risqueNet] || 0) + 1;
      }
    });

    res.json({ totalRisques: Object.values(compteur).reduce((a, b) => a + b, 0), details: compteur });
  } catch (err) {
    console.error('Erreur lors du comptage des risques :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
