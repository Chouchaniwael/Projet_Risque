/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import { useState, useEffect, useCallback } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import { useNavigate } from "react-router-dom";
import defaultImage from "assets/images/team-3.jpg";
import { Circle, CheckCircle, PanoramaFishEye } from "@mui/icons-material";
import ContrastIcon from "@mui/icons-material/Contrast";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Swal from 'sweetalert2';
import ArchiveIcon from '@mui/icons-material/Archive';
export default function useClientData() {
  const navigate = useNavigate();

  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image || defaultImage} name={name} size="sm" />
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

  const [clientData, setClientData] = useState({
    columns: [
      { Header: "Client", accessor: "author", width: "25%", align: "left" },
      { Header: "Secteur", accessor: "function", align: "left" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Analyse", accessor: "analyseStatus", align: "center" },
      { Header: "Date de création", accessor: "employed", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
    rows: [],
  });

  const fetchClients = useCallback(async () => {
    try {
      // Récupérer le rôle de l'utilisateur depuis le token
      const token = localStorage.getItem("token");
      let userRole = "";

      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          userRole = payload.role; // Supposons que le rôle est stocké dans le payload du token
        } catch (error) {
          console.error("Erreur lors de la lecture du token :", error);
        }
      }

      const response = await fetch(`http://localhost:5000/api/clients`);
      const json = await response.json();

      console.log("Réponse brute API :", json);

      const clients = Array.isArray(json) ? json : json.data; // à ajuster selon la structure
      console.log("Clients récupérés :", clients);

      // Filtrer les clients en fonction du rôle de l'utilisateur
      const filteredClients = userRole === "Consultant"
        ? clients.filter((client) => Number(client.etatarchivage) === 0)
        : clients;

      console.log("Clients filtrés :", filteredClients);

      const rowsWithAnalyse = await Promise.all(
        filteredClients.map(async (client) => {
          let statutAnalyse = "Nouveau";

          try {
            const resQ = await fetch(
              `http://localhost:5000/api/questionnaire_projet?projet=${client.Nom}`
            );
            const data = await resQ.json();

            console.log(`Analyse pour ${client.Nom}:`, data);

            if (Array.isArray(data) && data.length > 0) {
              statutAnalyse = getAnalyseStatus(data[0].analyse);
            }
          } catch (err) {
            console.error(`Erreur lors du chargement des questionnaires pour ${client.Nom}:`, err);
          }

          return {
            author: (
              <Author
                image={
                  client.Logo && client.Logo.trim() !== ""
                    ? `http://localhost:5000/images/${client.Logo}`
                    : defaultImage
                }
                name={client.Nom}
                email={client.Contact || "email@indisponible.com"}
              />
            ),
            function: <Job title={client.Secteur} description={client.Adresse} />,
          status: (
  <MDBadge
    badgeContent={client.Statut ? "Actif" : "Archivé"}
    color={client.Statut ? "success" : "dark"}
    variant="gradient"
    size="sm"
  />
),

            analyseStatus: (
              <MDBox display="flex" alignItems="center">
                {statutAnalyse === "Nouveau" && (
                  <PanoramaFishEye fontSize="large" color="secondary" />
                )}
                {statutAnalyse === "En cours" && (
                  <ContrastIcon fontSize="large" color="warning" />
                )}
                {statutAnalyse === "Complété" && (
                  <CheckCircle fontSize="large" color="success" />
                )}
              </MDBox>
            ),
            employed: (
              <MDTypography variant="caption" color="text" fontWeight="medium">
                {new Date(client.createdAt).toLocaleDateString("fr-FR")}
              </MDTypography>
            ),
            action: (
              <MDBox display="flex" alignItems="center" justifyContent="center" gap={1}>
                <MDTypography
                  component="a"
                  href="#"
                  variant="caption"
                  color="text"
                  fontWeight="medium"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/client/${client.Nom}`);
                  }}
                >
                  Consulter
                </MDTypography>
              <Tooltip title={client.etatarchivage === 2 ? "Déjà archivé" : "Archiver le client"} arrow>
  <span>
    <IconButton
      size="small"
      color="gray"
      onClick={() => handleDeleteClient(client._id)}
      sx={{ ml: 3 }}
      disabled={client.etatarchivage === 2}
    >
      <ArchiveIcon fontSize="small" />
    </IconButton>
  </span>
</Tooltip>

              </MDBox>
            ),
          };
        })
      );

      console.log("Rows à insérer dans la table :", rowsWithAnalyse);

      setClientData((prev) => ({ ...prev, rows: rowsWithAnalyse }));
    } catch (error) {
      console.error("Erreur de chargement des clients:", error);
    }
  }, [navigate]);
  
  
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);


  const handleDeleteClient = async (clientId) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Confirmez-vous la demande d'archivage ? Cette action est définitive et ne peut pas être annulée.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, archiver',
      cancelButtonText: 'Annuler'
    });
  
    if (!result.isConfirmed) return;
  
    try {
      const response = await fetch(
        `http://localhost:5000/api/clients/archiver1/${clientId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de l'archivage");
      }

      const updatedClient = await response.json();
      console.log("Client archivé avec succès :", updatedClient);

      // Rafraîchir la table
      fetchClients();
    } catch (error) {
      console.error("Erreur lors de l'archivage du client :", error);
      alert("Une erreur est survenue lors de l'archivage du client.");
    }
  };

  // Fonction utilitaire pour évaluer le statut d'analyse
  function getAnalyseStatus(analyse) {
    if (!analyse) return "Nouveau";

    const isEmpty = (val) =>
      val === null || val === undefined || (typeof val === "string" && val.trim() === "");

    const flatValues = [
      analyse.scenarioRisque,
      analyse.constat,
      analyse.risqueNet,
      ...(analyse.risqueBrut ? Object.values(analyse.risqueBrut) : []),
      ...(analyse.elementControle ? Object.values(analyse.elementControle) : []),
      ...(analyse.planTraitement ? Object.values(analyse.planTraitement) : []),
    ];

    const filledCount = flatValues.filter((val) => !isEmpty(val)).length;

    if (filledCount === 0) return "Nouveau";
    if (filledCount === flatValues.length) return "Complété";
    return "En cours";
  }

  return clientData;
}
