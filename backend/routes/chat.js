const express = require("express");
const router = express.Router();
const database = require("../config/database");
const { io,connectedClients,alertMessage } = require('../exports/socket');
const {authenticateToken} = require("../exports/authenticate");

router.use(express.json()) // for parsing 'application/json'

router.get("/getMessage",authenticateToken,(req,res) => {
    const query="SELECT Sender,Recipient,Content FROM direct_messages WHERE MessageID=?";
    const id = req.query.id;

    //Stop bad inputs
    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    const values = [id];
    database.query(query, values, (err, results) => {
        res.send({results: results});
    });
});

router.get("/getChats",authenticateToken,(req,res) => {
    const query=`SELECT CASE 
                 WHEN active_chats.Type = 'direct_messages' THEN CONCAT(users.Forename, ' ', users.Surname)
                 WHEN active_chats.Type = 'group_messages' THEN 'GROUPS NOT IMPLEMENTED'
                 ELSE NULL END AS name, active_chats.Target as target,active_chats.Type as type
                 FROM active_chats 
                 LEFT JOIN users ON users.UserID = active_chats.Target AND active_chats.Type = 'direct_messages' 
                 WHERE active_chats.UserID=? ORDER BY LastUpdate DESC`;
    const id = req.user.userID;

    //Stop bad inputs
    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    const values = [id];
    database.query(query, values, (err, results) => {
        res.send({results: results});
    });
});


module.exports = router;