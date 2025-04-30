import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function Notifications() {
  const [clients, setClients] = useState([]); // État pour stocker les clients récupérés
  const [successSB, setSuccessSB] = useState(false);
  const [infoSB, setInfoSB] = useState(false);
  const [warningSB, setWarningSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const openInfoSB = () => setInfoSB(true);
  const closeInfoSB = () => setInfoSB(false);
  const openWarningSB = () => setWarningSB(true);
  const closeWarningSB = () => setWarningSB(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);

  useEffect(() => {
    // Appel de l'API pour récupérer les clients avec un statut `true`
    fetch("http://localhost:5000/api/clients?statut=false")
      .then((response) => response.json())
      .then((data) => {
        setClients(data); // On met à jour l'état avec les clients récupérés
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des clients :", error);
      });
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={8}>
            <Card>
              <MDBox p={2}>
                <MDTypography variant="h5">Clients en attente de confirmation</MDTypography>
              </MDBox>
              <MDBox pt={2} px={2}>
                {/* Affichage des alertes de chaque client */}
                {clients.length > 0 ? (
                  clients.map((client, index) => (
                    <MDAlert key={index} color="primary" dismissible>
                      <MDTypography variant="body2" color="white">
                        {client.Nom} - {client.Contact} - {client.Mail}
                      </MDTypography>
                    </MDAlert>
                  ))
                ) : (
                  <MDAlert color="warning" dismissible>
                    <MDTypography variant="body2" color="white">
                      Aucun client trouvé avec le statut non Validé.
                    </MDTypography>
                  </MDAlert>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
     
    </DashboardLayout>
  );
}

export default Notifications;
