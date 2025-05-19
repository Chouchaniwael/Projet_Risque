import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
import PeopleIcon from "@mui/icons-material/People";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 React base styles
import breakpoints from "assets/theme/base/breakpoints";

// Images
import burceMars from "assets/images/bruce-mars.jpg";
import backgroundImage from "assets/images/bg-profile.jpeg";

function Header({ children }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const [userData, setUserData] = useState(null);  // Stocke les données de l'utilisateur

  // Gère l'orientation des onglets en fonction de la taille de l'écran
  useEffect(() => {
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    window.addEventListener("resize", handleTabsOrientation);
    handleTabsOrientation();

    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, []);

  // Récupère les données utilisateur depuis l'API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token manquant !");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Vérifiez ce que l'API renvoie
        console.log("Données utilisateur récupérées : ", response.data);

        // Stocke les données dans le state
        setUserData(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur : ", error);
      }
    };

    fetchUserData();
  }, []);  // Se déclenche uniquement lors du premier rendu du composant

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  if (!userData) {
    return <div>Chargement...</div>;  // Affiche un message de chargement pendant que les données sont récupérées
  }

  return (
    <MDBox position="relative" mb={5}>
      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.6),
              rgba(gradients.info.state, 0.6)
            )}, url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        sx={{
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <MDAvatar
  size="xl"
  shadow="sm"
  sx={{ bgcolor: "grey.300", display: "flex", alignItems: "center", justifyContent: "center" }}
>
  <PeopleIcon sx={{ fontSize: 40, color: "grey.700" }} />
</MDAvatar>

          </Grid>
          <Grid item>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              <MDTypography variant="h5" fontWeight="medium">
             Informations utilisateur
              </MDTypography>
              <MDTypography variant="button" color="text" fontWeight="regular">
                {userData.role || "Position non définie"} {/* Affichage de la position de l'utilisateur */}
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4} sx={{ ml: "auto" }}>
            <AppBar position="static">
              <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                <Tab
                  label={
                    <MDTypography variant="button" fontWeight="regular" color="text">
                      Profile
                    </MDTypography>
                  }
                  icon={<Icon>person</Icon>}
                  iconPosition="start"
                />
                <Tab
                  label={
                    <MDTypography variant="button" fontWeight="regular" color="text">
                      Settings
                    </MDTypography>
                  }
                  icon={<Icon>settings</Icon>}
                  iconPosition="start"
                />
                <Tab
                  label={
                    <MDTypography variant="button" fontWeight="regular" color="text">
                      Projects
                    </MDTypography>
                  }
                  icon={<Icon>assignment</Icon>}
                  iconPosition="start"
                />
                <Tab
                  label={
                    <MDTypography variant="button" fontWeight="regular" color="text">
                      Activity
                    </MDTypography>
                  }
                  icon={<Icon>bar_chart</Icon>}
                  iconPosition="start"
                />
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
        {children}
      </Card>
    </MDBox>
  );
}

Header.defaultProps = {
  children: "",
};

Header.propTypes = {
  children: PropTypes.node,
};

export default Header;
