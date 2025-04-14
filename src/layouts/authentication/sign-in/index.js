import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import BasicLayout from "layouts/authentication/components/BasicLayout";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [identifiant, setIdentifiant] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [error, setError] = useState(null);
  const [identifiants, setIdentifiants] = useState([]); // State to store identifiers
  const navigate = useNavigate();

  // Fetch all identifiers from the backend when the component mounts
  useEffect(() => {
    const fetchIdentifiants = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/identifiants");
        const data = await response.json();
        if (data.success) {
          setIdentifiants(data.users);
        } else {
          console.error("Error fetching identifiers:", data.message);
        }
      } catch (err) {
        console.error("Error fetching identifiers:", err);
      }
    };

    fetchIdentifiants();
  }, []);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleSignIn = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifiant: identifiant,
          mot_de_passe: motDePasse,
        }),
      });
      const data = await response.json();
      if (data.success) {
        console.log("Connexion réussie !", data);
        navigate("/dashboard");
      } else {
        console.log("Erreur :", data.message);
        setError(data.message || "Une erreur s'est produite. Essayez à nouveau.");
      }
    } catch (err) {
      console.error("Erreur lors de la connexion:", err);
      setError("Une erreur est survenue, veuillez réessayer.");
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="error"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-10}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Se Connecter
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Identifiant"
                fullWidth
                value={identifiant}
                onChange={(e) => setIdentifiant(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Mot de Passe"
                fullWidth
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            {error && (
              <MDBox mt={2} color="error" textAlign="center">
                <MDTypography variant="body2">{error}</MDTypography>
              </MDBox>
            )}
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="error" fullWidth onClick={handleSignIn}>
                Se Connecter
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>

        {/* Display Identifiants */}
        <MDBox mt={4} textAlign="center">
          <ul>
            {identifiants.map((user, index) => (
              <li key={index}>{user.identifiant}</li>
            ))}
          </ul>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
