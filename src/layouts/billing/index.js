// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";

// Icons
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

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

function DetailQuestionnaire() {
  const [questionnaires, setQuestionnaires] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/questionnaireRoutes");
        const data = await response.json();
        setQuestionnaires(data);
      } catch (error) {
        console.error("Erreur lors du chargement des questionnaires :", error);
      }
    };

    fetchData();
  }, []);

  const detailQuestionnaire = (titre) => {
    navigate(`/DetailQuestionnaire/${titre}`);
  };

  const renderCard = (icon, title, description = "", onClick = null) => (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      lg={3}
      key={title}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div
        style={{
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          borderRadius: "12px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <DefaultInfoCard
          icon={
            <div
              style={{
                width: "25px",
                height: "25px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {icon}
            </div>
          }
          title={title}
          description={description}
        />
      </div>
    </Grid>
  );

  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={10}>
            <Grid container spacing={3} justifyContent="center">
              {questionnaires.map((q) =>
                renderCard(
                  iconMap[q.titre] || <FaFileAlt />,
                  q.titre,
                  `${q.sections?.[0]?.questions?.length || 0} Questions`,
                  () => detailQuestionnaire(q.titre)
                )
              )}
            </Grid>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default DetailQuestionnaire;
