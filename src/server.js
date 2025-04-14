// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const path = require("path");
app.use("/images", express.static(path.join(__dirname, "assets", "images")));

// Middleware
app.use(cors({
    origin: "http://localhost:3000" // Assurez-vous que c'est l'adresse de ton frontend
  }));
app.use(express.json());

// Connexion à MongoDB
mongoose.connect("mongodb://localhost:27017/myApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connecté à MongoDB"))
.catch(err => console.error("❌ Erreur de connexion MongoDB:", err));

// Routes
const authRoutes = require("./routes/auth");
const clientRoutes = require('./routes/findclient');
console.log("clientRouter:", clientRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/clients', clientRoutes);
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));