require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const server = require('http').createServer(app);
const { setIo, addUser, removeUser } = require('./exports/socket');
const jwt = require('jsonwebtoken');
const io = require('socket.io')(server, {cors: {origin: [process.env.IP || "http://localhost:5173"]}});
setIo(io);
const port = process.env.PORT || 8080;

// Label the Clients so appropriate clients get told there's an update
const connectedClients = {};

//Cross Origin Error Prevention
const corsOptions = {
    origin: [process.env.IP || "http://localhost:5173"],
};
app.use(cors(corsOptions));

//Import Routes 
const chat = require("./routes/chat");
const direct_messages = require("./routes/direct_messages");

//Use Routes E.g. localhost:8080/chat/???
app.use("/chat", chat);
app.use('/chat/direct_messages', direct_messages);

//I had to do this, this is the escape error now.
app.get("/getTeapot", (req,res) => {
    res.status(418).send("I'm a teapot");
})

app.post("/postTeapot", (req,res) => {
    res.status(418).send("I'm a teapot");
})

io.on('connection', (socket) => {
    console.log('a user connected');
    
    // Listen for when a user sets their user ID (you should send this from the frontend on connection)
    socket.on('setUserId', (userId) => {
        addUser(userId, socket.id);
        console.log(`User with ID ${userId} connected with socket ID ${socket.id}`);
    });

    // Clean up when the user disconnects
    socket.on('disconnect', () => {
        removeUser(socket.id);
        console.log(`A user disconnected`);
    });
});

  

server.listen(port, "0.0.0.0", () => {
    console.log(`Example app listening on port ${port}`);
});