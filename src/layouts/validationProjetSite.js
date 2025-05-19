import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  Grid, Accordion, AccordionSummary, AccordionDetails, Typography,
  Select, MenuItem, FormControl, InputLabel, ListItemIcon, ListItemText,
  TextField, Card, CardContent, CardHeader, CircularProgress, Backdrop, Paper
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import HelpIcon from "@mui/icons-material/Help";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useTheme } from "@mui/material/styles";

const ValidationProjetSite = () => {
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const location = useLocation();
  const { selectedQuestionnaires } = location.state || {};
  const [questionnaireData, setQuestionnaireData] = useState([]);
  const [answers, setAnswers] = useState({});
  const { id } = useParams(); // siteId
  const [riskData, setRiskData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [standards, siteRes] = await Promise.all([
          Promise.all(
            selectedQuestionnaires.map((titre) =>
              fetch(`http://localhost:5000/api/questionnaireRoutes?titre=${titre}`).then((res) =>
                res.json()
              )
            )
          ),
          fetch(`http://localhost:5000/api/questionnaire_projet_site?siteId=${id}`).then((res) =>
            res.json()
          ),
        ]);

        const flatData = standards.map((r) => r[0]);
        const project = siteRes;

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

        const mergedData = flatData.map((q) => {
          const matched = project.find((pq) => pq.titre === q.titre);
          return matched || q;
        });

        setQuestionnaireData(mergedData);
      } catch (err) {
        console.error("❌ Erreur lors du chargement :", err);
      } finally {
        setLoading(false);
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

  const handleCommentChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [`${questionId}-comment`]: value,
    }));
  };

  const handleRiskChange = (questionId, field, value) => {
    setRiskData((prev) => {
      const updatedRisk = {
        ...prev[questionId],
        [field]: value,
      };

      const prob = parseFloat(updatedRisk.probabilite) || 0;
      const impact = parseFloat(updatedRisk.impact) || 0;
      updatedRisk.risqueBrut = prob * impact;

      if (updatedRisk.risqueBrut < 4) updatedRisk.niveauRisque = "Faible";
      else if (updatedRisk.risqueBrut < 8) updatedRisk.niveauRisque = "Moyen";
      else if (updatedRisk.risqueBrut < 12) updatedRisk.niveauRisque = "Fort";
      else updatedRisk.niveauRisque = "Extrême";

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
        [questionId]: updatedRisk,
      };
    });
  };

  const handleSave = async () => {
    const fullData = questionnaireData.map((q, qIdx) => {
      const risk = riskData[qIdx] || {};
      return {
        titre: q.titre,
        description: q.description,
        cible: q.cible,
        risqueAssocie: q.risqueAssocie,
        index: q.index,
        statut: q.statut || "Actif",
        analyse: {
          scenarioRisque: q.titre,
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
              reponse: answers[questionId] || "N/A",
            };
          }),
        })),
      };
    });

    try {
      await fetch("http://localhost:5000/api/ajouter_questionnaire_projet_site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId: id, questionnaires: fullData }),
      });
      alert("✅ Données enregistrées avec succès !");
    } catch (error) {
      console.error("❌ Erreur lors de l'enregistrement :", error);
      alert("Erreur lors de l'enregistrement.");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={4} px={3}>
        {loading ? (
          <Backdrop open>
            <CircularProgress color="inherit" />
            <Typography variant="h6" color="white" sx={{ ml: 2 }}>
              Chargement...
            </Typography>
          </Backdrop>
        ) : (
          <>
            {/* Affichage des questionnaires similaires à ValidationProject */}
            {/* Tu peux copier tout le rendu de ValidationProject ici */}

            <MDBox mt={6} display="flex" justifyContent="center" gap={3}>
              <MDButton color="info" onClick={handleSave}>Enregistrer</MDButton>
              {/* Tu peux ajouter l'export Excel ici si tu veux */}
            </MDBox>
          </>
        )}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default ValidationProjetSite;
