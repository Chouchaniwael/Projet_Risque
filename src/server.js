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
mongoose.connect("mongodb+srv://admin:admin123456789@cluster0.uy0so.mongodb.net/myApp?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connecté à MongoDB"))
.catch(err => console.error("❌ Erreur de connexion MongoDB:", err));

// Routes
const authRoutes = require("./routes/auth");
const clientRoutes = require("./routes/clientlist");
const clientAjoutRoute = require("./routes/clientajout");
const forgotpassword = require("./nejdWork/routes/forgotpassword");
const resetpassword = require("./nejdWork/routes/resetpassword");

app.use("/api/clientajout", clientAjoutRoute);
app.use("/api/auth", authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/forgotpassword', forgotpassword);
app.use('/api/resetpassword', resetpassword);

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));