// models/User.js
const mongoose = require("mongoose");
const { boolean } = require("yup");

const UserSchema = new mongoose.Schema({
  identifiant: { type: String, required: true, unique: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  adresse: { type: String },
  mot_de_passe: { type: String, required: true },
  role: { type: String, default: "consultant" },
  date_creation: { type: Date, default: Date.now },
  statut : { type: Boolean, default: false },
});

module.exports = mongoose.model("User", UserSchema);
