import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MDBox from "components/MDBox";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MDTypography from "components/MDTypography";
import PropTypes from 'prop-types'; // Importer PropTypes

function ClientSitesCardList({ clientNom }) {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/sites?client=${clientNom}`);
        setSites(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des sites :", error);
        setLoading(false);
      }
    };

    fetchSites();
  }, [clientNom]);

  if (loading) {
    return <MDTypography variant="body2">Chargement...</MDTypography>;
  }

  if (sites.length === 0) {
    return <MDTypography variant="body2">Aucun site trouvé pour ce client.</MDTypography>;
  }

  return (
    <MDBox>
      {sites.map((site) => (
        <Card key={site.id} sx={{ marginBottom: 2 }}>
          <CardContent>
            <MDTypography variant="h6">{site.nom}</MDTypography>
            <MDTypography variant="body2" color="text.secondary">{site.adresse}</MDTypography>
          </CardContent>
        </Card>
      ))}
    </MDBox>
  );
}

// Validation des props
ClientSitesCardList.propTypes = {
  clientNom: PropTypes.string.isRequired, // Validation de la prop clientNom
};

export default ClientSitesCardList;
