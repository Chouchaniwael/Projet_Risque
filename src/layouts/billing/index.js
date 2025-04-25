/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

=========================================================
*/

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

function Securite() {
  // Fonction pour créer un item avec animation
  const renderCard = (icon, title, description = "") => (
    <Grid item xs={12} sm={6} md={4} lg={3}>
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
              {renderCard(<FaFireExtinguisher size={20} />, "Incendie")}
              {renderCard(<FaShieldAlt size={20} />, "Sécurité physique")}
              {renderCard(<FaLock size={20} />, "Contrôle d’accès")}
              {renderCard(
                <FaNetworkWired size={20} />,
                "Connectivité réseau",
                "19 Questions"
              )}
              {renderCard(<FaWater size={20} />, "Inondation", "9 Questions")}
              {renderCard(
                <FaFileAlt size={20} />,
                "Documents et équipements de sécurité",
                "10 Questions"
              )}
              {renderCard(
                <FaBolt size={20} />,
                "Electricité et climatisation",
                "8 Questions"
              )}
              {renderCard(<FaVideo size={32} />, "Monitoring du site", "7 Questions")}
            </Grid>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Securite;
