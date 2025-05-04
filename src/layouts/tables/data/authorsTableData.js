/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import { useNavigate } from "react-router-dom";
import defaultImage from "assets/images/team-3.jpg";
import { Circle, CheckCircle, PanoramaFishEye } from "@mui/icons-material";  // Importation des icônes nécessaires
import ContrastIcon from '@mui/icons-material/Contrast';

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
      { Header: "Date", accessor: "employed", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
    ],
    rows: [],
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/clients?statut=true`);
        const clients = await response.json();

        const rowsWithAnalyse = await Promise.all(
          clients.map(async (client) => {
            let statutAnalyse = "Nouveau";

            try {
              const resQ = await fetch(`http://localhost:5000/api/questionnaire_projet?projet=${client.Nom}`);
              const data = await resQ.json();
              
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
                  badgeContent={client.Statut ? "Actif" : "Inactif"}
                  color={client.Statut ? "success" : "dark"}
                  variant="gradient"
                  size="sm"
                />
              ),

              analyseStatus: (
                <MDBox display="flex" alignItems="center">
                  {statutAnalyse === "Nouveau" && <PanoramaFishEye fontSize="large" color="secondary" />}
                  {statutAnalyse === "En cours" && <ContrastIcon fontSize="large" color="warning" />}
                  {statutAnalyse === "Complété" && <CheckCircle fontSize="large" color="success" />}
                </MDBox>
              ),
              employed: (
                <MDTypography variant="caption" color="text" fontWeight="medium">
                  {new Date(client.createdAt).toLocaleDateString("fr-FR")}
                </MDTypography>
              ),
              action: (
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
              ),
            };
          })
        );

        setClientData((prev) => ({ ...prev, rows: rowsWithAnalyse }));
      } catch (error) {
        console.error("Erreur de chargement des clients:", error);
      }
    };

    fetchClients();
  }, [navigate]);

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
