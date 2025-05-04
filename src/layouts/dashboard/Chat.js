import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Box, TextField, Button, Typography, List, ListItem, ListItemText } from "@mui/material";

const socket = io("http://localhost:5000"); // Connect to the WebSocket server

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Listen for incoming messages
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("receiveMessage"); // Clean up the listener
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", message); // Send the message to the server
      setMessage("");
    }
  };

  return (
    <Box sx={{ p: 2, border: "1px solid #ccc", borderRadius: "8px", maxWidth: "400px", margin: "auto" }}>
      <Typography variant="h6" gutterBottom>
        Chat Instantané
      </Typography>
      <List sx={{ maxHeight: "200px", overflowY: "auto", mb: 2 }}>
        {messages.map((msg, index) => (
          <ListItem key={index}>
            <ListItemText primary={msg} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Écrivez un message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSendMessage}>
          Envoyer
        </Button>
      </Box>
    </Box>
  );
}

export default Chat;