const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  Nom: { type: String, trim: true },          // "Nom"
  Logo: { type: String, default: "", trim: true },             // "Logo"
  Contact: { type: String, trim: true },                       // "Contact"
  Secteur: { type: String, trim: true },                       // "Secteur"
  Adresse: { type: String, trim: true },                       // "Adresse"
  Statut: { type: Boolean, default: true },                    // "Statut"
  etat: { type: String, default: "pending", trim: true },       // "etat" -> approved, pending, etc.
  Description: { type: String, trim: true },                   // "Description"
  Mail: { type: String, trim: true },                          // "Mail"
  linkedin: { type: String, trim: true },  
  etatarchivage:{ type: Number, default: 0 }, // "etatarchivage" -> 0: non archivé, 1: archivé           
}, {
  timestamps: true, // ajoute createdAt et updatedAt automatiquement
});

module.exports = mongoose.models.Client || mongoose.model("Client", clientSchema);
