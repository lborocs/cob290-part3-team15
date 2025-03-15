require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {cors: {origin: [process.env.IP || "http://localhost:5173"]}});
const port = process.env.PORT || 8080;

//Cross Origin Error Prevention
const corsOptions = {
    origin: [process.env.IP || "http://localhost:5173"],
};
app.use(cors(corsOptions));

//Import Routes 
const chat = require("./routes/chat");

//Use Routes E.g. localhost:8080/chat/???
app.use("/chat", chat);


//I had to do this, this is the escape error now.
app.get("/getTeapot", (req,res) => {
    res.status(418).send("I'm a teapot");
})

app.post("/postTeapot", (req,res) => {
    res.status(418).send("I'm a teapot");
})

io.on('connection', (socket) => {
    console.log('a user connected');
});

server.listen(port, "0.0.0.0", () => {
    console.log(`Example app listening on port ${port}`);
});