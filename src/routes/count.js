const express = require("express");
const router = express.Router();
const Questionnaire = require("../models/questionnaire_projet"); // adapte le chemin si besoin

router.get("/questionnaires/risques-par-niveau/:clientId", async (req, res) => {
  const clientId = req.params.clientId;

  try {
    const result = await Questionnaire.aggregate([
      { $match: { clientId } },
      {
        $group: {
          _id: "$analyse.risqueNet",  // <-- Risque net ici
          count: { $sum: 1 }
        }
      }
    ]);

    const formatted = result.reduce((acc, cur) => {
      acc[cur._id || "Non évalué"] = cur.count;  // Gérer les nulls
      return acc;
    }, {});

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

module.exports = router;
