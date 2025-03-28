const express = require("express");
const router = express.Router();
const database = require("../config/database");
const { io,connectedClients,alertMessage } = require('../socket');

router.use(express.json()) // for parsing 'application/json'

router.get("/getMessage",(req,res) => {
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

router.put("/updateMessage",(req,res) => {
    const query="UPDATE direct_messages SET Content=? WHERE MessageID=?";
    const id = req.body.id;
    const content = req.body.content;

    //Stop bad inputs as above
    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }
    if (!content || content.trim() === "") {
        return res.status(400).json({ error: "Content cannot be empty" });
    }

    const values = [content,id];
    database.query(query, values, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to update message" });
        }
        if (results.affectedRows === 0) { // If no rows were affected, then the message was not found, so not successful
            return res.status(404).json({ error: "Message not found" });
        }
        res.status(200).json({ success: true, message: "Message updated successfully" });
    });
});

module.exports = router;