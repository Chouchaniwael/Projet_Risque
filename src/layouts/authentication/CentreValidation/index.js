import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Paper from "@mui/material/Paper";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";
import MDButton from "components/MDButton";
const apiUrl = "http://localhost:5000/api/clients";

// ✅ Composant Section
const Section = ({ title, children }) => (
  <Card sx={{ boxShadow: 3, borderRadius: 2, mb: 4 }}>
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
      <MDTypography variant="h6" color="white" fontWeight="bold">
        {title}
      </MDTypography>
    </MDBox>
    <MDBox pt={3} px={2} pb={2}>
      <Grid container spacing={3}>{children}</Grid>
    </MDBox>
  </Card>
);

Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

// ✅ Composant ClientCard
const ClientCard = ({ client, onConfirm, onReject, statusLabel }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Paper elevation={2} sx={{ p: 2 }}>
      <MDTypography variant="h6" fontWeight="bold">
        {client.Nom}
      </MDTypography>
      <MDTypography variant="body2" sx={{ mt: 1 }} color="text.secondary">
        {statusLabel}
      </MDTypography>
      <MDBox display="flex" justifyContent="flex-end" mt={2}>
        <MDButton
          variant="outlined"
          color="success"
          sx={{ mr: 1 }}
          onClick={() => onConfirm(client._id)}
          startIcon={<CheckCircleIcon />}
        >
          Confirmer
        </MDButton>
        <MDButton
          variant="outlined"
          color="error"
          onClick={() => onReject(client._id)}
          startIcon={<CancelIcon />}
        >
          Rejeter
        </MDButton>
      </MDBox>
    </Paper>
  </Grid>
);

ClientCard.propTypes = {
  client: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    Nom: PropTypes.string.isRequired,
    Statut: PropTypes.bool,
    etatarchivage: PropTypes.number,
  }).isRequired,
  onConfirm: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  statusLabel: PropTypes.string.isRequired,
};

// ✅ Composant UserCard
const UserCard = ({ user, handleConfirmUserValidation, handleRejectUserValidation }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Paper elevation={2} sx={{ p: 2 }}>
      <MDTypography variant="h6" fontWeight="bold">
        {user.nom}
      </MDTypography>
      <MDTypography variant="body2" sx={{ mt: 1 }} color="text.secondary">
        Statut : {user.Statut ? "Confirmé" : "Non confirmé"}
      </MDTypography>
      <MDBox display="flex" justifyContent="flex-end" mt={2}>
        <MDButton
          variant="outlined"
          color="success"
          sx={{ mr: 1 }}
          onClick={() => handleConfirmUserValidation(user._id)}
          startIcon={<CheckCircleIcon />}
        >
          Confirmer
        </MDButton>
        <MDButton
          variant="outlined"
          color="error"
          onClick={() => handleRejectUserValidation(user._id)}
          startIcon={<CancelIcon />}
        >
          Rejeter
        </MDButton>
      </MDBox>
    </Paper>
  </Grid>
);

UserCard.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nom: PropTypes.string.isRequired,
    Statut: PropTypes.bool,
  }).isRequired,
  handleConfirmUserValidation: PropTypes.func.isRequired,
  handleRejectUserValidation: PropTypes.func.isRequired,
};

// ✅ Composant principal
function CentreValidation() {
  const [clientsValidation, setClientsValidation] = useState([]);
  const [clientsArchivage, setClientsArchivage] = useState([]);
  const [usersValidation, setUsersValidation] = useState([]);
  const navigate = useNavigate();

  const loadClientsValidation = async () => {
    try {
      const response = await axios.get(apiUrl);
      const pendingClients = response.data.filter(client => client.Statut === false);
      setClientsValidation(pendingClients);
    } catch (error) {
      console.error("Erreur chargement clients à valider", error);
    }
  };

  const loadClientsArchivage = async () => {
    try {
      const response = await axios.get(apiUrl);
      const archivageClients = response.data.filter(client => client.etatarchivage === 1);
      setClientsArchivage(archivageClients);
    } catch (error) {
      console.error("Erreur chargement clients à archiver", error);
    }
  };

  const loadUsersValidation = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      const pendingUsers = response.data.filter(user => user.statut === false);
      setUsersValidation(pendingUsers);
    } catch (error) {
      console.error("Erreur chargement utilisateurs à valider", error);
    }
  };

  useEffect(() => {
    loadClientsValidation();
    loadClientsArchivage();
    loadUsersValidation();
  }, []);

  const handleConfirmValidation = async (clientId) => {
    try {
      await axios.put(`${apiUrl}/${clientId}/approve`);
      loadClientsValidation();
    } catch (error) {
      console.error("Erreur validation client", error);
    }
  };

  const handleRejectValidation = async (clientId) => {
    try {
      await axios.put(`${apiUrl}/${clientId}/reject`);
      loadClientsValidation();
    } catch (error) {
      console.error("Erreur rejet client", error);
    }
  };

  const handleConfirmArchivage = async (clientId) => {
    try {
      await axios.put(`${apiUrl}/archiver/${clientId}`);
      loadClientsArchivage();
    } catch (error) {
      console.error("Erreur archivage client", error);
    }
  };

  const handleRejectArchivage = async (clientId) => {
    try {
      await axios.put(`${apiUrl}/unarchive/${clientId}`);
      loadClientsArchivage();
    } catch (error) {
      console.error("Erreur annulation archivage client", error);
    }
  };

  const handleConfirmUserValidation = async (userId) => {
    try {
      await axios.put(`http://localhost:5000/api/validationuser/${userId}/approve`);
      loadUsersValidation();
    } catch (error) {
      console.error("Erreur validation utilisateur", error);
    }
  };

  const handleRejectUserValidation = async (userId) => {
    try {
      await axios.put(`http://localhost:5000/api/validationuser/${userId}/reject`);
      loadUsersValidation();
    } catch (error) {
      console.error("Erreur rejet utilisateur", error);
    }
  };

  const getUserRole = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.role;
    }
    return null;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Section title="Clients à valider">
          {clientsValidation.map((client) => (
            <ClientCard
              key={client._id}
              client={client}
              onConfirm={handleConfirmValidation}
              onReject={handleRejectValidation}
              statusLabel={`Statut : ${client.Statut ? "Confirmé" : "Non confirmé"}`}
            />
          ))}
        </Section>

        <Section title="Clients à archiver">
          {clientsArchivage.map((client) => (
            <ClientCard
              key={client._id}
              client={client}
              onConfirm={handleConfirmArchivage}
              onReject={handleRejectArchivage}
              statusLabel={`Archivage : ${client.etatarchivage === 1 ? "En attente" : "Archivé"}`}
            />
          ))}
        </Section>

        {getUserRole() === "Directeur" && (
          <Section title="Utilisateurs à valider">
            {usersValidation.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                handleConfirmUserValidation={handleConfirmUserValidation}
                handleRejectUserValidation={handleRejectUserValidation}
              />
            ))}
          </Section>
        )}
      </MDBox>
    </DashboardLayout>
  );
}

export default CentreValidation;
