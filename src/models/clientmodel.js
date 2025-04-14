const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  Nom: { type: String, required: true },
  Logo: { type: String },
  Contact: { type: String },
  Secteur: { type: String },
  Adresse: { type: String },
  Statut: { type: Boolean, default: true },
});

module.exports = mongoose.model("Client", clientSchema);