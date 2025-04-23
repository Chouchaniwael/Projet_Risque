const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  nom: { type: String, required: true, trim: true },
  logo: { type: String, default: "" }, // chemin ou URL de l'image
  contact: { type: String, trim: true },
  secteur: { type: String, trim: true },
  adresse: { type: String, trim: true },
  statut: { type: Boolean, default: true },
}, {
  timestamps: true, // ajoute automatiquement createdAt et updatedAt
});

module.exports = mongoose.models.Client || mongoose.model("Client", clientSchema);
