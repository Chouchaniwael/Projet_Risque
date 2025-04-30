// ClientGestionPage.js

import { useEffect, useState } from "react";
import axios from "axios";

// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { useTheme } from '@mui/material/styles';
// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import profilesListData from "layouts/profile/data/profilesListData";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import ProfilesList from "examples/Lists/ProfilesList";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import { useParams } from "react-router-dom";
// Custom Components
import ClientHeader from "./ClientHeader";  // 🔥 ici on importe notre nouveau Header
import SiteListData from "./SiteListData";  // Correct relative path from 'layouts' to 'SiteListData.js' inside the same folder
 
function ClientGestionPage() {
  const [client, setClient] = useState(null);
const { id } = useParams();
const theme = useTheme();
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/clients?name=${id}`);
        
        const data = Array.isArray(response.data) ? response.data[0] : response.data;

        const clientData = {
          nom: data.Nom || "Nom inconnu",
          logo: data.Logo ? `http://localhost:5000/images/${data.Logo}` : "", 
          contact: data.Contact || "Non renseigné",
          secteur: data.Secteur || "",
          adresse: data.Adresse || "Non renseignée",
          statut: data.Statut !== undefined ? data.Statut : true,
          etat: data.etat || 0,
          description: data.Description || "Pas de description disponible.",
          mail: data.Mail || "Non renseigné",
          linkedin: data.linkedin || "#",
        };

        setClient(clientData);
      } catch (error) {
        console.error("Erreur lors du chargement du client :", error);
      }
    };

    fetchClient();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      {client && <ClientHeader logo={client.logo} name={client.nom} />} {/* 🔥 ici on utilise notre nouveau header */}
      <MDBox mt={5} mb={3}>
        <Grid container spacing={1}>
         
          <Grid item xs={12} md={6} xl={4} >
           
            {client && (
           

            
             
             <ProfileInfoCard
               title={<span style={{ color: theme.palette.primary.main }}>Informations du client</span>}
               description={client.description}
               info={{
                 fullName: client.nom,
                 mobile: client.contact,
                 email: client.mail,
                 location: client.adresse,
               }}
               social={[
                 {
                   link: client.linkedin,
                   icon: <FacebookIcon />,
                   color: "facebook",
                 },
               ]}
               action={{ route: "", tooltip: "Modifier le client" }}
               shadow={false}
             />
             
            )}
            <Divider orientation="vertical" sx={{ mx: 0 }} />
           
          </Grid>
          <Grid item xs={12} xl={4}>
              <ProfilesList  title={<span style={{ color: theme.palette.primary.main }}>Liste des sites</span>}
              profiles={SiteListData} shadow={false} />
            </Grid>
            <Grid item xs={12} md={6} xl={4}></Grid>
        </Grid>
        
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default ClientGestionPage;
