import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import defaultImage from "assets/images/team-3.jpg";
import { Grid } from "@mui/material"; // Importer Grid de Material UI
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard"; // Assure-toi que ce composant existe
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

const ClientDetailPage = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        console.log("Fetching client with id:", id);
        const response = await fetch(`http://localhost:5000/api/clients?name=${id}`);
        const data = await response.json();
        console.log("Données reçues:", data);
        setClient(data[0] || null);
      } catch (error) {
        console.error("Erreur de chargement du client:", error);
      }
    };

    fetchClient();
  }, [id]);

  if (!client) {
    return (
      <MDBox display="flex" justifyContent="center" alignItems="center" style={{ height: "100vh" }}>
        <div>Chargement du client...</div>
      </MDBox>
    );
  }

  if (client === null || Object.keys(client).length === 0) {
    return (
      <MDBox display="flex" justifyContent="center" alignItems="center" style={{ height: "100vh" }}>
        <div>Aucun client trouvé</div>
      </MDBox>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox display="flex" flexDirection="column" justifyContent="space-between" minHeight="100vh">
        <MDBox py={3}>
          {/* Cartes statistiques en haut de la page */}
          <Grid container spacing={3} justifyContent="flex-start">
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="dark"
                  icon="weekend"
                  title="Risques extrêmes"
                  count={3}
                  percentage={{
                    color: "success",
                    amount: "+55%",
                    label: "than last week",
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  icon="leaderboard"
                  title="Risques élevés"
                  count="2"
                  percentage={{
                    color: "success",
                    amount: "+3%",
                    label: "than last month",
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="success"
                  icon="store"
                  title="Risques modérés"
                  count="1"
                  percentage={{
                    color: "success",
                    amount: "+1%",
                    label: "than yesterday",
                  }}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="primary"
                  icon="person_add"
                  title="Risques faibles"
                  count="5"
                  percentage={{
                    color: "success",
                    amount: "",
                    label: "Consulter",
                  }}
                />
              </MDBox>
            </Grid>
          </Grid>

          {/* Affichage des informations client */}
          <MDBox display="flex" alignItems="center">
            <MDAvatar
              src={client.Logo ? `http://localhost:5000/images/${client.Logo}` : defaultImage}
              name={client.Nom}
              size="xl"
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
        <Footer />
      </MDBox>
    </DashboardLayout>
  );
};

export default ClientDetailPage;
