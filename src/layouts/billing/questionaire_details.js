// @mui material components
import Grid from "@mui/material/Grid";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// React
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function DetailQuestionnaire() {
  const { titre } = useParams(); // Get titre from route param
  const [questionnaire, setQuestionnaire] = useState(null);

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/questionnaireRoutes?titre=${titre}`);
        const data = await response.json();
        setQuestionnaire(data[0]);
        console.log(data)
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
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4">{titre}</Typography>
          </Grid>

          {questionnaire?.sections?.map((section, idx) => (
            <Grid item xs={12} key={idx}>
                
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">{section.titre}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {section.questions.map((question, qIdx) => (
                    <MDBox key={qIdx} mb={1}>
                      <Typography>
                        • {question.texte}{" "}
                       
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
