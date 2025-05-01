const express = require('express');
const router = express.Router();
const QuestionnaireProjet = require('../models/questionnaire_projet');

router.post('/', async (req, res) => {
  try {
    const { projet, questionnaires } = req.body;

    // Step 1: Delete existing questionnaires for this project
    await QuestionnaireProjet.deleteMany({ projet });

    // Step 2: Save the new questionnaires
    const saved = await Promise.all(
      questionnaires.map((q) => {
        // Create a new questionnaire with analyse at the questionnaire level
        const newEntry = new QuestionnaireProjet({
          titre: q.titre,
          description: q.description,
          cible: q.cible,
          risqueAssocie: q.risqueAssocie,
          index: q.index,
          statut: q.statut || 'Actif',
          analyse: q.analyse,  // Now analyse belongs to the entire questionnaire
          sections: q.sections.map((section) => ({
            titre: section.titre,
            questions: section.questions.map((question) => ({
              texte: question.texte,
              type: question.type,
              min: question.min,
              max: question.max,
              options: question.options,
              obligatoire: question.obligatoire,
              reponse: question.reponse,
              condition: question.condition,
            })),
          })),
          projet,
          dateCreation: new Date(),
          dateModification: new Date(),
        });

        return newEntry.save();
      })
    );

    res.status(200).json({ message: 'Questionnaires updated successfully', data: saved });
  } catch (err) {
    console.error('Error updating questionnaires:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
