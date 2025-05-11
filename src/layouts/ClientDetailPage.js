import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";
import defaultImage from "assets/images/team-3.jpg";
import { Grid, Card, Typography } from "@mui/material";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import RiskMatrixTable from "./RiskMatrixTable";

const ClientDetailPage = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [risquesData, setRisquesData] = useState({
    faible: 0,
    moyen: 0,
    fort: 0,
    accepte: 0,
    inconnu: 0,
  });
  const [risques, setRisques] = useState([]);
  const [agences, setAgences] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/clients?name=${id}`);
        const data = await response.json();
        setClient(data[0] || null);
      } catch (error) {
        console.error("Erreur de chargement du client:", error);
      }
    };
    fetchClient();
  }, [id]);

 useEffect(() => {
  const fetchRisques = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/questionnaire_projet?projet=${id}`);
      const data = await response.json();
      console.log(data);

      // Comptabiliser les risques par type
      const compteRisques = {
        faible: 0,
        moyen: 0,
        fort: 0,
        accepte: 0,
        inconnu: 0,
      };

      // Comptabiliser chaque risque en fonction de son type
      data.forEach((questionnaire) => {
        const risque = questionnaire.analyse.risqueNet; // Adaptez à la structure de vos données
        console.log("Risque:", risque); // Debugging  
        if (risque) {
          switch (risque) {
            case 'Faible':
              compteRisques.faible += 1;
              break;
            case 'Moyen':
              compteRisques.moyen += 1;
              break;
            case 'Fort':
              compteRisques.fort += 1;
              break;
            case 'Accepté':
              compteRisques.accepte += 1;
              break;
            default:
              compteRisques.inconnu += 1;
              break;
          }
        }
      });

      setRisquesData(compteRisques);
      setRisques(data.risques || []);
      setAgences(data.agences || []);
    } catch (error) {
      console.error("Erreur de chargement des risques:", error);
    }
  };
  fetchRisques();
}, [id]);


  const handleClientInfoClick = () => {
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
      <MDBox display="flex" flexDirection="column" justifyContent="space-between" minHeight="65vh">

        {/* --- Badge Card en-tête pleine largeur --- */}
        <Card
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            p: 2,
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            mb: 3, // espace sous la card
          }}
        >
          <MDAvatar
            src={client.Logo ? `http://localhost:5000/images/${client.Logo}` : defaultImage}
            name={client.Nom}
            size="xl"
          />
          <Typography variant="h6" sx={{ ml: 2 }}>
            {client.Nom}
          </Typography>
        </Card>

        {/* Grid container pour les stats */}
        <Grid container spacing={2} alignItems="center" mb={0}>
          <Grid item>
            <MDTypography variant="h4" fontWeight="medium">
              {client.Nom}
            </MDTypography>
          </Grid>
        </Grid>

        {/* Statistiques risques */}
        <MDBox py={3} px={2} mt={1} mb={2} lineHeight={1}>
          <Grid container spacing={3} justifyContent="flex-start">
            <Grid item xs={12} sm={6} md={2.4}>
              <ComplexStatisticsCard
                color="error" // Rouge foncé pour extrême
                icon="warning"
                title="Risques extrêmes"
                count={risquesData.extreme || 0}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <ComplexStatisticsCard
                color="warning" // Orange pour fort
                icon="priority_high"
                title="Risques forts"
                count={risquesData.fort || 0}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <ComplexStatisticsCard
                color="info" // Bleu pour moyen
                icon="signal_cellular_4_bar"
                title="Risques moyens"
                count={risquesData.moyen || 0}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <ComplexStatisticsCard
                color="success" // Vert pour faible
                icon="check_circle"
                title="Risques faibles"
                count={risquesData.faible || 0}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <ComplexStatisticsCard
                color="secondary" // Gris pour accepté
                icon="check_circle_outline"
                title="Risques acceptés"
                count={risquesData.accepte || 0}
              />
            </Grid>
          </Grid>

          {/* Boutons d'action */}
          <MDBox mt={4}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <MDButton variant="gradient" color="dark" fullWidth onClick={handleClientInfoClick}>
                  Gestion du client
                </MDButton>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MDButton variant="gradient" color="dark" fullWidth onClick={handleGestionRisqueClick}>
                  Gérer risque
                </MDButton>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MDButton variant="gradient" color="dark" fullWidth>
                  Gestion des sites
                </MDButton>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MDButton variant="gradient" color="dark" fullWidth>
                  Générer plan d&apos;action via IA
                </MDButton>
              </Grid>
            </Grid>
          </MDBox>

          {/* Tableau des risques */}
          <MDBox mt={4}>
            <MDTypography variant="h5" fontWeight="medium" mb={2}>
              Cartographie des risques
            </MDTypography>
            <RiskMatrixTable risques={risques} agences={agences} />
          </MDBox>
        </MDBox>
    
      </MDBox>
    </DashboardLayout>
  );
};

export default ClientDetailPage;
