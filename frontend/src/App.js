import {
  Grid,
  Paper,
  Divider,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  Fab,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import React, { useState, useEffect } from "react";
import "./App.css";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const App = () => {
  const socket = io.connect("http://localhost:5000/");

  const [message, setMessage] = useState("");
  const [isMyMessage, setIsMyMessage] = useState(false);
  const [chat, setChat] = useState([]);
  const [user, setUser] = useState(localStorage.getItem("currentUser") || "");

  const emitSocket = () => {
    const payloadParam = {
      message,
      userName: user,
      datetime: Date.now().toString,
      isMyMessage: isMyMessage,
    };
    socket.emit("chat", payloadParam);
  };

  const sendChat = (e) => {
    e.preventDefault();
    setIsMyMessage(true);
    emitSocket();
    setMessage("");
  };

  useEffect(() => {
    socket.on("chat", (payload) => {
      setChat([...chat, payload]);
    });
  });

  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(uuidv4()));
  }, []);

  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5" className="header-message">
            Chat
          </Typography>
        </Grid>
      </Grid>
      <Grid container component={Paper}>
        <Grid item xs={12}>
          <List>
            {chat?.map((payload, index) => (
              <ListItem key={index}>
                <Grid container>
                  <Grid item xs={12}>
                    <ListItemText
                      align={payload.userName === user ? "right" : "left"}
                      primary={payload.message}
                    ></ListItemText>
                  </Grid>
                  <Grid item xs={12}>
                    <ListItemText
                      align={payload.userName === user ? "right" : "left"}
                      secondary={`${payload.userName || "ABC"} ${
                        payload.datetime || "12:00"
                      }`}
                    ></ListItemText>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
          <Divider />
          <Grid
            container
            style={{
              position: "fixed",
              bottom: 0,
              width: "100%",
              height: 60,
              textAlign: "center",
            }}
          >
            <Grid item xs={11}>
              <TextField
                id="outlined-basic-email"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                label="Type Something"
                fullWidth
              />
            </Grid>
            <Grid xs={1} align="right">
              <Fab
                color="primary"
                aria-label="add"
                onClick={(e) => {
                  setIsMyMessage(true);
                  sendChat(e);
                }}
              >
                <SendIcon />
              </Fab>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default App;
