/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import { useNavigate } from "react-router-dom"; // Importation de useNavigate
// Image par défaut
import defaultImage from "assets/images/team-3.jpg";

export default function useClientData() {
  const navigate = useNavigate(); // Initialisation de navigate

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
      { Header: "Client", accessor: "author", width: "45%", align: "left" },
      { Header: "Secteur", accessor: "function", align: "left" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "employed", accessor: "employed", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],
    rows: [],
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/clients");
        const clients = await response.json();

        const formattedRows = clients.map((client) => ({
          author: (
            <Author
              image={
                client.Logo && client.Logo.trim() !== ""
                  ? `http://localhost:5000/images/${client.Logo}`
                  : defaultImage
              }
              name={client.Nom}
              email={client.Contact ? `${client.Contact}` : "email@indisponible.com"}
            />
          ),
          function: <Job title={client.Secteur} description={client.Adresse} />,
          status: (
            <MDBox ml={-1}>
              <MDBadge
                badgeContent={client.Statut ? "Actif" : "offline"}
                color={client.Statut ? "success" : "dark"}
                variant="gradient"
                size="sm"
              />
            </MDBox>
          ),
          employed: (
            <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
              {new Date().toLocaleDateString()}
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
                // Rediriger vers la page du client en utilisant navigate
                navigate(`/client/${client.Nom}`);
              }}
            >
              Consulter
            </MDTypography>
          ),
        }));

        setClientData((prev) => ({ ...prev, rows: formattedRows }));
      } catch (error) {
        console.error("Erreur de chargement des clients:", error);
      }
    };

    fetchClients();
  }, [navigate]); // Ajout de navigate dans la liste des dépendances

  return clientData;
}
