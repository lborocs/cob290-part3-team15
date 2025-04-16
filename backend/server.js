require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const server = require('http').createServer(app);
//Custom Exports
const { authenticateSocket } = require("./exports/authenticate");
const { setIo, addUser, removeUser,getConnectedCount} = require('./exports/socket');
const { setStatus} = require('./exports/status');
//IO Definition
const io = require('socket.io')(server, {cors: {origin: [process.env.IP || "http://localhost:5173"]}});
setIo(io);
io.use(authenticateSocket);

const port = process.env.PORT || 8080;


//Connected Client Storage
const connectedClients = {};

//Cross Origin Error Prevention
const corsOptions = {
    origin: [process.env.IP || "http://localhost:5173"],
};
app.use(cors(corsOptions));

//Import Routes 
const chat = require("./routes/chat");
const direct_messages = require("./routes/direct_messages");
const group_messages = require("./routes/group_messages");
const analytics = require("./routes/analytics")

//Use Routes E.g. localhost:8080/chat/???
app.use('/chat', chat);
app.use('/chat/direct_messages', direct_messages);
app.use('/chat/group_messages', group_messages);
app.use('/analytics', analytics)

//I had to do this, this is the escape error now.
app.get("/getTeapot", (req,res) => {
    res.status(418).send("I'm a teapot");
})

app.post("/postTeapot", (req,res) => {
    res.status(418).send("I'm a teapot");
})

io.on('connection', (socket) => {
    // Listen for when a user sets their user ID (you should send this from the frontend on connection)
    const userId = socket.user.userID;
    addUser(userId, socket.id);

    // Clean up when the user disconnects
    socket.on('disconnect', async() => {
        removeUser(socket.id);
        if(getConnectedCount(userId)===0){
            await setStatus(userId,"Offline",false);
        }
    });

    socket.on('requestStatus', async() => {
        try {
            await setStatus(userId,"Online",true);
        } catch (err) {
            console.error(err);
        }
    });
});

server.listen(port, "0.0.0.0", () => {
    console.log(`Example app listening on port ${port}`);
});