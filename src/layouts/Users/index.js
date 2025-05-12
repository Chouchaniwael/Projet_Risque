import { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import MDButton from "components/MDButton";
import { Snackbar, Alert } from "@mui/material";
import useUserData from "./data/userlist";

function Users() {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedUser(null);
  };

  const { columns, rows } = useUserData(handleEditClick);

  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    identifiant: "",
    name: "",
    email: "",
    role: "",
    Adresse: "",
    prenom: "",
    mot_de_passe: "",
  });

  const roles = ["admin", "Manager", "Consultant", "Directeur"];

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => {
    setOpenModal(false);
    setFormData({
      identifiant: "",
      name: "",
      email: "",
      role: "",
      Adresse: "",
      prenom: "",
      mot_de_passe: "",
    });
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
const handleEditSubmit = async () => {
  try {
    const response = await fetch(`http://localhost:5000/api/modifieruser/${selectedUser.identifiant}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nom: selectedUser.nom,
        prenom: selectedUser.prenom,
        email: selectedUser.email,
        adresse: selectedUser.Adresse,
        role: selectedUser.role,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      setSnackbarMessage(result.message || "Utilisateur modifié avec succès !");
      setSnackbarSeverity("success");
    } else {
      setSnackbarMessage(result.message || "Une erreur est survenue.");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
    handleEditModalClose();  // Fermer la fenêtre modale
  } catch (err) {
    setSnackbarMessage("Erreur réseau. Veuillez réessayer.");
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
  }
};

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/ajoutuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifiant: formData.identifiant,
          nom: formData.name,
          prenom: formData.prenom,
          email: formData.email,
          adresse: formData.Adresse,
          mot_de_passe: formData.mot_de_passe,
          role: formData.role,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        handleClose();
        setSnackbarMessage(result.message || "Utilisateur ajouté avec succès !");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage(result.message || "Une erreur est survenue.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (err) {
      setSnackbarMessage("Erreur réseau. Veuillez réessayer.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
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

          <TextField label="ID" name="identifiant" value={formData.identifiant} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Nom" name="name" value={formData.name} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Prenom" name="prenom" value={formData.prenom} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Mot de passe" name="mot_de_passe" type="password" value={formData.mot_de_passe} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth margin="normal" />
          <TextField
  select
  label="Rôle"
  name="role"
  value={formData.role}
  onChange={handleChange}
  fullWidth
  margin="normal"
  size="medium"
  SelectProps={{
    MenuProps: { disableScrollLock: true }
  }}
  InputProps={{
    sx: { height: 46 }
  }}
>
  {roles.map((role) => (
    <MenuItem key={role} value={role}>
      {role}
    </MenuItem>
  ))}
</TextField>
          <TextField label="Adresse" name="Adresse" value={formData.Adresse} onChange={handleChange} fullWidth margin="normal" />
          <Box mt={4} display="flex" gap={2}>
            <MDButton variant="contained" color="error" onClick={handleClose} fullWidth>
              Annuler
            </MDButton>
            <MDButton variant="contained" color="success" onClick={handleSubmit} fullWidth>
              Enregistrer
            </MDButton>
          </Box>
        </Box>
      </Modal>

      {/* Modal de modification utilisateur */}
      <Modal open={editModalOpen} onClose={handleEditModalClose}>
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
            Modifier l utilisateur
          </MDTypography>
          {selectedUser && (
            <>
      <TextField
  label="Nom"
  value={selectedUser.nom}
  onChange={(e) => setSelectedUser({ ...selectedUser, nom: e.target.value })}
  fullWidth
  margin="normal"
/>
<TextField
  label="Prenom"
  value={selectedUser.prenom}
  onChange={(e) => setSelectedUser({ ...selectedUser, prenom: e.target.value })}
  fullWidth
  margin="normal"
/>
<TextField
  label="Email"
  value={selectedUser.email}
  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
  fullWidth
  margin="normal"
/>
<TextField
  select
  label="Rôle"
  value={selectedUser.role}
  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
  fullWidth
  margin="normal"
  SelectProps={{ MenuProps: { disableScrollLock: true } }}
  InputProps={{ sx: { height: 46 } }}
>
  {roles.map((role) => (
    <MenuItem key={role} value={role}>
      {role}
    </MenuItem>
  ))}
</TextField>
<TextField
  label="Adresse"
  value={selectedUser.Adresse}
  onChange={(e) => setSelectedUser({ ...selectedUser, Adresse: e.target.value })}
  fullWidth
  margin="normal"
/>

              <Box mt={4} display="flex" gap={2}>
                <MDButton variant="outlined" color="error" onClick={handleEditModalClose} fullWidth>
                  Fermer
                </MDButton>
                <MDButton variant="outlined"  onClick={handleEditSubmit} color="success" fullWidth>
                  Enregistrer
                </MDButton>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Snackbar de notification */}
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Footer />
    </DashboardLayout>
  );
}

export default Users;
