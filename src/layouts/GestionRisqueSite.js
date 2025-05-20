import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import MDAvatar from "components/MDAvatar";
import defaultImage from "assets/images/team-3.jpg";
import MDBox from "components/MDBox";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";
import MDButton from 'components/MDButton';
import {
  FaFireExtinguisher,
  FaShieldAlt,
  FaNetworkWired,
  FaWater,
  FaLock,
  FaFileAlt,
  FaBolt,
  FaVideo,
} from "react-icons/fa";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

const iconMap = {
  "Incendie": <FaFireExtinguisher size={20} />,
  "Sécurité physique": <FaShieldAlt size={20} />,
  "Contrôle d’accès": <FaLock size={20} />,
  "Connectivité réseau": <FaNetworkWired size={20} />,
  "Inondation": <FaWater size={20} />,
  "Documents et équipements de sécurité": <FaFileAlt size={20} />,
  "Electricité et climatisation": <FaBolt size={20} />,
  "Monitoring du site": <FaVideo size={20} />,
};

const GestionRisqueSite = () => {
  const { id } = useParams(); // ID du site (peut être site._id)
  const navigate = useNavigate();
  const [site, setSite] = useState(null);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/sites/byId/${id}`);
        const data = await response.json();
        setSite(data || null);
      } catch (error) {
        console.error("Erreur lors du chargement du site :", error);
      }
    };

    const fetchQuestionnaires = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/questionnaire_site");
        const data = await response.json();
        setQuestionnaires(data);
      } catch (error) {
        console.error("Erreur lors du chargement des questionnaires :", error);
      }
    };

    const fetchSelectedQuestionnaires = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/questionnaire_site?siteId=${id}`);
        const data = await response.json();
        const existing = data.map((q) => q.titre);
        setSelected(existing);
      } catch (error) {
        console.error("Erreur lors du chargement des questionnaires du site :", error);
      }
    };

    fetchSite();
    fetchQuestionnaires();
    fetchSelectedQuestionnaires();
  }, [id]);

  const toggleSelect = (titre) => {
    setSelected((prev) =>
      prev.includes(titre) ? prev.filter((t) => t !== titre) : [...prev, titre]
    );
  };

  const handleNext = () => {
    navigate(`/GestionRisqueSite/${id}/Validation`, {
      state: {
        selectedQuestionnaires: selected,
        siteId: id,
      },
    });
  };

  if (!site) {
    return (
      <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography align="center">Chargement du site...</Typography>
      </MDBox>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox px={3} py={2}>
        <Card sx={{ mb: 4, width: "100%" }}>
          <CardContent>
            <MDBox display="flex" alignItems="center" justifyContent="flex-start" px={5}>
              <MDAvatar
                src={defaultImage}
                name={site.Nom}
                size="lg"
                sx={{ marginRight: 3 }}
              />
              <MDBox>
                <Typography variant="h5" align="left">
                  {site.Nom}
                </Typography>
                <Typography variant="body1" align="left" sx={{ mt: 1 }}>
                  Sélectionnez les questionnaires à appliquer au site.
                </Typography>
              </MDBox>
            </MDBox>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {questionnaires.map((q) => {
            const isSelected = selected.includes(q.titre);
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={q.titre} onClick={() => toggleSelect(q.titre)}>
                <div
                  style={{
                    cursor: "pointer",
                    transform: isSelected ? "scale(1.05)" : "scale(1)",
                    boxShadow: isSelected ? "0 10px 20px rgba(0,0,0,0.2)" : "none",
                    border: isSelected ? "2px solid #1976d2" : "2px solid transparent",
                    borderRadius: "12px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <DefaultInfoCard
                    icon={<div style={{ width: 25 }}>{iconMap[q.titre] || <FaFileAlt />}</div>}
                    title={q.titre}
                    description={`${q.sections?.[0]?.questions?.length || 0} Questions`}
                  />
                </div>
              </Grid>
            );
          })}
        </Grid>

        {questionnaires.length > 0 && (
          <MDBox mt={4} display="flex" justifyContent="center">
            <MDButton
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={selected.length === 0}
            >
              Suivant
            </MDButton>
          </MDBox>
        )}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default GestionRisqueSite;
