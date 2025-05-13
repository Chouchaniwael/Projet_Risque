import React, { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Paper,
  Typography,
  IconButton,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Bar } from "react-chartjs-2";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  BarElement,
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
  const statut = true;
  const [barChartData, setBarChartData] = useState({ labels: [], datasets: [] });

  const [kanbanTasks, setKanbanTasks] = useState({
    idea: [{ id: "1", content: "Task 1" }, { id: "2", content: "Task 2" }],
    started: [{ id: "3", content: "Task 3" }],
    finished: [{ id: "4", content: "Task 4" }],
  });

  const [newTask, setNewTask] = useState("");

  const [riskCounts, setRiskCounts] = useState({
    extreme: 0,
    fort: 0,
    moyen: 0,
    faible: 0,
    accepte: 0,
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/countclient")
      .then((res) => res.json())
      .then((data) => {
        setClientCount(data.clientCount);
      })
      .catch((err) => console.error("Erreur:", err));

    fetch(`http://localhost:5000/api/clients?statut=${statut}`)
      .then((res) => res.json())
      .then((data) => {
        setClients(data);

        // 🎯 Comptage des clients par secteur
        const sectorCount = {};
        data.forEach((client) => {
          const secteur = client.Secteur || "Inconnu";
          sectorCount[secteur] = (sectorCount[secteur] || 0) + 1;
        });

        const labels = Object.keys(sectorCount);
        const values = Object.values(sectorCount);

        setBarChartData({
          labels,
          datasets: [
            {
              label: "Nombre de clients",
              data: values,
              backgroundColor: "#42a5f5",
            },
          ],
        });
      })
      .catch((err) => console.error("Erreur:", err));

    fetch("http://localhost:5000/api/stats/risques")
  .then((res) => res.json())
  .then((data) => {
    const risks = data.details || {};
    console.log("Risques reçus depuis l'API :", risks); // debug ici

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


  }, [statut]);

  const pieData = {
    labels: ["Active", "Inactive", "Pending"],
    datasets: [
      {
        label: "Client Status",
        data: [400, 300, 300],
        backgroundColor: ["#0088FE", "#00C49F", "#FFBB28"],
        hoverOffset: 4,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}`,
        },
      },
    },
    animation: { animateRotate: true, animateScale: true },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Répartition des clients par secteur",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
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

  const handleClientDetails = (clientId) => {
    console.log("Client ID:", clientId);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <ComplexStatisticsCard color="error" icon="people" title="Nombre de clients gérés" count={clientCount} />
          </Grid>
          <Grid item xs={12} sm={2.4} md={4}>
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

        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" mb={2}>Statut des Clients</Typography>
                  <Pie data={pieData} options={pieOptions} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" mb={2}>Répartition des clients par secteur</Typography>
                  <Bar data={barChartData} options={barOptions} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Calendar onChange={setCalendarDate} value={calendarDate} className="react-calendar custom-calendar" />
            </Grid>
          </Grid>
        </MDBox>

        <Grid item xs={12} md={6} lg={4} sx={{ mt: 3 }}>
          <MDButton variant="contained" color="primary" fullWidth onClick={() => window.open("https://chat.google.com", "_blank")}>
            Accéder à Google Chat
          </MDButton>
        </Grid>

        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <DragDropContext onDragEnd={onDragEnd}>
                <Grid container spacing={2}>
                  {Object.entries(kanbanTasks).map(([columnId, columnTasks]) => {
                    const columnTitles = {
                      idea: { title: "Idées", color: "#1976d2" },
                      started: { title: "En cours", color: "#f9a825" },
                      finished: { title: "Terminées", color: "#2e7d32" },
                    };
                    const { title, color } = columnTitles[columnId] || { title: columnId, color: "#ccc" };

                    return (
                      <Grid item xs={12} md={4} key={columnId}>
                        <Paper
                          elevation={4}
                          sx={{
                            borderRadius: 2,
                            backgroundColor: "#fafafa",
                            p: 2,
                            minHeight: 400,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Typography
                            variant="h6"
                            align="center"
                            gutterBottom
                            sx={{
                              backgroundColor: color,
                              color: "#fff",
                              borderRadius: 1,
                              py: 1,
                              mb: 2,
                            }}
                          >
                            {title} ({columnTasks.length})
                          </Typography>

                          {columnId === "idea" && (
                            <MDBox mb={2}>
                              <TextField
                                label="Nouvelle tâche"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                fullWidth
                                variant="outlined"
                                sx={{ mb: 1 }}
                              />
                              <Button
                                variant="contained"
                                color="white"
                                onClick={handleAddKanbanTask}
                                startIcon={<AddIcon />}
                                fullWidth
                              >
                                Ajouter Tâche
                              </Button>
                            </MDBox>
                          )}

                          <Droppable droppableId={columnId}>
                            {(provided) => (
                              <div {...provided.droppableProps} ref={provided.innerRef} style={{ flexGrow: 1 }}>
                                {columnTasks.map((task, index) => (
                                  <Draggable key={task.id} draggableId={task.id} index={index}>
                                    {(provided) => (
                                      <Card
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        sx={{
                                          mb: 2,
                                          boxShadow: 3,
                                          borderRadius: 2,
                                          backgroundColor: "#fff",
                                        }}
                                      >
                                        <CardContent
                                          sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            p: 2,
                                          }}
                                        >
                                          <Typography sx={{ wordBreak: "break-word", flexGrow: 1 }}>
                                            {task.content}
                                          </Typography>
                                          <IconButton color="error" onClick={() => onDeleteTask(columnId, task.id)}>
                                            <DeleteIcon />
                                          </IconButton>
                                        </CardContent>
                                      </Card>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>
              </DragDropContext>
            </Grid>
          </Grid>
        </MDBox>
    <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h5">Liste des Clients</Typography>
                  <TableContainer component={Paper}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">Nom</TableCell>
                          <TableCell align="center">Email</TableCell>
                          <TableCell align="center">Statut</TableCell>
                          <TableCell align="center">Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {clients.map((client) => (
                          <TableRow key={client._id}>
                            <TableCell align="center">{client.Nom}</TableCell>
                            <TableCell align="center">{client.Mail}</TableCell>
                            <TableCell align="center">{client.Statut ? "Actif" : "Inactif"}</TableCell>
                            <TableCell align="center">
                              <MDButton variant="contained" onClick={() => handleClientDetails(client._id)}>
                                Détails
                              </MDButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
export default Dashboard;
