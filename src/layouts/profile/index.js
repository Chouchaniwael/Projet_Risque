import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { styled } from "@mui/material/styles";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Layouts et composants
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Header from "layouts/profile/components/Header";

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Styled components for badge-like appearance
const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
  borderRadius: theme.spacing(2),
  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1), 0 0 0 4px rgba(255, 255, 255, 0.3)",
  position: "relative",
  overflow: "visible",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15), 0 0 0 6px rgba(255, 255, 255, 0.4)",
  },
  // Badge ribbon effect
  "&:before": {
    content: '"✓ Verified"',
    position: "absolute",
    top: 20,
    right: -30,
    background: "linear-gradient(45deg, #4caf50, #81c784)",
    color: "#fff",
    padding: "4px 16px",
    fontSize: "12px",
    fontWeight: "bold",
    transform: "rotate(45deg)",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  marginBottom: theme.spacing(2),
  background: "linear-gradient(45deg,rgb(119, 115, 117),rgb(29, 26, 28))",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "scale(1.1)",
    boxShadow: "0 0 12px rgba(25, 118, 210, 0.5)",
  },
}));

function Overview() {
  const [profileData, setProfileData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfileData(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données du profil :", error);
        navigate("/login");
      }
    };

    fetchProfileData();
  }, [navigate]);

  if (!profileData) return <div>Chargement...</div>;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header>
        <MDBox mt={8} mb={4}>
          <Grid container spacing={3} justifyContent="center">
            {/* Colonne droite - Carte identité */}
            <Grid item xs={12} sm={8} md={6} lg={4}>
              <StyledCard>
                <StyledAvatar>
                  <AccountCircleIcon sx={{ fontSize: 70, color: "#fff" }} />
                </StyledAvatar>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="black"
                  gutterBottom
                  sx={{ textAlign: "center" }}
                >
                  {profileData.name}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ textAlign: "center", mb: 2 }}
                >
                  {profileData.email}
                </Typography>
                <Divider sx={{ my: 3, width: "80%", background: "linear-gradient(90deg, #1976d2, #42a5f5, #e7d5d9);" }} />
                <Box textAlign="left" width="100%" px={2}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Identifiant :</strong> {profileData.identifiant}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Mobile :</strong> {profileData.mobile}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Adresse :</strong> {profileData.address}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Date de création :</strong> {profileData.datecreation}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Rôle :</strong>{" "}
                    <Box
                      component="span"
                      sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor: profileData.role === "admin" ? "#d81b60" : "#1976d2",
                        color: "#fff",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                      }}
                    >
                      {profileData.role.toUpperCase()}
                    </Box>
                  </Typography>
                </Box>
              </StyledCard>
            </Grid>
          </Grid>
        </MDBox>
      </Header>
    </DashboardLayout>
  );
}

export default Overview;