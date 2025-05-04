import { useState } from "react";

export const useKanbanData = () => {
  const [taskText, setTaskText] = useState("");
  const [tasks, setTasks] = useState({
    todo: [{ text: "Tâche 1", completed: false }],
    inProgress: [{ text: "Tâche 2", completed: false }],
    done: [{ text: "Tâche 3", completed: false }],
  });

  // Ajouter une tâche dans la liste "To Do"
  const handleAddTask = () => {
    if (taskText.trim()) {
      setTasks({
        ...tasks,
        todo: [...tasks.todo, { text: taskText, completed: false }],
      });
      setTaskText(""); // Réinitialiser le champ de texte
    }
  };

  // Basculer l'état "complété" d'une tâche
  const handleToggleTask = (listId, index) => {
    const newTasks = { ...tasks };
    newTasks[listId][index].completed = !newTasks[listId][index].completed;
    setTasks(newTasks);
  };

  // Supprimer une tâche
  const handleDeleteTask = (listId, index) => {
    const newTasks = { ...tasks };
    newTasks[listId].splice(index, 1);
    setTasks(newTasks);
  };

  // Gérer le déplacement des tâches entre les listes avec Drag and Drop
  const handleOnDragEnd = (result) => {
    const { source, destination } = result;

    // Si la tâche n'a pas été déplacée (destination non définie ou source et destination identiques)
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceList = [...tasks[source.droppableId]];
    const destinationList = [...tasks[destination.droppableId]];

    // Retirer la tâche de la liste source et l'ajouter à la liste destination
    const [movedTask] = sourceList.splice(source.index, 1);
    destinationList.splice(destination.index, 0, movedTask);

    setTasks({
      ...tasks,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destinationList,
    });
  };

  return {
    taskText,
    setTaskText,
    tasks,
    handleAddTask,
    handleToggleTask,
    handleDeleteTask,
    handleOnDragEnd,
  };
};

export default useKanbanData;
