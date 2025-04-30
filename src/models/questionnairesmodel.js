const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  texte: { type: String, required: true },
  type: { type: String, required: true, enum: ['nombre', 'texte', 'booléen', 'choix_multiple', 'choix_unique'] },
  min: { type: Number },
  max: { type: Number },
  obligatoire: { type: Boolean, required: true },
  options: [{ type: String }], // pour les questions de type 'choix_multiple' ou 'choix_unique'
  condition: {
    question: { type: String },
    value: { type: Boolean }
  }
});

const SectionSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  questions: [QuestionSchema]
});

const QuestionnaireSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String, required: true },
  dateCreation: { type: Date, default: Date.now },
  dateModification: { type: Date, default: Date.now },
  statut: { type: String, default: "Actif" },
  sections: [SectionSchema],
  cible: { type: String, required: true },
  risqueAssocie: { type: String, required: true }
});

module.exports = mongoose.model("Questionnaire", QuestionnaireSchema);
