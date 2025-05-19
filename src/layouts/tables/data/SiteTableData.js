import MDTypography from "components/MDTypography";
import Icon from "@mui/material/Icon";
import MDButton from "components/MDButton";

export default function generateSitesTableData(sites, onGestionRisqueClick) {
  const columns = [
    { Header: "Nom du site", accessor: "nom" },
    { Header: "Adresse", accessor: "adresse" },
    { Header: "Contact", accessor: "contact" },
    { Header: "Email", accessor: "mail" },
    { Header: "Statut", accessor: "statut" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  const rows = sites.map(site => ({
    nom: site.Nom || "-",
    adresse: site.adresse || "-",
    contact: site.Contact || "-",
    mail: site.mail || "-",
    statut: site.etat ? "Actif" : "Inactif",
    action: (
      <MDButton
        variant="text"
        color="info"
        size="small"
        onClick={() => onGestionRisqueClick(site)}
        sx={{ textTransform: "none" }}
      >
        <Icon>assessment</Icon>
        <MDTypography variant="button" ml={1}>Gérer risque</MDTypography>
      </MDButton>
    ),
  }));

  return { columns, rows };
}
