
// src/models/sites.js

const mongoose = require('mongoose');
const SiteSchema = new mongoose.Schema({
  adresse: {
    type: String,
  },
  ClientNom: {
    type: String,
  },
  Contact: {
    type: String,
  },
  etat: {
    type: Boolean,
    default: true,
  },
  Nom: {
    type: String,
  },
  mail: {
    type: String,
  },
  ouvert: {
    type: Boolean,
    default: true,
  },
  Statut: {
    type: String, // Ici, "Staut" est une chaîne et non un booléen
    default: "true", // Valeur par défaut en tant que chaîne
  },
});

// Le troisième argument "sites" garantit que la collection utilisée sera "sites"
module.exports = mongoose.model('Site', SiteSchema);
