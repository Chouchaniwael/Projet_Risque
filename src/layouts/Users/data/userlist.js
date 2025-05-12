/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip"; // à ajouter en haut
// Fonction pour afficher l'icône de statut
const StatusIcon = ({ status }) => {
  let icon;
  let color;
  let label;

  if (status === true) {
    icon = "check_circle";
    color = "green";
    label = "Actif";
  } else if (status === false) {
    icon = "hourglass_empty";
    color = "orange";
    label = "En cours de validation";
  } else {
    icon = "help_outline";
    color = "grey";
    label = "Statut inconnu";
  }

  return (
    <Tooltip title={label}>
      <Icon sx={{ fontSize: 20, color: color, marginRight: 1 }}>
        {icon}
      </Icon>
    </Tooltip>
  );
};


export default function useUserData(onEditClick) {
  const Author = ({ name, email, status }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#f0f0f0", // facultatif : couleur de fond
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon sx={{ fontSize: 60, color: "#555" }}>person</Icon>
      </MDAvatar>
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );

  const [userData, setUserData] = useState({
    columns: [
      { Header: "Utilisateur", accessor: "author", width: "20%", align: "left" },
      { Header: "Rôle", accessor: "function", align: "left" },
      { Header: "Statut", accessor: "status", align: "center" },  // Nouvelle colonne pour le statut
      { Header: "Email", accessor: "email", align: "center" },
      { Header: "Date de création", accessor: "createdAt", align: "center" },
      { Header: "Actions", accessor: "actions", align: "center" },
    ],
    rows: [],
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users");
        const data = await response.json();

        const rows = data.map((user) => ({
          author: <Author name={`${user.prenom} ${user.nom}`} email={user.email} status="actif" />, // Statut "actif" par défaut
          function: <Job title={user.role} description={user.identifiant} />,
         status: <StatusIcon status={user.statut} />,   // Affichage de l'icône de statut
          email: (
            <MDTypography variant="caption" fontWeight="regular">
              {user.email}
            </MDTypography>
          ),
          createdAt: (
            <MDTypography variant="caption" fontWeight="regular">
              {new Date(user.date_creation).toLocaleDateString()}
            </MDTypography>
          ),
          actions: (
            <IconButton
              color="primary"
              onClick={() => onEditClick(user)}
              aria-label="modifier"
            >
              <Icon>edit</Icon>
            </IconButton>
          ),
        }));

        setUserData((prev) => ({ ...prev, rows }));
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs :", error);
      }
    };

    fetchUsers();
  }, [onEditClick]);

  return userData;
}
