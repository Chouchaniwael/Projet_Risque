const express = require("express");
const router = express.Router();
const Questionnaire = require("../models/questionnaire_projet");

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

// Route GET /api/questionnaires?projet=NomProjet
router.get("/questionnaires", async (req, res) => {
  try {
    const { projet } = req.query;

    if (!projet) {
      return res.status(400).json({ error: "Le paramètre 'projet' est requis." });
    }

    const questionnaires = await Questionnaire.find({ projet });

    const risquesSet = new Set();
    const agencesMap = new Map();

    const risquesMap = {
      faible: 0,
      moyen: 0,
      fort: 0,
      accepte: 0,
      inconnu: 0,
    };

    const enrichedQuestionnaires = questionnaires.map((q) => {
      const titreRisque = q.risqueAssocie || "Risque inconnu";
      const site = q.cible || "Inconnu";
      const niveau = q.analyse?.risqueNet || "Non évalué";

      // Comptage
      if (niveau === "Faible") risquesMap.faible += 1;
      else if (niveau === "Moyen") risquesMap.moyen += 1;
      else if (niveau === "Fort") risquesMap.fort += 1;
      else if (niveau === "Accepté") risquesMap.accepte += 1;
      else risquesMap.inconnu += 1;

      // Risques par site
      if (!agencesMap.has(site)) agencesMap.set(site, new Map());
      agencesMap.get(site).set(titreRisque, niveau);

      // Ajouter aux risques uniques
      risquesSet.add(titreRisque);

      // Ajouter statut
      return {
        ...q.toObject(),
        statutAnalyse: getAnalyseStatus(q.analyse),
      };
    });

    const risques = Array.from(risquesSet);

    const agences = Array.from(agencesMap.entries()).map(([nom, niveauxMap]) => {
      const valeurs = risques.map((risque) => niveauxMap.get(risque) || "Non évalué");
      return { nom, valeurs };
    });

    res.json({
      risques,
      agences,
      compteRisques: risquesMap,
      questionnaires: enrichedQuestionnaires, // utile si tu veux afficher les statuts
    });
  } catch (err) {
    console.error("Erreur récupération questionnaires:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
