// @mui material components
import Grid from "@mui/material/Grid";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Divider from "@mui/material/Divider";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ListAltIcon from "@mui/icons-material/ListAlt";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Layout & nav
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// React
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// 🔤 Fonction de transformation en slug
function slugify(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, '-')  // Remplacer les espaces par des tirets
    .replace(/[^\w-]+/g, '');  // Supprimer les caractères non alphanumériques
}

function DetailQuestionnaire() {
  const { titre } = useParams();  // Slug dans l’URL
  const [questionnaire, setQuestionnaire] = useState(null);

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/questionnaireRoutes`);
        const data = await response.json();

        // Cherche le questionnaire dont le slug du titre correspond à celui de l’URL
        const matched = data.find(q => slugify(q.titre) === titre);
        setQuestionnaire(matched);
      } catch (error) {
        console.error("Erreur lors du chargement du questionnaire :", error);
      }
    };

    fetchQuestionnaire();
  }, [titre]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={4} px={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" fontWeight="bold" color="primary">
              Questionnaire : {questionnaire?.titre || "Inconnu"}
            </Typography>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {questionnaire?.sections?.map((section, idx) => (
            <Grid item xs={12} key={idx}>
              <Accordion
                elevation={3}
                sx={{
                  borderRadius: 2,
                  border: "1px solid #ddd",
                  backgroundColor: "#f9f9f9",
                  transition: "all 0.3s ease",
                  mb: 2,
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 30 }} />}>
                  <Typography
                    variant="h2"
                    color="text.primary"
                    sx={{ display: "flex", alignItems: "center", fontSize: 24 }}
                  >
                    <ListAltIcon sx={{ mr: 2, fontSize: 20 }} />
                    Section {idx + 1}: {section.titre}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 2 }}>
                  {section.questions?.map((question, qIdx) => (
                    <MDBox
                      key={qIdx}
                      mb={2}
                      p={2}
                      sx={{
                        backgroundColor: "#ffffff",
                        borderRadius: 1,
                        display: "flex",
                        alignItems: "flex-start",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                      }}
                    >
                      <CheckCircleOutlineIcon sx={{ color: "success.main", mt: "4px", mr: 2 }} />
                      <Typography variant="body1" fontSize={18} sx={{ flex: 1 }}>
                        {question.texte}
                      </Typography>
                    </MDBox>
                  ))}
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))}
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default DetailQuestionnaire;
