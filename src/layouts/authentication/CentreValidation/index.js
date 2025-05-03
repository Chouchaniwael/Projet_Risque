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
const apiUrl = "http://localhost:5000/api"; 

function CentreValidation() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  // Fonction pour récupérer les clients depuis l'API
  const loadClients = async () => {
    try {
      const response = await axios.get(`${apiUrl}/clients`, {
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

  // Fonction pour confirmer un client
  const handleConfirm = async (clientId) => {
    try {
      // Envoie la requête PUT à l'API pour confirmer le client
      const response = await axios.put(`http://localhost:5000/api/workflow/clients/${clientId}/confirm`);
      if (response.status === 200) {
        // Mettre à jour la liste des clients avec le statut modifié
        setClients(clients.map(client => 
          client._id === clientId ? { ...client, Statut: true } : client
        ));
      }
    } catch (error) {
      console.error("Erreur lors de la confirmation du client", error);
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
                          <MDTypography variant="h6" fontWeight="bold" color="textPrimary">
                            {client.Nom}
                          </MDTypography>
                          <MDBox display="flex" justifyContent="space-between" mt={1}>
                            <MDTypography variant="body2" color={client.Statut ? "green" : "red"} fontWeight="medium">
                              Statut: {client.Statut ? "Confirmé" : "Non confirmé"}
                            </MDTypography>
                          </MDBox>

                          {/* Afficher le secteur et la date */}
                          <MDBox display="flex" justifyContent="space-between" mt={2}>
                            <MDTypography variant="body2" color="textSecondary">
                              Secteur: {client.Secteur}
                            </MDTypography>
                            <MDTypography variant="body2" color="textSecondary">
                              Date: {new Date(client.createdAt).toLocaleDateString()}
                            </MDTypography>
                          </MDBox>

                          {/* Boutons de confirmation et de rejet */}
                          <MDBox display="flex" justifyContent="flex-end" mt={2}>
                            <Button
                              variant="icon"
                              color="success"
                              sx={{ marginRight: 2 }}
                              startIcon={<CheckCircleIcon sx={{ color: 'green' }} />}
                              onClick={() => handleConfirm(client._id)} // Appeler la fonction de confirmation avec l'ID du client
                            >
                              Confirmer
                            </Button>
                            <Button
                              variant="icon"
                              color="error"
                              startIcon={<CancelIcon sx={{ color: 'red', fontSize: 30 }} />}
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
      <Footer />
    </DashboardLayout>
  );
}

export default CentreValidation;
