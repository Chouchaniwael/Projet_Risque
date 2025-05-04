import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Card, CardContent,
  Typography, Button, TextField, IconButton, Checkbox, List, ListItem, ListItemText
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import MDBox from "components/MDBox";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import MDButton from "components/MDButton";

import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import { sales, chartTasks } from "layouts/dashboard/data/reportsLineChartData";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import Chat from "./Chat"; // Import the Chat component

ChartJS.register(ArcElement, Tooltip, Legend, Title);

function Dashboard() {
  const [clientCount, setClientCount] = useState(0);
  const [clients, setClients] = useState([]);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const statut = true;

  const [taskText, setTaskText] = useState("");
  const [tasks, setTasks] = useState([]);

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
    labels: ['Active', 'Inactive', 'Pending'],
    datasets: [{
      label: 'Client Status',
      data: [400, 300, 300],
      backgroundColor: ['#0088FE', '#00C49F', '#FFBB28'],
      hoverOffset: 4,
    }],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.label}: ${tooltipItem.raw}`,
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };

  const handleAddTask = () => {
    if (taskText.trim()) {
      setTasks([...tasks, { text: taskText, completed: false }]);
      setTaskText("");
    }
  };

  const handleToggleTask = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  const handleDeleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const handleClientDetails = (clientId) => {
    // Détails client
  };

  const [kanbanTasks, setKanbanTasks] = useState({
    idea: [
      { id: "1", content: "Task 1" },
      { id: "2", content: "Task 2" },
    ],
    started: [
      { id: "3", content: "Task 3" },
    ],
    finished: [
      { id: "4", content: "Task 4" },
    ],
  });

  const [newTask, setNewTask] = useState("");

  const handleAddKanbanTask = () => {
    if (newTask.trim()) {
      setKanbanTasks((prevTasks) => ({
        ...prevTasks,
        idea: [...prevTasks.idea, { id: Date.now().toString(), content: newTask }],
      }));
      setNewTask("");
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceColumn = kanbanTasks[source.droppableId];
    const destColumn = kanbanTasks[destination.droppableId];
    const [removed] = sourceColumn.splice(source.index, 1);
    destColumn.splice(destination.index, 0, removed);

    setKanbanTasks({
      ...kanbanTasks,
      [source.droppableId]: sourceColumn,
      [destination.droppableId]: destColumn,
    });
  };

  const onDeleteTask = (columnId, taskId) => {
    setKanbanTasks((prevTasks) => {
      const updatedColumn = prevTasks[columnId].filter((task) => task.id !== taskId);
      return {
        ...prevTasks,
        [columnId]: updatedColumn,
      };
    });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* Cartes */}
        <Grid container spacing={3}>
          {[...Array(4)].map((_, i) => (
            <Grid item xs={12} md={6} lg={3} key={i}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="dark"
                  icon="weekend"
                  title="Bookings"
                  count={281}
                  percentage={{ color: "success", amount: "+55%", label: "than last week" }}
                />
              </MDBox>
            </Grid>
          ))}
        </Grid>

        {/* Graphiques */}
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="website views"
                  description="Last Campaign Performance"
                  date="campaign sent 2 days ago"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="daily sales"
                  description="(+15%) increase in today's sales"
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="completed tasks"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={chartTasks}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>

        {/* Section Calendrier, Pie Chart, Google Chat */}
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <Calendar onChange={setCalendarDate} value={calendarDate} className="react-calendar custom-calendar" />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5">Statut des Clients</Typography>
                  <Pie data={pieData} options={pieOptions} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDButton variant="contained" color="primary" onClick={() => window.open("https://chat.google.com", "_blank")}>
                Accéder à Google Chat
              </MDButton>
            </Grid>
          </Grid>
        </MDBox>

        {/* To-do List */}
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <Card>
                <CardContent>
                  <Typography variant="h5">To-Do List</Typography>
                  <MDBox display="flex" mt={2}>
                    <TextField
                      label="Nouvelle tâche"
                      fullWidth
                      value={taskText}
                      onChange={(e) => setTaskText(e.target.value)}
                    />
                    <MDButton color="success" onClick={handleAddTask} sx={{ ml: 2 }}>
                      Ajouter
                    </MDButton>
                  </MDBox>
                  <List>
                    {tasks.map((task, index) => (
                      <ListItem
                        key={index}
                        secondaryAction={
                          <IconButton edge="end" onClick={() => handleDeleteTask(index)}>
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <Checkbox
                          checked={task.completed}
                          onChange={() => handleToggleTask(index)}
                        />
                        <ListItemText
                          primary={task.text}
                          style={{ textDecoration: task.completed ? "line-through" : "none" }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </MDBox>

        {/* Kanban Board */}
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Nouvelle tâche"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                fullWidth
                variant="outlined"
                style={{ marginBottom: "10px" }}
              />
              <Button variant="contained" color="primary" onClick={handleAddKanbanTask}>
                Ajouter Tâche
              </Button>
            </Grid>
            <Grid item xs={12}>
              <DragDropContext onDragEnd={onDragEnd}>
                <Grid container spacing={3}>
                  {Object.entries(kanbanTasks).map(([columnId, columnTasks]) => (
                    <Grid item xs={12} md={4} key={columnId}>
                      <Paper elevation={3}>
                        <Typography variant="h6" align="center" style={{ padding: "10px" }}>
                          {columnId.charAt(0).toUpperCase() + columnId.slice(1)}
                        </Typography>
                        <Droppable droppableId={columnId}>
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              style={{ minHeight: "200px", padding: "10px" }}
                            >
                              {columnTasks.map((task, index) => (
                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                  {(provided) => (
                                    <Card
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        marginBottom: "10px",
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      <CardContent style={{ display: "flex", justifyContent: "space-between" }}>
                                        <Typography>{task.content}</Typography>
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
                  ))}
                </Grid>
              </DragDropContext>
            </Grid>
          </Grid>
        </MDBox>

        {/* Chat Section */}
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Chat />
            </Grid>
          </Grid>
        </MDBox>

        {/* Liste des Clients */}
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
                              <Button variant="contained" color="primary" onClick={() => handleClientDetails(client._id)}>
                                Détails
                              </Button>
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
