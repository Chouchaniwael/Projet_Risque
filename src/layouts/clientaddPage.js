import React, { useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import TextField from "@mui/material/TextField"; // Importation du champ de texte de Material-UI
import Button from "@mui/material/Button"; // Importation du bouton de Material-UI

const ClientAddPage = () => {
  // État pour gérer les valeurs des champs du formulaire
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });
  // Fonction pour gérer les changements dans les champs de texte
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici tu peux ajouter la logique pour envoyer les données du formulaire (par exemple à une API)
    console.log("Données du client soumises:", formData);
  };

  return (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh" // prend toute la hauteur de l'écran
      textAlign="center"
    >
      <MDBox>
        <MDTypography variant="h4" mb={3}>
          Ajouter un client
        </MDTypography>

        {/* Formulaire pour ajouter un client */}
        <form onSubmit={handleSubmit}>
          {/* Champ pour le nom */}
          <TextField
            label="Nom"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          {/* Champ pour l'adresse */}
          <TextField
            label="Adresse"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          {/* Champ pour le téléphone */}
          <TextField
            label="Téléphone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          {/* Bouton de soumission */}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Ajouter le client
          </Button>
        </form>
      </MDBox>
    </MDBox>
  );
};

export default ClientAddPage;
