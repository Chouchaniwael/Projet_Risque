const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Route pour approuver un user
router.put("/:id/approve", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { statut: true },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'approbation du user" });
  }
});

// Route pour rejeter un user
router.put("/:id/reject", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression du user" });
  }
});

module.exports = router;
