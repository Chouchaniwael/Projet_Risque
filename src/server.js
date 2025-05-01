const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:3000" // Permettre les requêtes depuis ton frontend React
}));
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "assets", "images")));

// Middleware d'authentification
function authenticateToken(req, res, next) {
    console.log("🛡️ Vérification du token...");

    // Extraire le token depuis l'en-tête Authorization
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
        console.log("⛔ Aucun token trouvé");
        return res.status(401).json({ error: "Token manquant" });
    }

    // Vérification du token
    jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY", (err, user) => {
        if (err) {
            console.log("❌ Token invalide");
            return res.status(403).json({ error: "Token invalide" });
        }

        console.log("✅ Token valide :", user);
        req.user = user;  // Attacher l'utilisateur à la requête
        next();  // Passe à la prochaine fonction de la route
    });
}

// Connexion à MongoDB
mongoose.connect("mongodb+srv://Wael:HBITkyNurR3ZRqMr@cluster.kuxpkyx.mongodb.net/myApp", {
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
const siteRoutes = require("./routes/siteslist");
const questionnaireRoutes = require('./routes/getquestionnaire_standard');
const getquestionnaire_standard_byTitre = require('./routes/getquestionnaire_standard_byTitre')
const ajouter_questionnaire_projet = require('./routes/ajouter_questionnaire_projet')
const questionnaireProjetRoutes = require('./routes/get_questionnare_by_projet');

// Routes publiques
app.use("/api/auth", authRoutes);
app.use('/api/forgotpassword', forgotpassword);
app.use('/api/resetpassword', resetpassword);
app.use("/api/sites", siteRoutes);
// Appliquer le middleware d'authentification avant les routes protégées
app.use("/api/clientajout", authenticateToken, clientAjoutRoute); // Appliquer le middleware seulement à cette route
app.use("/api/clients", clientRoutes);
app.use("/api/questionnaireRoutes", questionnaireRoutes);
app.use("/api/getquestionnaire_standard_byTitre", getquestionnaire_standard_byTitre);
app.use("/api/ajouter_questionnaire_projet",ajouter_questionnaire_projet);
app.use('/api/questionnaire_projet', questionnaireProjetRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`));
