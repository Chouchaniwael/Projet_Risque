// ... imports identiques
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
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
  ListItemIcon,
  ListItemText,
  TextField,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Backdrop,
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
import { Paper } from "@mui/material";
import * as XLSX from "xlsx"; // Importation de la bibliothèque xlsx

const ValidationProject = () => {
  const location = useLocation();
  const { selectedQuestionnaires } = location.state || {};
  const [questionnaireData, setQuestionnaireData] = useState([]);
  const [answers, setAnswers] = useState({});
  const { id } = useParams();
  const [riskData, setRiskData] = useState({});
  const [loading, setLoading] = useState(false); // État pour le chargement

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true); // Activer le visuel de chargement
      try {
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
        console.error("Erreur lors du chargement des données :", err);
      } finally {
        setLoading(false); // Désactiver le visuel de chargement
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

  const handleExportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Questionnaires");
  
    // Définir les en-têtes et leur style
    const headers = [
      "Titre", "Description", "Cible", "Risque Associé", "Statut",
      "Constat", "Probabilité", "Impact", "Risque Brut", "Niveau de Risque",
      "Élément de Maîtrise", "Efficacité", "Risque Net", "Option de Traitement",
      "Plan d'Action", "Coût", "Complexité", "Priorité"
    ];
  
    worksheet.columns = headers.map((header) => ({
      header,
      key: header,
      width: 25,
      style: {
        font: { bold: true },
        alignment: { vertical: "middle", horizontal: "center" },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFCCE5FF" }, // Bleu clair
        },
      },
    }));
  
    // Ajouter les données
    questionnaireData.forEach((q, qIdx) => {
      const risk = riskData[qIdx] || {};
  
      worksheet.addRow({
        "Titre": q.titre,
        "Description": q.description,
        "Cible": q.cible,
        "Risque Associé": q.risqueAssocie,
        "Statut": q.statut || "Actif",
        "Constat": risk.constat || "",
        "Probabilité": risk.probabilite || 0,
        "Impact": risk.impact || 0,
        "Risque Brut": risk.risqueBrut || 0,
        "Niveau de Risque": risk.niveauRisque || "",
        "Élément de Maîtrise": risk.elementMaitrise || "",
        "Efficacité": risk.efficacite || "",
        "Risque Net": risk.risqueNet || "",
        "Option de Traitement": risk.optionTraitement || "",
        "Plan d'Action": risk.planAction || "",
        "Coût": risk.cout || 0,
        "Complexité": risk.complexite || "",
        "Priorité": risk.priorite || "",
      });
    });
  
    // Appliquer un style aux lignes (facultatif : bordures, alternance, etc.)
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        if (rowNumber === 1) {
          cell.font = { bold: true };
        }
      });
    });
  
    // Générer et télécharger le fichier
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, `Questionnaires_Export_${id}.xlsx`);
  };
  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox mt={4} px={2}>
          <Grid container spacing={3}>
            {questionnaireData.map((questionnaire, qIdx) => (
              <Grid item xs={12} key={qIdx}>
                <Card variant="outlined">
                  <CardHeader title={questionnaire.titre} />
                  <CardContent>
                    {questionnaire.sections.map((section, sIdx) => (
                      <Accordion key={sIdx} sx={{ mb: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {section.titre}
                          </Typography>
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
                                <Typography>{question.texte}</Typography>
                                <FormControl size="small" sx={{ minWidth: 200 }}>
                                  <InputLabel>Réponse</InputLabel>
                                  <Select
                                    value={answers[questionId] || ""}
                                    onChange={(e) =>
                                      handleSelectChange(questionId, e.target.value)
                                    } 
                                    label="Réponse"
                                  >
                                    <MenuItem value="Oui">
                                      <ListItemIcon>
                                        <CheckIcon sx={{ color: "green" }} />
                                      </ListItemIcon>
                                      <ListItemText primary="Oui" />
                                    </MenuItem>
                                    <MenuItem value="Non">
                                      <ListItemIcon>
                                        <CloseIcon sx={{ color: "red" }} />
                                      </ListItemIcon>
                                      <ListItemText primary="Non" />
                                    </MenuItem>
                                    <MenuItem value="N/A">
                                      <ListItemIcon>
                                        <HelpIcon sx={{ color: "gray" }} />
                                      </ListItemIcon>
                                      <ListItemText primary="NA" />
                                    </MenuItem>
                                  </Select>
                                </FormControl>
                              </MDBox>
                            );
                          })}
                        </AccordionDetails>
                      </Accordion>
                    ))}

                    <Typography variant="h6" mt={4}>
                      Risques bruts:
                    </Typography>
                    <Grid container spacing={2} mt={1}>
                      {/* Ligne 1 : Constat + Probabilité + Impact */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Constat"
                          multiline
                          minRows={3}
                          value={riskData[qIdx]?.constat || ""}
                          onChange={(e) => handleRiskChange(qIdx, "constat", e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="Probabilité"
                          multiline
                          minRows={3}
                         
                          value={riskData[qIdx]?.probabilite || ""}
                          onChange={(e) => handleRiskChange(qIdx, "probabilite", e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="Impact"
                         
                          multiline
                          minRows={3}
                          value={riskData[qIdx]?.impact || ""}
                          onChange={(e) => handleRiskChange(qIdx, "impact", e.target.value)}
                        />
                      </Grid> 
                      <Grid item xs={12}>
  <Typography variant="subtitle2" gutterBottom>
    Risque brut :
  </Typography>
  <Paper
    elevation={3}
    sx={{
      p: 2,
      border: "1px solid #ccc",
      borderRadius: "8px",
      fontWeight: "bold",
      color: "#fff",
      fontSize: "1.1rem",
      textAlign: "center",
      backgroundColor:
        riskData[qIdx]?.niveauRisque === "Faible"
          ? "#4caf50" // vert
          : riskData[qIdx]?.niveauRisque === "Moyen"
          ? "#ff9800" // orange
          : riskData[qIdx]?.niveauRisque === "Fort"
          ? "#f44336" // rouge
          : riskData[qIdx]?.niveauRisque === "Extrême"
          ? "#b71c1c" // rouge foncé
          : "#9e9e9e", // gris par défaut si non défini
    }}
  >
    {riskData[qIdx]?.niveauRisque || "Risque non évalué"}
  </Paper>
</Grid>

                  
                      <Grid item xs={12}>
  <Typography variant="h6" mt={4}>
    Mesures de Contrôle
  </Typography>
  <Grid container spacing={2} mt={1}>
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        label="Élément de maîtrise"
        value={riskData[qIdx]?.elementMaitrise || ""}
        onChange={(e) => handleRiskChange(qIdx, "elementMaitrise", e.target.value)}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <FormControl fullWidth size="small" >
      <InputLabel>Efficacité</InputLabel>
        <Select
          value={riskData[qIdx]?.efficacite || ""}
          onChange={(e) => handleRiskChange(qIdx, "efficacite", e.target.value)}
          label="Efficacité"
          sx={{ width: '250px' }}
        >
          <MenuItem value="Inexistant">Inexistant</MenuItem>
          <MenuItem value="Incomplet/Inefficace">Incomplet/Inefficace</MenuItem>
          <MenuItem value="Assez Satisfaisant">Assez Satisfaisant</MenuItem>
          <MenuItem value="Satisfaisant">Satisfaisant</MenuItem>
          <MenuItem value="Très satisfaisant">Très satisfaisant</MenuItem>
        </Select>
      </FormControl>
    </Grid>
  </Grid>
</Grid>
<Grid item xs={12}>
  <Typography variant="subtitle2" gutterBottom>
    Risque Net :
  </Typography>
  <Paper
    elevation={3}
    sx={{
      p: 2,
      border: "1px solid #ccc",
      borderRadius: "8px",
      fontWeight: "bold",
      color: "#fff",
      fontSize: "1.1rem",
      textAlign: "center",
      backgroundColor:
        riskData[qIdx]?.risqueNet === "Accepté"
          ? "#4caf50" // vert
          : riskData[qIdx]?.risqueNet === "Faible"
          ? "#81c784" // vert

          : riskData[qIdx]?.risqueNet === "Moyen"
          ? "#ff9800" // orange
          : riskData[qIdx]?.risqueNet === "Fort"
          ? "#f44336" // rouge
          : riskData[qIdx]?.risqueNet === "Extrême"
          ? "#b71c1c" // rouge foncé
          : "#9e9e9e", // gris par défaut si non évalué
    }}
  >
    {riskData[qIdx]?.risqueNet || "Risque non évalué"}
  </Paper>
</Grid>
<Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="medium">
                          <InputLabel>Stratégie</InputLabel>
                          <Select
                            value={riskData[qIdx]?.optionTraitement || ""}
                            onChange={(e) =>
                              handleRiskChange(qIdx, "optionTraitement", e.target.value)
                            }
                            label="Option de traitement"
                          >
                            <MenuItem value="Éviter">Éviter</MenuItem>
                            <MenuItem value="Réduire">Réduire</MenuItem>
                            <MenuItem value="Accepter">Accepter</MenuItem>
                            <MenuItem value="Transférer">Transférer</MenuItem>
                          </Select>
                        </FormControl>
                      
                      </Grid>


                      {/* Autres champs inchangés */}
                      {[  
                      
                        { label: "Plan d'action", field: "planAction" },
                        { label: "Coût", field: "cout", type: "number" },
                        { label: "Complexité", field: "complexite" },
                        { label: "Priorité", field: "priorite" },
                      ].map(({ label, field, type = "text" }) => (
                        <Grid item xs={12} sm={6} key={field}>
                          <TextField
                            fullWidth
                            label={label}
                            type={type}
                            value={riskData[qIdx]?.[field] || ""}
                            onChange={(e) => handleRiskChange(qIdx, field, e.target.value)}
                          />
                        </Grid>
                      ))}

                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <MDBox mt={4} display="flex" justifyContent="center">
            <MDButton color="info" onClick={handleSave}>
              Enregistrer
            </MDButton>
            <MDButton color="success" onClick={handleExportToExcel} sx={{ ml: 2 }}>
              Extraction
            </MDButton>
          </MDBox>
        </MDBox>
        <Footer />
      </DashboardLayout>
    </>
  );
};

export default ValidationProject;
