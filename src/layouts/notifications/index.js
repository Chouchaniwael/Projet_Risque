import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function Notifications() {
  const [clientsNonValides, setClientsNonValides] = useState([]); // Clients avec Statut=false
  const [clientsEnSuppression, setClientsEnSuppression] = useState([]); // Clients avec etatarchivage=1

  useEffect(() => {
    // Charger les clients non validés
    fetch("http://localhost:5000/api/clients?statut=false")
      .then((response) => response.json())
      .then((data) => {
        setClientsNonValides(data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des clients non validés :", error);
      });

    // Charger les clients en demande de suppression
    fetch("http://localhost:5000/api/clients?etatarchivage=1")
      .then((response) => response.json())
      .then((data) => {
        setClientsEnSuppression(data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des clients en suppression :", error);
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
                {clientsNonValides.length > 0 ? (
                  clientsNonValides.map((client, index) => (
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

          <Grid item xs={12} lg={8}>
            <Card>
              <MDBox p={2}>
                <MDTypography variant="h5">Demandes archivage client</MDTypography>
              </MDBox>
              <MDBox pt={2} px={2}>
                {clientsEnSuppression.length > 0 ? (
                  clientsEnSuppression.map((client, index) => (
                    <MDAlert key={index} color="error" dismissible>
                      <MDTypography variant="body2" color="white">
                        {client.Nom} - {client.Contact} - {client.Mail}
                      </MDTypography>
                    </MDAlert>
                  ))
                ) : (
                  <MDAlert color="success" dismissible>
                    <MDTypography variant="body2" color="white">
                      Aucune demande d&apos;archivage.
                    </MDTypography> 
                  </MDAlert>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Notifications;
