import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import { jwtDecode } from "jwt-decode";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import MDButton from "components/MDButton";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";


// API URLS
const apiUrl = "http://localhost:5000/api/clients";
const usersUrl = "http://localhost:5000/api/users";

function CentreValidation() {
  const [clientsValidation, setClientsValidation] = useState([]);
  const [clientsArchivage, setClientsArchivage] = useState([]);
  const [usersValidation, setUsersValidation] = useState([]);
  const navigate = useNavigate();

  // === Données DataTable (colonnes)
  const columnsClients = [
    { Header: "Nom client", accessor: "nom" },
    { Header: "Date demande", accessor: "dateDemande" },
    { Header: "Statut", accessor: "statut" },
    { Header: "Actions", accessor: "actions", align: "center" },
  ];

  const columnsArchivage = [
    { Header: "Nom client", accessor: "nom" },
    { Header: "Date demande", accessor: "dateDemande" },
    { Header: "Statut", accessor: "statut" },
    { Header: "Actions", accessor: "actions", align: "center" },
  ];

  const columnsUsers = [
    { Header: "Nom utilisateur", accessor: "nom" },
    { Header: "Statut", accessor: "statut" },
    { Header: "Actions", accessor: "actions", align: "center" },
  ];

  // === Actions Handlers
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

  // === Chargement des données
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
// Pour l'étape finale (validé ou refusé)
const getCustomStepIcon = (step, client) => {
  // etatarchivage: 1=Demande, 2=Manager, 3=Directeur, 4=Validé, -1=Refusé (à adapter selon tes valeurs)
  if (step === 3) {
    if (client.etatarchivage === 4) {
      return <CheckCircleIcon color="success" />;
    }
    if (client.etatarchivage === -1 || client.refused) {
      // Utilise la propriété correspondant à refus dans ton modèle
      return <CancelIcon color="error" />;
    }
  }
  return null;
};

const workflowSteps = ["Demande", "Manager", "Directeur", ""];

  const loadUsersValidation = async () => {
    try {
      const response = await axios.get(usersUrl);
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
    // eslint-disable-next-line
  }, []);

  // === DataTable ROWS dynamiques
 const rowsClients = clientsValidation.map(client => ({
  nom: client.Nom,
  dateDemande: client.dateDemande
    ? new Date(client.dateDemande).toLocaleDateString()
    : "--",
   
  


  actions: (
    <>
      <Tooltip title="Valider">
        <IconButton
          color="success"
          size="small"
          onClick={() => handleConfirmValidation(client._id)}
          sx={{ mr: 1 }}
        >
          <CheckCircleIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Refuser">
        <IconButton
          color="error"
          size="small"
          onClick={() => handleRejectValidation(client._id)}
        >
          <CancelIcon />
        </IconButton>
      </Tooltip>
    </>
  ),
}));


  const rowsArchivage = clientsArchivage.map(client => ({
    nom: client.Nom,
    dateDemande: client.dateDemande
      ? new Date(client.dateDemande).toLocaleDateString()
      : "--",
    statut: client.Statut ? "Confirmé" : "Non confirmé",
actions: (
  <>
    <Tooltip title="Valider">
      <IconButton
        color="success"
        size="small"
        onClick={() => handleConfirmArchivage(client._id)}
        sx={{ mr: 1 }}
      >
        <CheckCircleIcon />
      </IconButton>
    </Tooltip>
    <Tooltip title="Refuser">
      <IconButton
        color="error"
        size="small"
        onClick={() => handleRejectArchivage(client._id)}
      >
        <CancelIcon />
      </IconButton>
    </Tooltip>
  </>
),
  }));

  const rowsUsers = usersValidation.map(user => ({
    nom: user.nom,
    statut: user.statut ? "Confirmé" : "Non confirmé",
    actions: (
  <>
    <Tooltip title="Valider">
      <IconButton
        color="success"
        size="small"
        onClick={() => handleConfirmUserValidation(user._id)}
        sx={{ mr: 1 }}
      >
        <CheckCircleIcon />
      </IconButton>
    </Tooltip>
    <Tooltip title="Refuser">
      <IconButton
        color="error"
        size="small"
        onClick={() => handleRejectUserValidation(user._id)}
      >
        <CancelIcon />
      </IconButton>
    </Tooltip>
  </>
),
  }));

  const getUserRole = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.role;
    }
    return null;
  };

  // === RENDER ===
  return (
  <DashboardLayout>
    <DashboardNavbar />
    <MDBox pt={6} pb={3}>
      <MDBox mb={4}>
        <Card sx={{ width: "100%", boxShadow: 3, borderRadius: 2 }}>
          <MDBox
            width="20%"
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
              Clients à valider
            </MDTypography>
          </MDBox>
          <MDBox pt={3} px={2} pb={2}>
            <DataTable
              table={{ columns: columnsClients, rows: rowsClients }}
              isSorted={false}
              entriesPerPage={false}
              showTotalEntries={false}
              noEndBorder
              
            />
          </MDBox>
        </Card>
      </MDBox>

      <MDBox mb={4}>
        <Card sx={{ width: "100%", boxShadow: 3, borderRadius: 2 }}>
          <MDBox
          width="20%"
            mx={2}
            mt={-3}
            py={3}
            px={2}
            variant="gradient"
            bgColor="primary"
            borderRadius="lg"
         
          >
            <MDTypography variant="h6" color="white" fontWeight="bold">
              Clients à archiver
            </MDTypography>
          </MDBox>
          <MDBox pt={3} px={2} pb={2}>
            <DataTable
              table={{ columns: columnsArchivage, rows: rowsArchivage }}
              isSorted={false}
              entriesPerPage={false}
              showTotalEntries={false}
              noEndBorder
            />
          </MDBox>
        </Card>
      </MDBox>

      {getUserRole() === "Directeur" && (
        <MDBox mb={4}>
          <Card sx={{ width: "100%", boxShadow: 3, borderRadius: 2 }}>
            <MDBox
            width="20%"
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
                Utilisateurs à valider
              </MDTypography>
            </MDBox>
            <MDBox pt={3} px={2} pb={2}>
              <DataTable
                table={{ columns: columnsUsers, rows: rowsUsers }}
                isSorted={false}
                entriesPerPage={false}
                showTotalEntries={false}
                noEndBorder
              />
            </MDBox>
          </Card>
        </MDBox>
      )}
    </MDBox>
  </DashboardLayout>
);

}

export default CentreValidation;
