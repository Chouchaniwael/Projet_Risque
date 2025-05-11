const mongoose = require('mongoose');

const ConditionSchema = new mongoose.Schema({
  question: String,
  value: mongoose.Schema.Types.Mixed
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
  condition: { type: ConditionSchema, default: null }
}, { _id: false });

const SectionSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  questions: [QuestionSchema]
}, { _id: false });

const Questionnaire_site = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String },
 
  dateCreation: { type: Date, default: Date.now },
  dateModification: { type: Date, default: Date.now },
  statut: { type: String, enum: ['Actif', 'Inactif'], default: 'Actif' },
  sections: [SectionSchema],
  cible: { type: String },
  risqueAssocie: { type: String },
  index: { type: Number }
});

module.exports = mongoose.model('questionnaire_site', Questionnaire_site);
