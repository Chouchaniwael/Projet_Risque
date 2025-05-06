import Grid from "@mui/material/Grid";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Divider from "@mui/material/Divider";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ListAltIcon from "@mui/icons-material/ListAlt";
import EditIcon from "@mui/icons-material/Edit"; // Importation de l'icône de modification
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

function slugify(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '');
}

function DetailQuestionnaire() {
  const { titre } = useParams();
  const [questionnaire, setQuestionnaire] = useState(null);
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/questionnaireRoutes`);
        const data = await response.json();
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
      <MDBox
        mt={4}
        px={3}
        py={4}
        className="main-container"
      >
        <Grid container spacing={3} justifyContent="center"> {/* Centrer horizontalement */}
          <Grid item xs={12} md={8}> {/* Ajouter une largeur de 8/12 pour limiter la largeur */}
            <Typography
              variant="h4"
              fontWeight="bold"
              className="page-title"
              sx={{ color: primaryColor }}
            >
              Questionnaire : {questionnaire?.titre || "Inconnu"}
            </Typography>
            <Divider sx={{ my: 3, backgroundColor: primaryColor, opacity: 0.7 }} />

            {questionnaire?.sections?.map((section, idx) => (
              <Accordion
                key={idx}
                elevation={4}
                sx={{
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.grey[200]}`,
                  backgroundColor: "#ffffff",
                  transition: "all 0.3s ease",
                  mb: 2,
                  width: "100%", // S'assurer qu'il prenne toute la largeur de son conteneur
                  "&:hover": {
                    boxShadow: `0 10px 30px ${theme.palette.grey[300]}`,
                    borderColor: primaryColor,
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ fontSize: 32, color: '#000000' }} />}
                  sx={{
                    background: `linear-gradient(90deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
                    borderRadius: 2,
                    px: 3,
                    py: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    "& .MuiAccordionSummary-content": {
                      flexGrow: 0,
                      marginRight: "auto",
                    },
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: { xs: 20, md: 24 },
                      fontWeight: 600,
                      color: '#000000',
                    }}
                  >
                    <ListAltIcon sx={{ mr: 2, fontSize: 24, color: primaryColor }} />
                    Section {idx + 1}: {section.titre}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3, backgroundColor: theme.palette.grey[50] }}>
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
                        boxShadow: `0 2px 8px ${theme.palette.grey[200]}`,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: `0 4px 12px ${theme.palette.grey[300]}`,
                        },
                      }}
                    >
                   

                      <CheckCircleOutlineIcon
                        sx={{ color: theme.palette.success.main, mt: "4px", mr: 2, fontSize: 24 }}
                      />
                      <Typography
                        variant="body1"
                        fontSize={{ xs: 16, md: 18 }}
                        sx={{ flex: 1, color: theme.palette.text.primary }}
                      >
                        {question.texte}
                      </Typography>
                         {/* Icône de modification ajoutée ici */}
                         <EditIcon sx={{ color: primaryColor, mt: "4px", mr: 2, fontSize: 24 }} />
                    </MDBox>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      <style>
        {`
          .main-container {
            background: linear-gradient(145deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[100]} 100%);
            border-radius: 16px;
            min-height: calc(100vh - 180px);
            padding: 32px;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          }

          .page-title {
            font-size: 2.25rem;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 20px;
            background: linear-gradient(90deg, ${primaryColor}, ${theme.palette.primary.light});
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .MuiAccordion-root {
            overflow: hidden;
            margin: 0 auto;
            max-width: 1200px;
            border-radius: 12px !important;
            position: relative;
          }

          .MuiAccordionSummary-root {
            border-bottom: 1px solid ${theme.palette.grey[200]};
            transition: background 0.3s ease;
            position: relative;
            min-height: 64px;
          }

          .MuiAccordionDetails-root {
            border-top: 1px solid ${theme.palette.grey[200]};
            padding: 24px;
          }

          .MuiTypography-body1 {
            line-height: 1.7;
            font-weight: 400;
            transition: color 0.2s ease;
          }

          .MuiDivider-root {
            height: 3px;
            border-radius: 2px;
          }

          @media (max-width: 600px) {
            .main-container {
              padding: 16px;
              border-radius: 8px;
            }

            .page-title {
              font-size: 1.75rem;
              letter-spacing: 1px;
            }

            .MuiTypography-body1 {
              font-size: 14px;
            }

            .MuiAccordionSummary-content h2 {
              font-size: 18px;
            }

            .MuiAccordionDetails-root {
              padding: 16px;
            }
          }
        `}
      </style>
    </DashboardLayout>
  );
}

export default DetailQuestionnaire;
