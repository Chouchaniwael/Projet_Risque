import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, Typography } from "@mui/material";
import MDAvatar from "components/MDAvatar";
import defaultImage from "assets/images/team-3.jpg";
import MDBox from "components/MDBox";

const GestionRisque = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/clients?name=${id}`);
        const data = await response.json();
        setClient(data[0] || null);
      } catch (error) {
        console.error("Erreur lors du chargement du client :", error);
      }
    };

    fetchClient();
  }, [id]);

  if (!client) {
    return (
      <MDBox display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography align="center">Chargement...</Typography>
      </MDBox>
    );
  }

  return (
    <MDBox display="flex" justifyContent="center" alignItems="flex-start" minHeight="100vh">
      <Card>
        <CardContent>
          <MDBox display="flex" flexDirection="column" alignItems="center" px={5}>
            <MDAvatar
              src={client.Logo ? `http://localhost:5000/images/${client.Logo}` : defaultImage}
              name={client.Nom}
              size="xxl"
            />
            <Typography variant="h5" component="div" align="center" sx={{ mt: 2 }}>
              {client.Nom}
            </Typography>
            <Typography variant="body1" align="center" sx={{ mt: 2 }}>
              Vous êtes sur cette page
            </Typography>
          </MDBox>
        </CardContent>
      </Card>
    </MDBox>
  );
};

export default GestionRisque;
