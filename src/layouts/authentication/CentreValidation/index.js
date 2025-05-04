import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

// URL de l'API Express
const apiUrl = "http://localhost:5000/api/clients";

function CentreValidation() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  // Charger les clients non approuvés
  const loadClients = async () => {
    try {
      const response = await axios.get(apiUrl);
      // Ne garder que ceux avec Statut: false ou etat: pending
      const pendingClients = response.data.filter(
        (client) => client.Statut === false 
      );
      setClients(pendingClients);
    } catch (error) {
      console.error("Erreur lors de la récupération des clients", error);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  // Fonction pour valider un client
  const handleConfirm = async (clientId) => {
    try {
      // Envoie la demande de validation au backend
      await axios.put(`${apiUrl}/${clientId}/approve`);
      // Met à jour l'état local après la confirmation
      setClients((prevClients) =>
        prevClients.map((client) =>
          client._id === clientId ? { ...client, Statut: true, etat: "approved" } : client
        )
      );
    } catch (error) {
      console.error("Erreur lors de la validation du client", error);
    }
  };

  // Fonction pour rejeter un client
  const handleReject = async (clientId) => {
    try {
      // Envoie la demande de rejet au backend
      await axios.put(`${apiUrl}/${clientId}/reject`);
      // Met à jour l'état local après le rejet
      setClients((prevClients) =>
        prevClients.map((client) =>
          client._id === clientId ? { ...client, Statut: false, etat: "rejected" } : client
        )
      );
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
                <MDTypography variant="h6" color="white" fontWeight="bold">
                  Liste des Clients à valider
                </MDTypography>
              </MDBox>

              <MDBox pt={3} px={2} pb={2}>
                <Grid container spacing={3}>
                  {clients.map((client) => (
                    <Grid item xs={12} sm={6} md={4} key={client._id}>
                      <Card sx={{ boxShadow: 3, borderRadius: 2, padding: 2 }}>
                        <MDBox p={2}>
                          <MDTypography
                            variant="h6"
                            fontWeight="bold"
                            color="textPrimary"
                          >
                            {client.Nom}
                          </MDTypography>

                          <MDBox display="flex" justifyContent="space-between" mt={1}>
                            <MDTypography
                              variant="body2"
                              color={client.Statut ? "success.main" : "error.main"}
                              fontWeight="medium"
                            >
                              Statut: {client.Statut ? "Confirmé" : "Non confirmé"}
                            </MDTypography>
                          </MDBox>

                          <MDBox display="flex" justifyContent="space-between" mt={2}>
                            <MDTypography variant="body2" color="textSecondary">
                              Secteur: {client.Secteur}
                            </MDTypography>
                            <MDTypography variant="body2" color="textSecondary">
                              Date:{" "}
                              {new Date(client.createdAt).toLocaleDateString("fr-FR")}
                            </MDTypography>
                          </MDBox>

                          <MDBox display="flex" justifyContent="flex-end" mt={2}>
                            <Button
                              color="success"
                              sx={{ marginRight: 2 }}
                              startIcon={<CheckCircleIcon />}
                              onClick={() => handleConfirm(client._id)}
                            >
                              Confirmer
                            </Button>
                            <Button
                              color="error"
                              startIcon={<CancelIcon />}
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
