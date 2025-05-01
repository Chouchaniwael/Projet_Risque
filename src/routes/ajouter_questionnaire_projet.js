// routes/questionnaireCompleted.js
const express = require('express');
const router = express.Router();
const QuestionnaireProjet = require('../models/questionnaire_projet');

router.post('/', async (req, res) => {
  try {
    const { projet, questionnaires } = req.body;

    const saved = await Promise.all(
      questionnaires.map((q) => {
        const newEntry = new QuestionnaireProjet({
          ...q,
          projet,
          dateCreation: new Date(),
          dateModification: new Date(),
          statut: q.statut || 'Actif',
        });
        console.log(newEntry)

        return newEntry.save();
      })
    );

    res.status(200).json({ message: 'Questionnaires saved successfully', data: saved });
  } catch (err) {
    console.error('Error saving questionnaires:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
