require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const server = require('http').createServer(app);
const { setIo, addUser, removeUser, selfStatusAlert,getConnectedCount,getUserId, otherStatusAlert} = require('./exports/socket');
const jwt = require('jsonwebtoken');
const io = require('socket.io')(server, {cors: {origin: [process.env.IP || "http://localhost:5173"]}});
setIo(io);
const port = process.env.PORT || 8080;
const database = require("./config/database");

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
const group_messages = require("./routes/group_messages");

//Use Routes E.g. localhost:8080/chat/???
app.use("/chat", chat);
app.use('/chat/direct_messages', direct_messages);
app.use('/chat/group_messages', group_messages);

//I had to do this, this is the escape error now.
app.get("/getTeapot", (req,res) => {
    res.status(418).send("I'm a teapot");
})

app.post("/postTeapot", (req,res) => {
    res.status(418).send("I'm a teapot");
})

io.on('connection', (socket) => {
    // Listen for when a user sets their user ID (you should send this from the frontend on connection)
    socket.on('setUserId', async(userId) => {
        addUser(userId, socket.id);
    });

    // Clean up when the user disconnects
    socket.on('disconnect', async() => {
        userId= getUserId(socket.id);
        removeUser(socket.id);
        if(getConnectedCount(userId)===0){
            // Update user status to 'Offline' in the database asynchronously
            await setStatus(userId,"Offline",false);
        }
    });

    socket.on('requestStatus', async(userId) => {
        try {
            await setStatus(userId,"Online",true);
        } catch (err) {
            console.error(err);
        }
    });
});

async function setStatus(userId,status,loginAttempt) {
    var query="SELECT Status FROM users WHERE UserID=? LIMIT 1;";
    const values = [userId];
    var currentStatus = null;
    database.query(query, values, (err, results) => {
        if (err) {
            console.error(err);
            return;
        }
        if (results.length === 0) {
            console.log("User not found");
            return;
        }
        currentStatus = results[0].Status;

        // Stop bad inputs
        if (!currentStatus) {
            console.log(`Status is ${currentStatus}`);
            return;
        }

        // Update the user's status in the database
        if (status==="Offline"){
            query = "UPDATE users SET Status='Offline' WHERE UserID=? AND Status NOT IN ('Invisible','Offline')";
        }
        else if (status==="Online"){
            query = "UPDATE users SET Status='Online' WHERE UserID=? AND Status NOT IN ('Invisible','Online')";
        }
        else if (status==="Invisible"){
            query = "UPDATE users SET Status='Invisible' WHERE UserID=? AND Status NOT IN ('Invisible')";
        }
        else {
            console.log("Invalid status update requested");
            return;
        }
        const substitutions = {"Online": "Online", "Offline": "Offline", "Invisible": "Offline"};
        database.query(query, values, (err, results) => {
            if (err) {
                console.error(err);
            } else {
                if(status==="Online"||status==="Invisible"){
                    if (loginAttempt && currentStatus==="Invisible"){
                        selfStatusAlert(userId,substitutions[currentStatus]);
                    }
                    else{
                        selfStatusAlert(userId,substitutions[status]);
                    }
                    
                }
                if((status==="Online"||status==="Offline"||status==="Invisible") && !(currentStatus===status)){
                    // Fetch users to alert (people who are in a chat with the user)
                    const usersToAlertQuery= "SELECT UserID FROM active_chats WHERE Target=? AND Type='direct_messages'";
                    var usersToAlert =[];
                    database.query(usersToAlertQuery, [userId], (err, results) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        usersToAlert = results.map(row => row.UserID);
                        otherStatusAlert(usersToAlert,substitutions[status]);
                    });
                    
                }
                console.log(`User ${userId} set to ${status}`);
            }
        });
    });
}

server.listen(port, "0.0.0.0", () => {
    console.log(`Example app listening on port ${port}`);
});