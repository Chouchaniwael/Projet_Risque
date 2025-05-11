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
  TableRow
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Bar } from "react-chartjs-2";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import PeopleIcon from "@mui/icons-material/People";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, CategoryScale, LinearScale, BarElement } from "chart.js";
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
  const [kanbanTasks, setKanbanTasks] = useState({
    idea: [{ id: "1", content: "Task 1" }, { id: "2", content: "Task 2" }],
    started: [{ id: "3", content: "Task 3" }],
    finished: [{ id: "4", content: "Task 4" }],
  });
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/clients/countclient")
      .then((res) => res.json())
      .then((data) => setClientCount(data.clientCount))
      .catch((err) => console.error("Erreur:", err));

    fetch(`http://localhost:5000/api/clients?statut=${statut}`)
      .then((res) => res.json())
      .then((data) => setClients(data))
      .catch((err) => console.error("Erreur:", err));
  }, [statut]);

  const pieData = {
    labels: ["Active", "Inactive", "Pending"],
    datasets: [{
      label: "Client Status",
      data: [400, 300, 300],
      backgroundColor: ["#0088FE", "#00C49F", "#FFBB28"],
      hoverOffset: 4,
    }],
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

  // Bar Chart data and options
  const barData = {
    labels: ["Santé", "Finance", "Éducation", "Industrie", "Technologie"],
    datasets: [
      {
        label: "Nombre de clients",
        data: [12, 19, 8, 15, 10], // Example values, replace with actual data if needed
        backgroundColor: "#42a5f5",
      },
    ],
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
        {/* Statistiques */}
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <ComplexStatisticsCard
              color="error"
              icon="people"
              title="Nombre de clients gérés"
            />
          </Grid>
          <Grid item xs={12} sm={2.4} md={4}>
            <ComplexStatisticsCard
              color="warning"
              icon="priority_high"
              title="Risques extreme"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ComplexStatisticsCard
              color="info"
              icon="signal_cellular_4_bar"
              title="Risques fort"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ComplexStatisticsCard
              color="success"
              icon="check_circle"
              title="Risques moyen"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ComplexStatisticsCard
              color="secondary"
              icon="check_circle_outline"
              title="Risques faible"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ComplexStatisticsCard
              color="secondary"
              icon="check_circle_outline"
              title="Risques accepté"
            />
          </Grid>
        </Grid>

        {/* Graphiques, calendrier, chat */}
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
                  <Bar data={barData} options={barOptions} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Calendar onChange={setCalendarDate} value={calendarDate} className="react-calendar custom-calendar" />
            </Grid>
          </Grid>
        </MDBox>

        {/* BarChart - Clients par secteur */}
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            
          </Grid>
        </MDBox>
           <Grid item xs={12} md={6} lg={4}>
              <MDButton
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => window.open("https://chat.google.com", "_blank")}
              >
                Accéder à Google Chat
              </MDButton>
            </Grid>

        {/* Kanban */}
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

                          {/* Ajouter la tâche ici uniquement dans la colonne "idea" */}
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
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={{ flexGrow: 1 }}
                              >
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
                                          <IconButton
                                            color="error"
                                            onClick={() => onDeleteTask(columnId, task.id)}
                                          >
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

        {/* Liste des clients */}
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
