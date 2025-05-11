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
import { useTheme } from "@mui/material/styles";

const ValidationProject = () => {
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;
  const location = useLocation();
  const { selectedQuestionnaires } = location.state || {};
  const [questionnaireData, setQuestionnaireData] = useState([]);
  const [answers, setAnswers] = useState({});
  const { id } = useParams();
  const [riskData, setRiskData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
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
        console.error("Erreur lors du chargement tissu des données :", err);
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
        font: { bold: true, size: 12 },
        alignment: { vertical: "middle", horizontal: "center" },
        fill: {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFDCE6F1" },
        },
      },
    }));

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

    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        if (rowNumber === 1) {
          cell.font = { bold: true, size: 12 };
        } else {
          cell.font = { size: 11 };
        }
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, `Questionnaires_Export_${id}.xlsx`);
  };

  return (
    <>
      <Backdrop
        sx={{
          color: primaryColor,
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
        open={loading}
      >
        <CircularProgress color="inherit" size={60} thickness={4} />
        <Typography variant="h6" color="white" sx={{ mt: 2 }}>
          Chargement des données...
        </Typography>
      </Backdrop>
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox mt={6} px={3} py={4} className="main-container">
          <Grid container spacing={4}>
            {questionnaireData.map((questionnaire, qIdx) => (
              <Grid item xs={12} key={qIdx}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    boxShadow: `0 4px 20px ${theme.palette.grey[200]}`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: `0 8px 30px ${theme.palette.grey[300]}`,
                    },
                  }}
                >
                  <CardHeader
                    title={
                      <Typography
                        variant="h5"
                        sx={{
                          color: primaryColor,
                          fontWeight: 600,
                          background: `linear-gradient(90deg, ${primaryColor}, ${theme.palette.primary.light})`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {questionnaire.titre}
                      </Typography>
                    }
                    sx={{ pb: 1 }}
                  />
                  <CardContent>
                    {questionnaire.sections.map((section, sIdx) => (
                      <Accordion
                        key={sIdx}
                        sx={{
                          mb: 2,
                          borderRadius: 2,
                          border: `1px solid ${theme.palette.grey[200]}`,
                          "&:before": { display: "none" },
                          "&:hover": {
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
                            variant="subtitle1"
                            fontWeight="medium"
                            sx={{ color: theme.palette.text.primary }}
                          >
                            {section.titre}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 3, backgroundColor: theme.palette.grey[50] }}>
                          {section.questions.map((question, queIdx) => {
                            const questionId = `${qIdx}-${sIdx}-${queIdx}`;
                            return (
                              <MDBox
                                key={questionId}
                                display="flex"
                                flexDirection="column"
                                alignItems="flex-start"
                                mb={2}
                                p={2}
                                sx={{
                                  backgroundColor: "#ffffff",
                                  borderRadius: 1,
                                  boxShadow: `0 2px 8px ${theme.palette.grey[200]}`,
                                  transition: "all 0.2s ease",
                                  "&:hover": {
                                    transform: "translateY(-2px)",
                                  },
                                }}
                              >
                                <Typography variant="body1" sx={{ flex: 1, mb: 1 }}>
                                  {question.texte}
                                </Typography>
                                <FormControl size="small" sx={{ minWidth: 200 }}>
                                  <InputLabel>Réponse</InputLabel>
                                  <Select
                                    value={answers[questionId] || ""}
                                    onChange={(e) => handleSelectChange(questionId, e.target.value)}
                                    label="Réponse"
                                    sx={{
                                      "& .MuiSelect-select": {
                                        display: "flex",
                                        alignItems: "center",
                                      },
                                    }}
                                  >
                                    <MenuItem value="Oui">
                                      <ListItemIcon>
                                        <CheckIcon sx={{ color: theme.palette.success.main }} />
                                      </ListItemIcon>
                                      <ListItemText primary="Oui" />
                                    </MenuItem>
                                    <MenuItem value="Non">
                                      <ListItemIcon>
                                        <CloseIcon sx={{ color: theme.palette.error.main }} />
                                      </ListItemIcon>
                                      <ListItemText primary="Non" />
                                    </MenuItem>
                                    <MenuItem value="N/A">
                                      <ListItemIcon>
                                        <HelpIcon sx={{ color: theme.palette.grey[500] }} />
                                      </ListItemIcon>
                                      <ListItemText primary="N/A" />
                                    </MenuItem>
                                    <MenuItem value="Commentaires">
                                      <ListItemIcon>
                                        <HelpIcon sx={{ color: theme.palette.grey[500] }} />
                                      </ListItemIcon>
                                      <ListItemText primary="Commentaires" />
                                    </MenuItem>
                                  </Select>
                                </FormControl>
                                {answers[questionId] === "Commentaires" && (
                                  <TextField
                                    fullWidth
                                    label="Commentaires"
                                    multiline
                                    minRows={3}
                                    value={answers[`${questionId}-comment`] || ""}
                                    onChange={(e) => handleCommentChange(questionId, e.target.value)}
                                    variant="outlined"
                                    sx={{ mt: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                                  />
                                )}
                              </MDBox>
                            );
                          })}
                        </AccordionDetails>
                      </Accordion>
                    ))}
                    <Grid container spacing={2} mt={3}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 500 }}>
                          Analyse de Risque
                        </Typography>
                        <TextField
                          fullWidth
                          label="Constat"
                          value={riskData[qIdx]?.constat || ""}
                          onChange={(e) => handleRiskChange(qIdx, "constat", e.target.value)}
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              "&:hover fieldset": {
                                borderColor: primaryColor,
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="Probabilité"
                          type="number"
                          value={riskData[qIdx]?.probabilite || ""}
                          onChange={(e) => handleRiskChange(qIdx, "probabilite", e.target.value)}
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              "&:hover fieldset": {
                                borderColor: primaryColor,
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="Impact"
                          type="number"
                          value={riskData[qIdx]?.impact || ""}
                          onChange={(e) => handleRiskChange(qIdx, "impact", e.target.value)}
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              "&:hover fieldset": {
                                borderColor: primaryColor,
                              },
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 500 }}>
                          Risque brut :
                        </Typography>
                        <Paper
                          elevation={3}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            fontWeight: "bold",
                            color: "#fff",
                            fontSize: "1.1rem",
                            textAlign: "center",
                            backgroundColor:
                              riskData[qIdx]?.niveauRisque === "Faible"
                                ? theme.palette.success.main
                                : riskData[qIdx]?.niveauRisque === "Moyen"
                                ? theme.palette.warning.main
                                : riskData[qIdx]?.niveauRisque === "Fort"
                                ? theme.palette.error.main
                                : riskData[qIdx]?.niveauRisque === "Extrême"
                                ? theme.palette.error.dark
                                : theme.palette.grey[500],
                          }}
                        >
                          {riskData[qIdx]?.niveauRisque || "Risque non évalué"}
                        </Paper>
                      </Grid>

                      <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 500 }}>
                          Mesures de Contrôle
                        </Typography>
                        <Grid container spacing={2} mt={1}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Élément de maîtrise"
                              value={riskData[qIdx]?.elementMaitrise || ""}
                              onChange={(e) => handleRiskChange(qIdx, "elementMaitrise", e.target.value)}
                              variant="outlined"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                  "&:hover fieldset": {
                                    borderColor: primaryColor,
                                  },
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                          <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
  <InputLabel>Efficacité</InputLabel>
  <Select
    value={riskData[qIdx]?.efficacite || ""}
    onChange={(e) => handleRiskChange(qIdx, "efficacite", e.target.value)}
    label="Efficacité"
    sx={{
      borderRadius: 2,
      height: '40px', // 👈 fixe la hauteur globale
      "& .MuiSelect-select": {
        display: 'flex',
        alignItems: 'center',
        height: '40px', // 👈 aligne bien le contenu
        padding: '8px 14px',
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: primaryColor,
      },
    }}
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
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 500 }}>
                          Risque Net :
                        </Typography>
                        <Paper
                          elevation={3}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            fontWeight: "bold",
                            color: "#fff",
                            fontSize: "1.1rem",
                            textAlign: "center",
                            backgroundColor:
                              riskData[qIdx]?.risqueNet === "Accepté"
                                ? theme.palette.success.main
                                : riskData[qIdx]?.risqueNet === "Faible"
                                ? theme.palette.success.light
                                : riskData[qIdx]?.risqueNet === "Moyen"
                                ? theme.palette.warning.main
                                : riskData[qIdx]?.risqueNet === "Fort"
                                ? theme.palette.error.main
                                : riskData[qIdx]?.risqueNet === "Extrême"
                                ? theme.palette.error.dark
                                : theme.palette.grey[500],
                          }}
                        >
                          {riskData[qIdx]?.risqueNet || "Risque non évalué"}
                        </Paper>
                      </Grid>
                      
                      <Grid item xs={12}  >
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 500, mb: 3 }}>
                          Stratégie :
                        </Typography>
                       <FormControl fullWidth size="small" sx={{ minWidth: 200  }}>
  <InputLabel>Stratégie</InputLabel>
  <Select
    value={riskData[qIdx]?.optionTraitement || ""}
    onChange={(e) => handleRiskChange(qIdx, "optionTraitement", e.target.value)}
    label="Option de traitement"
    sx={{
      borderRadius: 2,
      height: '40px',
      "& .MuiSelect-select": {
        display: 'flex',
        alignItems: 'center',
        height: '40px',
        padding: '8px 14px',
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: primaryColor,
      },
    }}
  >
    <MenuItem value="Éviter">Éviter</MenuItem>
    <MenuItem value="Réduire">Réduire</MenuItem>
    <MenuItem value="Accepter">Accepter</MenuItem>
    <MenuItem value="Transférer">Transférer</MenuItem>
  </Select>
