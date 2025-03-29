const express = require("express");
const router = express.Router();
const database = require("../config/database");
const { io,connectedClients,alertMessage } = require('../exports/socket');
const {authenticateToken} = require("../exports/authenticate");

router.use(express.json()) // for parsing 'application/json'

router.get("/getMessages",authenticateToken,(req,res) => {
    const query=`SELECT direct_messages.messageID as messageID,CONCAT(users.Forename,users.Surname) as name,direct_messages.Content as content,direct_messages.Sender as user, direct_messages.Timestamp as timestamp
                 FROM direct_messages 
                 LEFT JOIN users ON direct_messages.Sender=users.UserID 
                 WHERE (Sender=? AND Recipient=?) OR (Sender=? AND Recipient=?)
                 ORDER BY direct_messages.Timestamp ASC`;
    const id = req.user.userID;
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

router.get("/getMessagesAfter",authenticateToken,(req,res) => {
    const query=`SELECT direct_messages.messageID as messageID,CONCAT(users.Forename,users.Surname) as name,direct_messages.Content as content,direct_messages.Sender as user, direct_messages.Timestamp as timestamp
                 FROM direct_messages 
                 LEFT JOIN users ON direct_messages.Sender=users.UserID 
                 WHERE ((Sender=? AND Recipient=?) OR (Sender=? AND Recipient=?)) AND direct_messages.Timestamp>?
                 ORDER BY direct_messages.Timestamp DESC`;
    const id = req.user.userID;
    const target = req.query.target;
    const timestamp= req.query.after;

    //Stop bad inputs
    if (isNaN(id) || isNaN(target)) {
        return res.status(400).json({ error: "Invalid input" });
    }

    const values = [id,target,target,id,timestamp];
    database.query(query, values, (err, results) => {
        res.send({results: results});
    });
});

router.post("/sendMessage",authenticateToken,(req,res) => {
    const query = "INSERT INTO direct_messages (Sender,Recipient,Content) VALUES (?,?,?)";
    const id = req.user.userID;
    const target = req.body.target;
    const text = req.body.text;

    //Stop bad inputs
    if (isNaN(id) || isNaN(target)) {
        return res.status(400).json({ error: "Invalid input" });
    }

    const values = [id,target,text];
    database.query(query, values, err =>{
        if (!err) {
            //Update the active chat list
            const activeChatQuery = "INSERT INTO active_chats (UserID, Target, Type) VALUES (?, ?, 'direct_messages') ON DUPLICATE KEY UPDATE LastUpdate = NOW();";
            const activeChat1 = [id, target];
            const activeChat2 = [target, id];
            database.query(activeChatQuery, activeChat1, () => {});
            database.query(activeChatQuery, activeChat2, () => {});

            const targetUser = String(req.body.target);
            alertMessage(targetUser);
            alertMessage(id); //Might as well do it here so all clients refresh
            res.status(200).json({ success: "Message sent successfully" });
        }
        else res.status(500).json({ error: "Server rejected message" });
    });
    
});

router.put("/updateMessage",authenticateToken,(req,res) => {
    const query="UPDATE direct_messages SET Content=? WHERE MessageID=? AND Sender=?";
    const id = req.user.userID;
    const messageID= req.body.id;
    const content = req.body.content;

    //Stop bad inputs as above
    if (isNaN(id) || isNaN(messageID)) {
        return res.status(400).json({ error: "Invalid ID" });
    }
    if (!content || content.trim() === "") {
        return res.status(400).json({ error: "Content cannot be empty" });
    }

    const values = [content,messageID,id];
    database.query(query, values, err => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Failed to update message" });
        }
        res.status(200).json({ success: true, message: "Message updated successfully" });
    });
});

module.exports = router;