import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import generateSitesTableData from "./tables/data/SiteTableData";

function ClientSitesPage() {
  const { id } = useParams(); // nom du client
  const navigate = useNavigate();
  const [tableData, setTableData] = useState({ columns: [], rows: [] });

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData({ Nom: "", adresse: "", mail: "", Contact: "" });
  };

  const [formData, setFormData] = useState({
    Nom: "",
    adresse: "",
    mail: "",
    Contact: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGestionRisqueClick = (site) => {
    navigate(`/GestionRisqueSite/${site._id}`);
  };

  const fetchSites = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/sites/${id}`);
      const sites = await response.json();
      const data = generateSitesTableData(sites, handleGestionRisqueClick);
      setTableData(data);
    } catch (error) {
      console.error("Erreur de chargement des sites :", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const newSite = { ...formData, ClientNom: id };
      const response = await fetch("http://localhost:5000/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSite),
      });

      if (!response.ok) throw new Error("Erreur lors de l’ajout du site");

      await fetchSites();
      handleClose();
    } catch (error) {
      console.error("Erreur ajout site :", error);
    }
  };

  useEffect(() => {
    fetchSites();
  }, [id]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="primary"
                borderRadius="lg"
                coloredShadow="primary"
              >
                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                  <MDTypography variant="h6" color="white">
                    Liste des sites du client {id}
                  </MDTypography>

                  <MDBox display="flex" gap={2}>
                    <MDBox
                      display="flex"
                      alignItems="center"
                      sx={{ cursor: "pointer" }}
                      onClick={() => navigate(-1)}
                    >
                      <Icon fontSize="small" color="inherit">arrow_back</Icon>
                      <MDTypography variant="button" fontWeight="medium" color="white" ml={1}>
                        Retour
                      </MDTypography>
                    </MDBox>

                    <MDBox
                      display="flex"
                      alignItems="center"
                      sx={{ cursor: "pointer" }}
                      onClick={handleOpen}
                    >
                      <Icon fontSize="small" color="inherit">add</Icon>
                      <MDTypography variant="button" fontWeight="medium" color="white" ml={1}>
                        Ajouter un site
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </MDBox>
              </MDBox>

              <MDBox pt={3}>
                <DataTable
                  table={tableData}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* ✅ MODAL AJOUT SITE */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <MDTypography variant="h6" gutterBottom>
            Ajouter un site pour {id}
          </MDTypography>
          <TextField
            label="Nom"
            fullWidth
            name="Nom"
            value={formData.Nom}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Adresse"
            fullWidth
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Email"
            fullWidth
            name="mail"
            value={formData.mail}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Contact"
            fullWidth
            name="Contact"
            value={formData.Contact}
            onChange={handleChange}
            sx={{ mt: 2 }}
          />
          <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
            <Button variant="outlined" onClick={handleClose}>Annuler</Button>
            <Button variant="contained" onClick={handleSubmit}>Ajouter</Button>
          </Box>
        </Box>
      </Modal>

      <Footer />
    </DashboardLayout>
  );
}

export default ClientSitesPage;
