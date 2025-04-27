import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";  // Importation de useNavigate
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton"; 
import defaultImage from "assets/images/team-3.jpg";
import { Grid } from "@mui/material";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import RiskMatrixTable from "./RiskMatrixTable"; 

const ClientDetailPage = () => {
  
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const navigate = useNavigate(); // Initialiser le hook useNavigate

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

  const handleClientInfoClick = () => {
    // Navigation vers la page d'informations du client avec l'ID comme paramètre
    navigate(`/ClientProfilePage/${id}`);
  };
  const handleGestionRisqueClick = () => {
    navigate(`/GestionRisque/${id}`);
  };

  if (!client) {
    return (
      <MDBox display="flex" justifyContent="center" alignItems="center" style={{ height: "100vh" }}>
        <div>Chargement du client...</div>
      </MDBox>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox display="flex" flexDirection="column" justifyContent="space-between" minHeight="100vh">
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
          </MDBox>
        </MDBox>
        <MDBox py={3}>
          <Grid container spacing={3} justifyContent="flex-start">
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="dark"
                  icon="weekend"
                  title="Risques extrêmes"
                  count={3}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  icon="leaderboard"
                  title="Risques élevés"
                  count="2"
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
                />
              </MDBox>
            </Grid>
          </Grid>
          <MDBox mt={4}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <MDButton
                  variant="gradient"
                  color="dark"
                  fullWidth
                  onClick={handleClientInfoClick} // Ajoutez cette ligne pour la redirection
                >
                  Gestion du client
                </MDButton>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MDButton variant="gradient" color="info" fullWidth  onClick={handleGestionRisqueClick}>
                  Gérer risque
                </MDButton>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MDButton variant="gradient" color="success" fullWidth>
                  Gestion des sites
                </MDButton>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MDButton variant="gradient" color="primary" fullWidth>
                  Consulter Plan d&apos;action
                </MDButton>
              </Grid>
            </Grid>
          </MDBox>

          <MDBox mt={4}>
            <MDTypography variant="h5" fontWeight="medium" mb={2}>
              Cartographie des risques
            </MDTypography>
            <RiskMatrixTable />
          </MDBox>
        </MDBox>
        <Footer />
      </MDBox>
    </DashboardLayout>
  );
};

export default ClientDetailPage;
