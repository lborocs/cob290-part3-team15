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
    const query="SELECT Target as target,Type as type FROM active_chats WHERE UserID=? ORDER BY LastUpdate DESC";
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