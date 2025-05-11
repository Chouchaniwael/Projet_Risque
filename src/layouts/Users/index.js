import { useState } from "react";
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
import MDButton from "components/MDButton";
// Hook pour les données utilisateurs
import useUserData from "./data/userlist";

function Users() {
  const { columns, rows } = useUserData();

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => {
    setOpenModal(false);
    setFormData({ name: "", email: "", role: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Utilisateur ajouté (non sauvegardé):", formData);
    handleClose(); // Ferme la modale après "soumission"
  };

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
                coloredShadow="info"
              >
                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                  <MDTypography variant="h6" color="white">
                    Liste des utilisateurs
                  </MDTypography>
                  <MDBox
                    display="flex"
                    alignItems="center"
                    sx={{ cursor: "pointer" }}
                    onClick={handleOpen}
                  >
                    <Icon fontSize="small" color="inherit">
                      person_add
                    </Icon>
                    <MDTypography variant="button" fontWeight="medium" color="white" ml={1}>
                      Ajouter un utilisateur
                    </MDTypography>
                  </MDBox>
                </MDBox>
              </MDBox>

              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
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

      {/* Modal d'ajout utilisateur */}
      <Modal open={openModal} onClose={handleClose}>
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
            Ajouter un utilisateur
          </MDTypography>
          <TextField
            label="Nom"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Rôle"
            name="role"
            value={formData.role}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
             <TextField
            label="Adresse"
            name="Adresse"
            value={formData.Adresse}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Box mt={4} display="flex" justifyContent="center">
            <MDButton variant="contained" color="error" onClick={handleClose} fullWidth>
              Annuler
            </MDButton>
            <MDButton variant="contained" color="success" onClick={handleSubmit} fullWidth>
              Enregistrer
            </MDButton>
          </Box>
        </Box>
      </Modal>
    </DashboardLayout>
  );
}

export default Users;
