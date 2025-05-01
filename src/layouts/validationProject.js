import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useParams } from "react-router-dom";

const ValidationProject = () => {
  const location = useLocation();
  const { selectedQuestionnaires } = location.state || {};
  const [questionnaireData, setQuestionnaireData] = useState([]);
  const [answers, setAnswers] = useState({});
  const { id } = useParams(); // this is the project title or identifier

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all(
          selectedQuestionnaires.map((titre) =>
            fetch(`http://localhost:5000/api/questionnaireRoutes?titre=${titre}`).then((res) =>
              res.json()
            )
          )
        );
        const flatData = responses.map((r) => r[0]); // each response is an array
        setQuestionnaireData(flatData);
      } catch (err) {
        console.error("Erreur lors du chargement des questionnaires :", err);
      }
    };

    if (selectedQuestionnaires?.length > 0) {
      fetchData();
    }
  }, [selectedQuestionnaires]);

  const handleSelectChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSave = async () => {
    const fullData = questionnaireData.map((q, qIdx) => ({
      titre: q.titre,
      description: q.description,
      cible: q.cible,
      risqueAssocie: q.risqueAssocie,
      index: q.index,
      statut: q.statut || "Actif",
      sections: q.sections.map((section, sIdx) => ({
        titre: section.titre,
        questions: section.questions.map((question, queIdx) => {
          const questionId = `${qIdx}-${sIdx}-${queIdx}`;
          return {
            ...question,
            reponse: answers[questionId] || "N/A", // Append user answer here
          };
        }),
      })),
    }));
  
    try {
      await fetch("http://localhost:5000/api/ajouter_questionnaire_projet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projet: id, // from useParams()
          questionnaires: fullData, // send array of full questionnaires
        }),
      });
  
      alert("Questionnaires enregistrés avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
      alert("Erreur lors de l'enregistrement.");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={4} px={2}>
        <Grid container spacing={2}>
          {questionnaireData.map((questionnaire, qIdx) => (
            <Grid item xs={12} key={qIdx}>
              <Typography variant="h4" mb={2}>
                {questionnaire.titre}
              </Typography>
              {questionnaire.sections.map((section, sIdx) => (
                <Accordion key={sIdx}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">{section.titre}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {section.questions.map((question, queIdx) => {
                      const questionId = `${qIdx}-${sIdx}-${queIdx}`;
                      return (
                        <MDBox
                          key={questionId}
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          mb={2}
                        >
                          <Typography>• {question.texte}</Typography>
                          <FormControl size="small" sx={{ minWidth: 100 }}>
                            <InputLabel>Réponse</InputLabel>
                            <Select
                              value={answers[questionId] || ""}
                              onChange={(e) =>
                                handleSelectChange(questionId, e.target.value)
                              }
                              label="Réponse"
                            >
                              <MenuItem value="Oui">Oui</MenuItem>
                              <MenuItem value="Non">Non</MenuItem>
                              <MenuItem value="N/A">NA</MenuItem>
                            </Select>
                          </FormControl>
                        </MDBox>
                      );
                    })}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Grid>
          ))}
        </Grid>
      </MDBox>
      <MDBox mt={4} display="flex" justifyContent="center">
  <MDButton color="info" onClick={handleSave}>
    Enregistrer
  </MDButton>
</MDBox>
      <Footer />
    </DashboardLayout>
  );
}
export default ValidationProject;
