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
  const [clientsValidation, setClientsValidation] = useState([]); // Clients à valider
  const [clientsArchivage, setClientsArchivage] = useState([]); // Clients à archiver
  const navigate = useNavigate();

  // Charger les clients en attente de validation (Statut: false)
  const loadClientsValidation = async () => {
    try {
      const response = await axios.get(apiUrl);
      // Filtrer les clients avec Statut: false (en attente de validation)
      const pendingClients = response.data.filter(
        (client) => client.Statut === false
      );
      setClientsValidation(pendingClients);
    } catch (error) {
      console.error("Erreur lors de la récupération des clients en attente de validation", error);
    }
  };

  // Charger les clients en attente d'archivage (etatarchivage: 1)
  const loadClientsArchivage = async () => {
    try {
      const response = await axios.get(apiUrl);
      // Filtrer les clients avec etatarchivage: 1 (en attente d'archivage)
      const archivageClients = response.data.filter(
        (client) => client.etatarchivage === 1
      );
      setClientsArchivage(archivageClients);
    } catch (error) {
      console.error("Erreur lors de la récupération des clients en attente d'archivage", error);
    }
  };

  useEffect(() => {
    loadClientsValidation();
    loadClientsArchivage();
  }, []);

  // Fonction pour valider un client
  const handleConfirmValidation = async (clientId) => {
    try {
      await axios.put(`${apiUrl}/${clientId}/approve`);
      setClientsValidation((prevClients) =>
        prevClients.map((client) =>
          client._id === clientId ? { ...client, Statut: true } : client
        )
      );
    } catch (error) {
      console.error("Erreur lors de la validation du client", error);
    }
  };

  // Fonction pour rejeter un client
  const handleRejectValidation = async (clientId) => {
    try {
      await axios.put(`${apiUrl}/${clientId}/reject`);
      setClientsValidation((prevClients) =>
        prevClients.map((client) =>
          client._id === clientId ? { ...client, Statut: false } : client
        )
      );
    } catch (error) {
      console.error("Erreur lors du rejet du client", error);
    }
  };

  // Fonction pour valider l'archivage d'un client
  // Fonction pour valider l'archivage d'un client
// Fonction pour valider l'archivage d'un client
const handleConfirmArchivage = async (clientId) => {
  try {
    const response = await axios.put(`${apiUrl}/archiver/${clientId}`);  // Appel API pour valider l'archivage
    console.log("Réponse de l'API pour l'archivage:", response);
    if (response.status === 200) {
      setClientsArchivage((prevClients) =>
        prevClients.map((client) =>
          client._id === clientId ? { ...client, etatarchivage: 2 } : client  // Passer à etatarchivage === 2
        )
      );
    }
  } catch (error) {
    console.error("Erreur lors de l'archivage du client", error);
  }
};

// Fonction pour annuler l'archivage d'un client
const handleRejectArchivage = async (clientId) => {
  try {
    const response = await axios.put(`${apiUrl}/unarchive/${clientId}`);  // Appel API pour annuler l'archivage
    console.log("Réponse de l'API pour annuler l'archivage:", response);
    if (response.status === 200) {
      setClientsArchivage((prevClients) =>
        prevClients.map((client) =>
          client._id === clientId ? { ...client, etatarchivage: 0 } : client  // Revenir à etatarchivage === 0
        )
      );
    }
  } catch (error) {
    console.error("Erreur lors de l'annulation de l'archivage du client", error);
  }
};


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          {/* Section Clients à valider */}
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
                  {clientsValidation.map((client) => (
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

                          <MDBox display="flex" justifyContent="flex-end" mt={2}>
                            <Button
                              color="success"
                              sx={{ marginRight: 2 }}
                              startIcon={<CheckCircleIcon />}
                              onClick={() => handleConfirmValidation(client._id)}
                            >
                              Confirmer
                            </Button>
                            <Button
                              color="error"
                              startIcon={<CancelIcon />}
                              onClick={() => handleRejectValidation(client._id)}
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

          {/* Section Clients à archiver */}
          <Grid item xs={12}>
            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="secondary"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white" fontWeight="bold">
                  Liste des Clients à archiver
                </MDTypography>
              </MDBox>

              <MDBox pt={3} px={2} pb={2}>
                <Grid container spacing={3}>
                  {clientsArchivage.map((client) => (
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
                              color={client.etatarchivage === 1 ? "warning.main" : "success.main"}
                              fontWeight="medium"
                            >
                              Statut Archivage: {client.etatarchivage === 1 ? "En attente" : "Archivé"}
                            </MDTypography>
                          </MDBox>

                          <MDBox display="flex" justifyContent="flex-end" mt={2}>
                            <Button
                              color="success"
                              sx={{ marginRight: 2 }}
                              startIcon={<CheckCircleIcon />}
                              onClick={() => handleConfirmArchivage(client._id)}
                            >
                              Archiver
                            </Button>
                            <Button
                              color="error"
                              startIcon={<CancelIcon />}
                              onClick={() => handleRejectArchivage(client._id)}
                            >
                              Annuler Archivage
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
