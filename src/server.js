const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000"
}));
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "assets", "images")));

// Connexion à MongoDB
mongoose.connect("mongodb://localhost:27017/myApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connecté à MongoDB"))
.catch(err => console.error("❌ Erreur de connexion MongoDB:", err));

// Routes
const authRoutes = require("./routes/auth");
const clientRoutes = require("./routes/clientlist");
const clientAjoutRoute = require("./routes/clientajout");
app.use("/api/clientajout", clientAjoutRoute);
app.use("/api/auth", authRoutes);
app.use('/api/clients', clientRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));