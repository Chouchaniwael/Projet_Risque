// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  identifiant: { type: String, required: true, unique: true },
  nom: String,
  prenom: String,
  mot_de_passe: String, // ⚠️ À remplacer par un hash plus tard
  poste: String,
  adresse: String,
});

module.exports = mongoose.model("User", UserSchema);