//risqueparsecteur.js
const express = require("express");
const router = express.Router();
const QuestionnaireProjet = require("../models/questionnaire_projet");
const Client = require("../models/clientmodel");

router.get("/stats/risques/secteur", async (req, res) => {
  try {
    // 1. Récupérer tous les risques qui ont une analyse et un client associé
    const projets = await QuestionnaireProjet.find({ "analyse.risqueBrut.niveauRisque": { $exists: true } });

    // 2. Charger tous les clients une seule fois
    const clients = await Client.find({});
    const clientMap = new Map();
    clients.forEach(client => {
      clientMap.set(client.Nom, client.Secteur || "Inconnu");
    });

    // 3. Initialiser l’objet résultat
    const resultat = {};

    projets.forEach((projet) => {
      const clientNom = projet.projet;
      const secteur = clientMap.get(clientNom) || "Inconnu";
      const niveau = projet.analyse?.risqueBrut?.niveauRisque || "Inconnu";

      if (!resultat[secteur]) {
        resultat[secteur] = {
          "Extrême": 0,
          "Fort": 0,
          "Moyen": 0,
          "Faible": 0,
          "Accepté": 0,
        };
      }

      // Normaliser le niveau pour éviter les fautes de frappe
      const niveauNormalise = niveau.charAt(0).toUpperCase() + niveau.slice(1).toLowerCase();

      if (resultat[secteur][niveauNormalise] !== undefined) {
        resultat[secteur][niveauNormalise]++;
      } else {
        // En cas de niveau non reconnu
        resultat[secteur]["Accepté"]++; // ou "Inconnu"
      }
    });

    res.json({ parSecteur: resultat });
  } catch (error) {
    console.error("Erreur API /stats/risques/secteur:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
