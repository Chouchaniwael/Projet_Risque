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
  const [riskData, setRiskData] = useState({});
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch both questionnaire standards and project questionnaires in parallel
        const [standards, projectRes] = await Promise.all([
          Promise.all(
            selectedQuestionnaires.map((titre) =>
              fetch(`http://localhost:5000/api/questionnaireRoutes?titre=${titre}`).then((res) =>
                res.json()
              )
            )
          ),
          fetch(`http://localhost:5000/api/questionnaire_projet?projet=${id}`).then((res) =>
            res.json()
          ),
        ]);
  
        const flatData = standards.map((r) => r[0]);
        const project = projectRes;
  
        // Build initial answers from project
        const initialAnswers = {};
        const riskDataObj = {};
  
        project.forEach((q, qIdx) => {
          q.sections.forEach((section, sIdx) => {
            section.questions.forEach((question, queIdx) => {
              const questionId = `${qIdx}-${sIdx}-${queIdx}`;
              initialAnswers[questionId] = question.reponse || "";
            });
          });
  
          const risk = q.analyse || {};
          riskDataObj[qIdx] = {
            constat: risk.constat || "",
            probabilite: risk.risqueBrut?.probabilite || 0,
            impact: risk.risqueBrut?.impact || 0,
            risqueBrut: risk.risqueBrut?.risqueBrut || 0,
            niveauRisque: risk.risqueBrut?.niveauRisque || "",
            elementMaitrise: risk.elementControle?.elementMaitrise || "",
            efficacite: risk.elementControle?.efficacite || "",
            risqueNet: risk.risqueNet || "",
            optionTraitement: risk.planTraitement?.optionTraitement || "",
            planAction: risk.planTraitement?.planAction || "",
            cout: risk.planTraitement?.cout || 0,
            complexite: risk.planTraitement?.complexite || "",
            priorite: risk.planTraitement?.priorite || "",
          };
        });
  
        setAnswers(initialAnswers);
        setRiskData(riskDataObj);
  
        // Merge standard and project questionnaires by title
        const mergedData = flatData.map((q) => {
          const matched = project.find((pq) => pq.titre === q.titre);
          return matched || q;
        });
  
        setQuestionnaireData(mergedData);
  
      } catch (err) {
        console.error("Erreur lors du chargement des données :", err);
      }
    };
  
    if (selectedQuestionnaires?.length > 0) {
      fetchAllData();
    }
  }, [id]);
  

  const handleSelectChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };
  const handleSave = async () => {
    const fullData = questionnaireData.map((q, qIdx) => {
      const risk = riskData[qIdx] || {}; // Retrieve risk data for each questionnaire
  
      return {
        titre: q.titre,
        description: q.description,
        cible: q.cible,
        risqueAssocie: q.risqueAssocie,
        index: q.index,
        statut: q.statut || "Actif",
        analyse: {
          scenarioRisque: q.titre, // This can be customized if needed
          constat: risk.constat || "",
          risqueNet: risk.risqueNet || "",
          risqueBrut: {
            probabilite: parseFloat(risk.probabilite) || 0,
            impact: parseFloat(risk.impact) || 0,
            niveauRisque: risk.niveauRisque || "",
            risqueBrut: parseFloat(risk.risqueBrut) || 0,
          },
          elementControle: {
            elementMaitrise: risk.elementMaitrise || "",
            efficacite: risk.efficacite || "",
          },
          planTraitement: {
            optionTraitement: risk.optionTraitement || "",
            planAction: risk.planAction || "",
            cout: parseFloat(risk.cout) || 0,
            complexite: risk.complexite || "",
            priorite: risk.priorite || "",
          },
        },
        sections: q.sections.map((section, sIdx) => ({
          titre: section.titre,
          questions: section.questions.map((question, queIdx) => {
            const questionId = `${qIdx}-${sIdx}-${queIdx}`;
            return {
              ...question,
              reponse: answers[questionId] || "N/A", // Get the response for the question
            };
          }),
        })),
      };
    });
  
    try {
      console.log("Data to be sent:", fullData); // Debugging line
      await fetch("http://localhost:5000/api/ajouter_questionnaire_projet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projet: id,
          questionnaires: fullData,
        }),
      });
  
      alert("Questionnaires enregistrés avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
      alert("Erreur lors de l'enregistrement.");
    }
  };
  
  
  

  const handleRiskChange = (questionId, field, value) => {
    setRiskData((prev) => {
      const updatedRisk = {
        ...prev[questionId], // If the risk data for the question exists, update it
        [field]: value,
      };
  
      // Recalculate `risqueBrut` and other related fields based on input
      const prob = parseFloat(updatedRisk.probabilite) || 0;
      const impact = parseFloat(updatedRisk.impact) || 0;
      updatedRisk.risqueBrut = prob * impact;
  
      if (updatedRisk.risqueBrut < 4) updatedRisk.niveauRisque = "Faible";
      else if (updatedRisk.risqueBrut < 8) updatedRisk.niveauRisque = "Moyen";
      else if (updatedRisk.risqueBrut < 12) updatedRisk.niveauRisque = "Fort";
      else updatedRisk.niveauRisque = "Extrême";
  
      // Risk net calculation logic
      const efficacite = updatedRisk.efficacite;
      const niveau = updatedRisk.niveauRisque;
      let risqueNet = "";
  
      if (niveau === "Faible") risqueNet = "Accepté";
      else if (niveau === "Moyen") {
        if (["Très satisfaisant", "Satisfaisant"].includes(efficacite)) risqueNet = "Accepté";
        else risqueNet = "Moyen";
      } else if (niveau === "Fort") {
        if (["Très satisfaisant", "Satisfaisant"].includes(efficacite)) risqueNet = "Faible";
        else if (efficacite === "Assez Satisfaisant") risqueNet = "Moyen";
        else risqueNet = "Fort";
      } else if (niveau === "Extrême") {
        if (efficacite === "Très satisfaisant") risqueNet = "Faible";
        else if (efficacite === "Satisfaisant") risqueNet = "Moyen";
        else if (efficacite === "Assez Satisfaisant") risqueNet = "Fort";
        else risqueNet = "Extrême";
      }
  
      updatedRisk.risqueNet = risqueNet;
  
      return {
        ...prev,
        [questionId]: updatedRisk, // Save updated risk data for the specific question
      };
    });
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
              <MDBox mb={2}>
  <Typography variant="h6">Informations complémentaires</Typography>
  <MDBox mt={1} display="flex" flexDirection="column" gap={2}>
    <input
      type="text"
      placeholder="Constat"
      value={riskData[qIdx]?.constat || ""}
      onChange={(e) => handleRiskChange(qIdx, "constat", e.target.value)}
    />
    <input
      type="number"
      placeholder="Probabilité"
      value={riskData[qIdx]?.probabilite || ""}
      onChange={(e) => handleRiskChange(qIdx, "probabilite", e.target.value)}
    />
    <input
      type="number"
      placeholder="Impact"
      value={riskData[qIdx]?.impact || ""}
      onChange={(e) => handleRiskChange(qIdx, "impact", e.target.value)}
    />
    <Typography>
      Niveau de risque brut: {riskData[qIdx]?.risqueBrut || 0}
    </Typography>
    <Typography>
      Niveau de risque: {riskData[qIdx]?.niveauRisque || ""}
    </Typography>
    <input
      type="text"
      placeholder="Élément de maîtrise"
      value={riskData[qIdx]?.elementMaitrise || ""}
      onChange={(e) => handleRiskChange(qIdx, "elementMaitrise", e.target.value)}
    />
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel>Efficacité du contrôle</InputLabel>
      <Select
        value={riskData[qIdx]?.efficacite || ""}
        label="Efficacité du contrôle"
        onChange={(e) => handleRiskChange(qIdx, "efficacite", e.target.value)}
      >
        <MenuItem value="Inexistant">Inexistant</MenuItem>
        <MenuItem value="Incomplet/Inefficace">Incomplet/Inefficace</MenuItem>
        <MenuItem value="Assez Satisfaisant">Assez Satisfaisant</MenuItem>
        <MenuItem value="Satisfaisant">Satisfaisant</MenuItem>
        <MenuItem value="Très satisfaisant">Très satisfaisant</MenuItem>
      </Select>
    </FormControl>
    <Typography>
      Risque net: {riskData[qIdx]?.risqueNet || ""}
    </Typography>

    {/* === New Fields Below === */}
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel>Option de traitement</InputLabel>
      <Select
        value={riskData[qIdx]?.optionTraitement || ""}
        label="Option de traitement"
        onChange={(e) => handleRiskChange(qIdx, "optionTraitement", e.target.value)}
      >
        <MenuItem value="Éviter">Éviter</MenuItem>
        <MenuItem value="Réduire">Réduire</MenuItem>
        <MenuItem value="Accepter">Accepter</MenuItem>
        <MenuItem value="Transférer">Transférer</MenuItem>
      </Select>
    </FormControl>

    <input
      type="text"
      placeholder="Plan d'action"
      value={riskData[qIdx]?.planAction || ""}
      onChange={(e) => handleRiskChange(qIdx, "planAction", e.target.value)}
    />
    <input
      type="number"
      placeholder="Coût"
      value={riskData[qIdx]?.cout || ""}
      onChange={(e) => handleRiskChange(qIdx, "cout", e.target.value)}
    />
    <input
      type="text"
      placeholder="Complexité"
      value={riskData[qIdx]?.complexite || ""}
      onChange={(e) => handleRiskChange(qIdx, "complexite", e.target.value)}
    />
    <input
      type="text"
      placeholder="Priorité"
      value={riskData[qIdx]?.priorite || ""}
      onChange={(e) => handleRiskChange(qIdx, "priorite", e.target.value)}
    />
  </MDBox>
</MDBox>


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
