const express = require('express');
const router = express.Router();
const QuestionnaireProjetSite = require('../models/questionnaire_projet_site.js');

// 🔁 POST /api/questionnaire_projet_site
router.post('/', async (req, res) => {
  try {
    const { siteId, questionnaires } = req.body;

    if (!siteId || !questionnaires) {
      return res.status(400).json({ message: "siteId et questionnaires sont requis." });
    }

    // 1️⃣ Supprimer les anciens questionnaires liés à ce site
    await QuestionnaireProjetSite.deleteMany({ siteId });

    // 2️⃣ Enregistrer les nouveaux questionnaires
    const saved = await Promise.all(
      questionnaires.map((q) => {
        const newEntry = new QuestionnaireProjetSite({
          siteId,
          titre: q.titre,
          description: q.description,
          cible: q.cible,
          risqueAssocie: q.risqueAssocie,
          index: q.index,
          statut: q.statut || 'Actif',
          analyse: q.analyse, // contient toute l’analyse du risque
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
          dateCreation: new Date(),
          dateModification: new Date(),
        });

        return newEntry.save();
      })
    );

    res.status(200).json({ message: '✅ Questionnaires du site enregistrés avec succès.', data: saved });
  } catch (err) {
    console.error('❌ Erreur lors de la sauvegarde des questionnaires site :', err);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

module.exports = router;
