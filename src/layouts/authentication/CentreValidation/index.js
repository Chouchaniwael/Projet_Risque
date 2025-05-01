import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Button } from '@mui/material'; // Utilisation des boutons Material-UI
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Icône pour confirmer
import CancelIcon from '@mui/icons-material/Cancel'; // Icône pour rejeter

// Remplacer par l'URL de ton API Express
const apiUrl = "http://localhost:5000/api/clients"; // Remplace avec l'URL de ton backend

function CentreValidation() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  // Fonction pour récupérer les clients depuis l'API
  const loadClients = async () => {
    try {
      const response = await axios.get(apiUrl, {
        params: {
          statut: false // Par défaut, on récupère les clients non confirmés
        }
      });
      setClients(response.data); // Mise à jour de l'état avec les données récupérées
    } catch (error) {
      console.error("Erreur lors de la récupération des clients", error);
    }
  };

  // Charge les clients lorsque le composant est monté
  useEffect(() => {
    loadClients();
  }, []);

  // Fonction pour gérer la confirmation d'un client
  const handleConfirm = async (clientId) => {
    try {
      const updatedClients = clients.map(client => 
        client._id === clientId ? { ...client, statut: true } : client
      );
      setClients(updatedClients);

      // Envoyer la mise à jour au backend (si nécessaire)
      await axios.put(`${apiUrl}/${clientId}`, { statut: true });
    } catch (error) {
      console.error("Erreur lors de la confirmation du client", error);
    }
  };

  // Fonction pour gérer le rejet d'un client
  const handleReject = async (clientId) => {
    try {
      const updatedClients = clients.map(client => 
        client._id === clientId ? { ...client, statut: false } : client
      );
      setClients(updatedClients);

      // Envoyer la mise à jour au backend (si nécessaire)
      await axios.put(`${apiUrl}/${clientId}`, { statut: false });
    } catch (error) {
      console.error("Erreur lors du rejet du client", error);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="primary"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                  <MDTypography variant="h6" color="white" fontWeight="bold">
                    Liste des Clients à valider
                  </MDTypography>
                </MDBox>
              </MDBox>

              <MDBox pt={3}>
                {/* Tableau des clients avec boutons de confirmation et rejet */}
                <Grid container spacing={3}>
                  {clients.map((client) => (
                    <Grid item xs={12} sm={6} md={4} key={client._id}>
                      <Card sx={{ boxShadow: 3, borderRadius: 2, padding: 2 }}>
                        <MDBox p={2}>
                          <MDTypography variant="h6" fontWeight="bold" color="textPrimary">{client.name}</MDTypography>
                          <MDBox display="flex" justifyContent="space-between" mt={1}>
                            <MDTypography variant="body2" color={client.statut ? "green" : "red"} fontWeight="medium">
                              Statut: {client.statut ? "Confirmé" : "Non confirmé"}
                            </MDTypography>
                          </MDBox>

                          {/* Afficher le secteur et la date */}
                          <MDBox display="flex" justifyContent="space-between" mt={2}>
                            <MDTypography variant="body2" color="textSecondary">
                              Nom: {client.Nom}
                            </MDTypography>
                            <MDTypography variant="body2" color="textSecondary">
                              Date: {new Date(client.createdAt).toLocaleDateString()}
                            </MDTypography>
                          </MDBox>

                          {/* Boutons de confirmation et de rejet */}
                          <MDBox display="flex" justifyContent="flex-end" mt={2}>
                            <Button
                              variant="icon "
                              color="success" // Correctement utilisé pour obtenir du vert
                              sx={{ marginRight: 2 }}
                              startIcon={
                                <CheckCircleIcon sx={{ color: 'green' }} /> // Applique la couleur verte uniquement à l'icône
                              } // Icône de confirmation
                              onClick={() => handleConfirm(client._id)}
                            >
                              Confirmer
                            </Button>
                            <Button
                              variant="icon "
                              color="error" // Correctement utilisé pour obtenir du rouge
                              startIcon={<CancelIcon sx={{ color: 'red', fontSize: 30  }}/>} // Icône de rejet
                              onClick={() => handleReject(client._id)}
                            >
                              Rejeter
                            </Button>
                          </MDBox>
                        </MDBox>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default CentreValidation;