</FormControl>

                      </Grid>
                      <Grid item xs={12}  >
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 500 , mb: 3  }} >
                          Plan d&apos;action :
                        </Typography>
                        <Grid item xs={12} >
                            <TextField
                              fullWidth
                              label="Plan d'action"
                              value={riskData[qIdx]?.planAction || ""}
                              onChange={(e) => handleRiskChange(qIdx, "planAction", e.target.value)}
                              variant="outlined"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                  "&:hover fieldset": {
                                    borderColor: primaryColor,
                                  },
                                },
                              }}
                            />
                          </Grid>
                          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 500, mt: 2 }}>
                          Faisibilité :
                        </Typography> 
                        </Grid>
                      {[
                       
                        { label: "Coût", field: "cout", type: "number" },
                        { label: "Complexité", field: "complexite" },
                        { label: "Priorité", field: "priorite" },
                      ].map(({ label, field, type = "text" }) => (
                        <Grid item xs={12} key={field}>
                          <TextField
                            fullWidth
                            label={label}
                            type={type}
                            value={riskData[qIdx]?.[field] || ""}
                            onChange={(e) => handleRiskChange(qIdx, field, e.target.value)}
                            variant="outlined"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                "&:hover fieldset": {
                                  borderColor: primaryColor,
                                },
                              },
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <MDBox mt={6} display="flex" justifyContent="center" gap={3}>
            <MDButton
              color="info"
              onClick={handleSave}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                boxShadow: `0 4px 12px ${theme.palette.info.main}50`,
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: `0 6px 16px ${theme.palette.info.main}80`,
                  transform: "translateY(-2px)",
                },
              }}
            >
              Enregistrer
            </MDButton>
            <MDButton
              color="success"
              onClick={handleExportToExcel}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                boxShadow: `0 4px 12px ${theme.palette.success.main}50`,
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: `0 6px 16px ${theme.palette.success.main}80`,
                  transform: "translateY(-2px)",
                },
              }}
            >
              Extraction
            </MDButton>
          </MDBox>
        </MDBox>
        <Footer />
      </DashboardLayout>
      <style>
        {`
          .main-container {
            background: linear-gradient(145deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[100]} 100%);
            border-radius: 16px;
            min-height: calc(100vh - 200px);
            padding: 32px;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          }

          .MuiCard-root {
            overflow: hidden;
            max-width: 1200px;
            margin: 0 auto;
            background-color: #ffffff;
          }

          .MuiAccordion-root {
            transition: all 0.3s ease;
          }

          .MuiAccordionSummary-root {
            border-bottom: 1px solid ${theme.palette.grey[200]};
            min-height: 64px !important;
          }

          .MuiAccordionDetails-root {
            padding: 24px;
            border-top: 1px solid ${theme.palette.grey[200]};
          }

          .MuiTypography-body1 {
            line-height: 1.6;
            font-weight: 400;
          }

          .MuiTextField-root, .MuiFormControl-root {
            transition: all 0.2s ease;
          }

          .MuiPaper-root {
            transition: transform 0.2s ease;
          }

          @media (max-width: 600px) {
            .main-container {
              padding: 16px;
              border-radius: 8px;
            }

            .MuiTypography-h5 {
              font-size: 1.5rem;
            }

            .MuiTypography-body1 {
              font-size: 0.9rem;
            }

            .MuiFormControl-root {
              min-width: 150px;
            }

            .MuiButton-root {
              padding: 8px 16px;
              font-size: 0.85rem;
            }

            .MuiAccordionDetails-root {
              padding: 16px;
            }
          }
        `}
      </style>
    </>
  );
};

export default ValidationProject;