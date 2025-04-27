// models/Site.js
const mongoose = require("mongoose");

const SiteSchema = new mongoose.Schema({
  Nom: { type: String, required: true },        
  Adresse: { type: String, required: true },    
  Type: { type: String, required: true },        
  ClientNom: { type: String, required: true },    
  Statut: { type: Boolean, default: true },      
  Contact: { type: String, required: true },      
  date_creation: { type: Date, default: Date.now } 
});

module.exports = mongoose.model("sites", SiteSchema);
