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
  const [chat, setChat] = useState([]);
  const [user, setUser] = useState(localStorage.getItem("currentUser") || "");
  const [isError, setIsError] = useState(false);

  const emitSocket = () => {
    const userName = localStorage.getItem("userName");
    const payloadParam = {
      message,
      userID: user,
      userName: localStorage.getItem("currentUser") !== user ? userName : "YOU",
      datetime: new Date().toLocaleTimeString(),
    };
    socket.emit("chat", payloadParam);
  };

  const sendChat = (e) => {
    e.preventDefault();
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
    localStorage.setItem("userName", JSON.stringify("ABC"));
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
              <ListItem
                key={index}
                sx={{
                  backgroundColor: "#e2f2f9",
                  width: "70%",
                  borderRadius: "10px",
                  marginRight: payload.userID === user ? null : "auto",
                  marginLeft: payload.userID === user ? "auto" : null,
                  marginBottom: "5px",
                }}
              >
                <Grid
                  container
                  alignItems={payload.userID === user ? "right" : "left"}
                >
                  <Grid item xs={12}>
                    <ListItemText
                      align={payload.userID === user ? "right" : "left"}
                      primary={payload.message}
                    ></ListItemText>
                  </Grid>
                  <Grid item xs={12}>
                    <ListItemText
                      align={payload.userID === user ? "right" : "left"}
                      secondary={`${
                        payload.userID === user
                          ? "You"
                          : JSON.parse(payload.userName)
                      } ${payload.datetime || "12:00"}`}
                    ></ListItemText>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
          <Divider />
          <form
            onSubmit={(e) => {
              if (!isError) {
                sendChat(e);
              }
            }}
          >
            <Grid
              container
              style={{
                position: "fixed",
                bottom: 0,
                width: "100%",
                height: 60,
                textAlign: "center",
                backgroundColor: "#FFFFFF",
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
                  required
                  onError={() => setIsError(true)}
                />
              </Grid>
              <Grid xs={1} align="right">
                <Fab
                  color="primary"
                  disabled={isError}
                  aria-label="add"
                  type="submit"
                >
                  <SendIcon />
                </Fab>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </div>
  );
};

export default App;
