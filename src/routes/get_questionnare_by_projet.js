//get_questionnare_by_projet.js
const express = require('express');
const router = express.Router();
const QuestionnaireProjet = require('../models/questionnaire_projet');

// Fonction utilitaire pour évaluer le statut d'analyse
function getAnalyseStatus(analyse) {
  if (!analyse) return "Nouveau";

  const isEmpty = (val) =>
    val === null ||
    val === undefined ||
    (typeof val === "string" && val.trim() === "");

  const flatValues = [
    analyse.scenarioRisque,
    analyse.constat,
    analyse.risqueNet,
    ...(analyse.risqueBrut ? Object.values(analyse.risqueBrut) : []),
    ...(analyse.elementControle ? Object.values(analyse.elementControle) : []),
    ...(analyse.planTraitement ? Object.values(analyse.planTraitement) : [])
  ];

  const filledCount = flatValues.filter((val) => !isEmpty(val)).length;

  if (filledCount === 0) return "Nouveau";
  if (filledCount === flatValues.length) return "Complété";
  return "En cours";
}

// GET: Get all questionnaires for a specific project
router.get('/', async (req, res) => {
  try {
    const { projet } = req.query;

    if (!projet) {
      return res.status(400).json({ message: "Le paramètre 'projet' est requis." });
    }

    const questionnaires = await QuestionnaireProjet.find({ projet });

    // Ajouter le champ statutAnalyse à chaque questionnaire
    const questionnairesWithStatus = questionnaires.map((q) => {
      const statutAnalyse = getAnalyseStatus(q.analyse);
      return {
        ...q.toObject(),
        statutAnalyse,
      };
    });

    res.status(200).json(questionnairesWithStatus);
  } catch (err) {
    console.error("Erreur lors de la récupération des questionnaires du projet :", err);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

module.exports = router;
