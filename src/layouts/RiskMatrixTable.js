import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const risques = [
  "Incendie",
  "Inondation",
  "Catastrophe",
  "Tempête",
  "Effondrement du bâtiment",
  "Risque technique Salle Informatique",
  "Coupure d’électricité",
  "Accès",
];

const agences = [
  {
    nom: "Siège",
    valeurs: ["Moyen", "Faible", "Faible", "Moyen", "Faible", "Majeur", "Majeur", "Fort"],
  },
  {
    nom: "Agence 1",
    valeurs: ["Fort", "Faible", "Moyen", "Moyen", "Faible", "Fort", "Fort", "Fort"],
  },
  {
    nom: "Agence 2",
    valeurs: ["Fort", "Faible", "Faible", "Moyen", "Faible", "Fort", "Faible", "Fort"],
  },
  {
    nom: "Agence 3",
    valeurs: ["Fort", "Faible", "Faible", "Moyen", "Faible", "Fort", "Faible", "Moyen"],
  },
  {
    nom: "Agence 4",
    valeurs: ["Fort", "Faible", "Moyen", "Moyen", "Faible", "Fort", "Faible", "Moyen"],
  },
];

const getColor = (niveau) => {
  switch (niveau) {
    case "Faible":
      return "#A5D6A7"; // vert
    case "Moyen":
      return "#FFF176"; // jaune
    case "Fort":
      return "#FFB74D"; // orange
    case "Majeur":
      return "#E57373"; // rouge
    default:
      return "#FFFFFF"; // blanc
  }
};

export default function RiskMatrixTable() {
  return (
    <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
      <Table
        size="small"
        sx={{
          tableLayout: "fixed",
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                width: 150,
                minWidth: 150,
                maxWidth: 150,
              }}
            >
              Sites
            </TableCell>
            {risques.map((risque, index) => (
              <TableCell
                key={index}
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  width: 180,
                  minWidth: 180,
                  maxWidth: 180,
                  whiteSpace: "normal",
                }}
              >
                {risque}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {agences.map((agence, rowIndex) => (
            <TableRow key={rowIndex}>
              <TableCell
                component="th"
                scope="row"
                sx={{ textAlign: "center", fontWeight: "bold", minWidth: 100 }}
              >
                {agence.nom}
              </TableCell>
              {agence.valeurs.map((niveau, colIndex) => (
                <TableCell
                  key={colIndex}
                  sx={{
                    backgroundColor: getColor(niveau),
                    textAlign: "center",
                    fontWeight: "bold",
                    minWidth: 120,
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                >
                  {niveau}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
