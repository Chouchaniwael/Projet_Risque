import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Permet de récupérer les paramètres d'URL
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Image par défaut si aucun logo n'est disponible
import defaultImage from "assets/images/team-3.jpg";

const ClientDetailPage = () => {
  const { id } = useParams(); // Récupérer l'ID ou le nom du client à partir de l'URL
  const [client, setClient] = useState(null); // État pour stocker les données du client

  // Charger les données du client à partir de l'API
  useEffect(() => {
    const fetchClient = async () => {
      try {
        // Requête à l'API pour récupérer le client par son nom
        const response = await fetch(`http://localhost:5000/api/clients/search/${id}`);
        const data = await response.json();
        setClient(data); // Enregistrer les données du client dans l'état
      } catch (error) {
        console.error("Erreur de chargement du client:", error);
      }
    };

    fetchClient(); // Appeler la fonction pour récupérer les données du client
  }, [id]); // Recharger les données si l'ID change

  // Si les données du client ne sont pas encore chargées, afficher un message de chargement
  if (!client) {
    return (
      <MDBox display="flex" justifyContent="center" alignItems="center" style={{ height: "100vh" }}>
        <div>Chargement du client...</div>
      </MDBox>
    );
  }

  // Si aucune donnée n'est disponible, afficher un message d'erreur
  if (client === null || Object.keys(client).length === 0) {
    return (
      <MDBox display="flex" justifyContent="center" alignItems="center" style={{ height: "100vh" }}>
        <div>Aucun client trouvé</div>
      </MDBox>
    );
  }

  return (
    <MDBox>
      <MDBox display="flex" alignItems="center">
        {/* Afficher l'image du client */}
        <MDAvatar
          src={client.Logo ? `http://localhost:5000/images/${client.Logo}` : defaultImage}
          name={client.Nom}
        />
        <MDBox ml={2}>
          <MDTypography variant="h4" fontWeight="medium">
            {client.Nom}
          </MDTypography>
          <MDTypography variant="body1" color="textSecondary">
            Secteur: {client.Secteur || "Non spécifié"}
          </MDTypography>
          <MDTypography variant="body1" color="textSecondary">
            Adresse: {client.Adresse || "Non spécifiée"}
          </MDTypography>
          <MDTypography variant="body1" color="textSecondary">
            Contact: {client.Contact || "Non disponible"}
          </MDTypography>
        </MDBox>
      </MDBox>

      <MDBox mt={3}>
        <MDTypography variant="h5" fontWeight="medium">
          Détails supplémentaires
        </MDTypography>
        <MDTypography variant="body2" color="textSecondary">
          Nombre de sites: {client.Nb_Site !== undefined ? client.Nb_Site : "Non spécifié"}
        </MDTypography>
        <MDTypography variant="body2" color="textSecondary">
          Statut: {client.Statut ? "Actif" : "Inactif"}
        </MDTypography>
      </MDBox>
    </MDBox>
  );
};

export default ClientDetailPage;
