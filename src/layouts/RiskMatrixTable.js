import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";

const getColor = (niveau) => {
  switch (niveau) {
    case "Faible": return "#A5D6A7";
    case "Moyen": return "#FFF176";
    case "Fort": return "#FFB74D";
    case "Majeur": return "#E57373";
    case "Extrême": return "#D32F2F";
    case "Non évalué": return "#B0BEC5";
    default: return "#FFFFFF";
  }
};

export default function RiskMatrixTable() {
  const { id } = useParams();
  const projetId = id;
  const [questionnaires, setQuestionnaires] = useState([]);

  useEffect(() => {
    if (!projetId) {
      console.error("Erreur: projetId est undefined ou vide.");
      return;
    }

    fetch(`http://localhost:5000/api/questionnaire_projet?projet=${projetId}`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          setQuestionnaires(data);
          console.log("Données des questionnaires:", data);
        }
      })
      .catch(err => console.error("Erreur de chargement des risques:", err));
  }, [projetId]);

  if (!questionnaires.length) return <p>Chargement des données...</p>;

  return (
    <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
      <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>
        <TableBody>
          <TableRow>
            {questionnaires.map((q, idx) => (
              <TableCell
                key={`cell-${idx}`}
                align="center"
                sx={{
                  padding: "12px",
                  width: `${100 / questionnaires.length}%`,
                  borderRight: idx < questionnaires.length - 1 ? "1px solid rgba(224, 224, 224, 1)" : "none"
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                  {q.titre}
                </div>
                <div 
                  style={{
                    backgroundColor: getColor(q.analyse?.risqueNet || "Non évalué"),
                    fontWeight: "bold",
                    padding: "8px",
                    borderRadius: "4px"
                  }}
                >
                  {q.analyse?.risqueNet || "Non évalué"}
                </div>
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

import PropTypes from "prop-types"; // Importation de PropTypes pour la validation des props

// Validation des props
RiskMatrixTable.propTypes = {
  projetId: PropTypes.string.isRequired, // Assure que projetId est une chaîne et est requis
};
