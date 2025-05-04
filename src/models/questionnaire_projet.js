const mongoose = require('mongoose');

const ConditionSchema = new mongoose.Schema({
  question: String,
  value: mongoose.Schema.Types.Mixed
}, { _id: false });

// 🔍 NEW: Analyse-related sub-schemas
const RisqueBrutSchema = new mongoose.Schema({
  title: { type: String, default: "risqueBrut" },
  probabilite: Number,
  impact: Number,
  niveauRisque: String,
  risqueBrut: Number
}, { _id: false });

const ElementControleSchema = new mongoose.Schema({
  title: { type: String, default: "elementControle" },
  elementMaitrise: String,
  efficacite: String
}, { _id: false });

const PlanTraitementSchema = new mongoose.Schema({
  title: { type: String, default: "planTraitement" },
  optionTraitement: String,
  planAction: String,
  cout: Number,
  complexite: String,
  priorite: String
}, { _id: false });

const AnalyseSchema = new mongoose.Schema({
  scenarioRisque: String,
  constat: String,
  risqueNet: String,
  risqueBrut: RisqueBrutSchema,
  elementControle: ElementControleSchema,
  planTraitement: PlanTraitementSchema
}, { _id: false });

const QuestionSchema = new mongoose.Schema({
  texte: { type: String, required: true },
  type: {
    type: String,
    enum: ['nombre', 'texte', 'booléen', 'choix_unique', 'choix_multiple'],
    required: true
  },
  min: Number,
  max: Number,
  options: [String],
  obligatoire: { type: Boolean, default: false },
  reponse: { type: String },
  condition: { type: ConditionSchema, default: null },
}, { _id: false });

const SectionSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  questions: [QuestionSchema],
}, { _id: false });

const QuestionnaireProjetSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String },
  dateCreation: { type: Date, default: Date.now },
  dateModification: { type: Date, default: Date.now },
  statut: { type: String, enum: ['Actif', 'Inactif'], default: 'Actif' },
  sections: [SectionSchema],
  cible: { type: String },
  risqueAssocie: { type: String },
  projet: { type: String },
  index: { type: Number },
  analyse: { type: AnalyseSchema, default: null }  // 🔧 Added here
});

module.exports = mongoose.model('questionnaire_projet', QuestionnaireProjetSchema);
