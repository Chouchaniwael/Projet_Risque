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
import Footer from "examples/Footer";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DefaultInfoCard from "examples/Cards/InfoCards/DefaultInfoCard";
import { FaFireExtinguisher, FaShieldAlt, FaNetworkWired, FaWater, FaLock, FaFileAlt, FaBolt, FaVideo } from "react-icons/fa";


function Billing() {
  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox mt={8}>
        <MDBox mb={3}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} lg={8}>
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} md={6} xl={3}>
                  <DefaultInfoCard
                     icon={<FaFireExtinguisher size={24} />}
                    title="Incendie"
                  />
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                  <DefaultInfoCard
                   icon= {<FaShieldAlt size={24} />}
                    title="Sécurité physique"
                  />
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                  <DefaultInfoCard
                    icon={<FaLock size={24} />}
                    title="Contrôle d’accès"
                  />
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                  <DefaultInfoCard
                    icon={<FaNetworkWired size={24} />}
                    title="Connectivité réseau"
                    description="19 Questions"
                  />
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                  <DefaultInfoCard
                    icon={<FaWater size={24} />}
                    title="Inondation"
                    description="9 Questions"
                  />
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                  <DefaultInfoCard
                    icon={<FaFileAlt size={24} />}
                    title="Documents et équipements de sécurité"
                    description="10 Questions"
                  />
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                  <DefaultInfoCard
                    icon={<FaBolt size={24} />}
                    title="Electricité et climatisation"
                    description="8 questions"
                  />
                </Grid>
                <Grid item xs={12} md={6} xl={3}>
                  <DefaultInfoCard
                    icon={<FaVideo size={24} />}
                    title="Monitoring du site"
                    description="7 Questions"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox mb={3}></MDBox>
      </MDBox>
    </DashboardLayout>
  );
}

export default Billing;
