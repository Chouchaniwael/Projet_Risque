// 🔼 imports existants
import React, { useEffect, useState } from "react";
import {
  Grid, TextField, Button, Paper, Typography, IconButton, Card, CardContent
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Bar, Pie } from "react-chartjs-2";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, Title,
  CategoryScale, LinearScale, BarElement
} from "chart.js";
import AddIcon from "@mui/icons-material/Add";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

ChartJS.register(ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale, BarElement);

function Dashboard() {
  const [clientCount, setClientCount] = useState(0);
  const [clients, setClients] = useState([]);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [barChartData, setBarChartData] = useState({ labels: [], datasets: [] });
  const [pieBySectorData, setPieBySectorData] = useState({ labels: [], datasets: [] });
  const [riskBySectorData, setRiskBySectorData] = useState({ labels: [], datasets: [] }); // 🔸 Nouveau graphique

  const statut = true;

  const [riskCounts, setRiskCounts] = useState({
    extreme: 0, fort: 0, moyen: 0, faible: 0, accepte: 0
  });

  const [kanbanTasks, setKanbanTasks] = useState({
    idea: [{ id: "1", content: "Task 1" }, { id: "2", content: "Task 2" }],
    started: [{ id: "3", content: "Task 3" }],
    finished: [{ id: "4", content: "Task 4" }],
  });

  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/countclient")
      .then((res) => res.json())
      .then((data) => setClientCount(data.clientCount))
      .catch((err) => console.error("Erreur:", err));

    fetch(`http://localhost:5000/api/clients?statut=${statut}`)
      .then((res) => res.json())
      .then((data) => {
        setClients(data);

        const sectorCount = {};
        data.forEach((client) => {
          const secteur = client.Secteur || "Inconnu";
          sectorCount[secteur] = (sectorCount[secteur] || 0) + 1;
        });

        const labels = Object.keys(sectorCount);
        const values = Object.values(sectorCount);

        setBarChartData({
          labels,
          datasets: [{
            label: "Nombre de clients",
            data: values,
            backgroundColor: "#42a5f5",
          }],
        });

        setPieBySectorData({
          labels,
          datasets: [{
            label: "Répartition par secteur",
            data: values,
            backgroundColor: [
              "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF",
              "#FF6384", "#36A2EB", "#FFCE56"
            ],
            hoverOffset: 4,
          }],
        });
      })
      .catch((err) => console.error("Erreur:", err));

    fetch("http://localhost:5000/api/stats/risques")
      .then((res) => res.json())
      .then((data) => {
        const risks = data.details || {};
        const normalised = {
          extreme: risks["Extrême"] || 0,
          fort: risks["Fort"] || 0,
          moyen: risks["Moyen"] || 0,
          faible: risks["Faible"] || 0,
          accepte: risks["Accepté"] || 0,
        };
        setRiskCounts(normalised);
      })
      .catch((err) => console.error("Erreur lors de la récupération des risques:", err));

    // 🔸 Nouvelle requête pour les risques par secteur
    fetch("http://localhost:5000/api/risqueparsecteur/stats/risques/secteur")
      .then((res) => res.json())
      .then((data) => {
        const raw = data.parSecteur || {};
        const labels = Object.keys(raw);
        const gravites = ["Extrême", "Fort", "Moyen", "Faible", "Accepté"];
        const colors = {
          "Extrême": "#e53935",
          "Fort": "#fb8c00",
          "Moyen": "#fdd835",
          "Faible": "#43a047",
          "Accepté": "#1e88e5"
        };

        const datasets = gravites.map((gravite) => ({
          label: gravite,
          data: labels.map((secteur) => raw[secteur][gravite] || 0),
          backgroundColor: colors[gravite],
          stack: "stack1",
        }));

        setRiskBySectorData({ labels, datasets });
      })
      .catch((err) => console.error("Erreur récupération risques/secteur :", err));
  }, [statut]);

  // 🔸 Options du Pie Chart
  const pieBySectorOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const data = tooltipItem.dataset.data;
            const total = data.reduce((sum, val) => sum + val, 0);
            const value = data[tooltipItem.dataIndex];
            const percentage = ((value / total) * 100).toFixed(1);
            return `${tooltipItem.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  // 🔸 Options du Bar Chart (clients)
  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Répartition des clients par secteur" },
    },
    scales: { y: { beginAtZero: true } },
  };

  // 🔸 Options du graphique risques par secteur
  const riskBySectorOptions = {
    responsive: true,
    plugins: {
      title: { display: true, text: "Risques par secteur et par gravité" },
      legend: { position: "bottom" },
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true },
    },
  };

  const handleAddKanbanTask = () => {
    if (newTask.trim()) {
      setKanbanTasks((prev) => ({
        ...prev,
        idea: [...prev.idea, { id: Date.now().toString(), content: newTask }],
      }));
      setNewTask("");
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    const sourceColumn = [...kanbanTasks[source.droppableId]];
    const destColumn = [...kanbanTasks[destination.droppableId]];
    const [moved] = sourceColumn.splice(source.index, 1);
    destColumn.splice(destination.index, 0, moved);
    setKanbanTasks((prev) => ({
      ...prev,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destColumn,
    }));
  };

  const onDeleteTask = (columnId, taskId) => {
    setKanbanTasks((prev) => ({
      ...prev,
      [columnId]: prev[columnId].filter((task) => task.id !== taskId),
    }));
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* Cartes de statistiques */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <ComplexStatisticsCard color="error" icon="people" title="Nombre de clients gérés" count={clientCount} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ComplexStatisticsCard color="warning" icon="priority_high" title="Risques extrêmes" count={riskCounts.extreme} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ComplexStatisticsCard color="info" icon="signal_cellular_4_bar" title="Risques forts" count={riskCounts.fort} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ComplexStatisticsCard color="success" icon="check_circle" title="Risques moyens" count={riskCounts.moyen} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ComplexStatisticsCard color="secondary" icon="check_circle_outline" title="Risques faibles" count={riskCounts.faible} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ComplexStatisticsCard color="secondary" icon="check_circle_outline" title="Risques acceptés" count={riskCounts.accepte} />
          </Grid>
        </Grid>

        {/* Graphiques */}
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <Card><CardContent>
                <Typography variant="h6" mb={2}>Répartition clients par secteur (pourcentage)</Typography>
                <Pie data={pieBySectorData} options={pieBySectorOptions} />
              </CardContent></Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Card><CardContent>
                <Typography variant="h6" mb={2}>Répartition des clients par secteur (barres)</Typography>
                <Bar data={barChartData} options={barOptions} />
              </CardContent></Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Card><CardContent>
                <Typography variant="h6" mb={2}>Risques par secteur et gravité</Typography>
                <Bar data={riskBySectorData} options={riskBySectorOptions} />
              </CardContent></Card>
            </Grid>
          </Grid>
        </MDBox>

        {/* Calendar + bouton chat + Kanban : identiques */}
        {/* ... conserver le reste du code existant ... */}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
