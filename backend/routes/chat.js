const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const database = require("../config/database");

router.use(bodyParser.json()) // for parsing 'application/json'

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

router.get("/getDirectMessages",(req,res) => {
    const query="SELECT direct_messages.messageID as messageID,CONCAT(users.Forename,users.Surname) as name,direct_messages.Content as content,direct_messages.Sender as user FROM direct_messages LEFT JOIN users ON direct_messages.Sender=users.UserID WHERE (Sender=? AND Recipient=?) OR (Sender=? AND Recipient=?)";
    const id = req.query.id;
    const target = req.query.target;

    //Stop bad inputs
    if (isNaN(id) || isNaN(target)) {
        return res.status(400).json({ error: "Invalid input" });
    }

    const values = [id,target,target,id];
    database.query(query, values, (err, results) => {
        res.send({results: results});
    });
});

router.post("/sendDirectMessage", (req,res) => {
    const query = "INSERT INTO direct_messages (Sender,Recipient,Content) VALUES (?,?,?)";
    const id = req.body.id;
    const target = req.body.target;
    const text = req.body.text;

    //Stop bad inputs
    if (isNaN(id) || isNaN(target)) {
        return res.status(400).json({ error: "Invalid input" });
    }

    const values = [id,target,text];
    database.query(query, values, (err, results) =>{
        if (!err) res.send({success: true});
        else res.send({success: false});
    });
});

module.exports = router;