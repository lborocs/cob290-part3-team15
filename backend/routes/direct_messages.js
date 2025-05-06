const express = require("express");
const router = express.Router();
const database = require("../config/database");
const { io,connectedClients,alertMessage,alertEdit} = require('../exports/socket');
const {authenticateToken} = require("../exports/authenticate");

router.use(express.json()) // for parsing 'application/json'

router.get("/getMessages",authenticateToken,(req,res) => {
    const query=`SELECT direct_messages.messageID as messageID,CONCAT(users.Forename,users.Surname) as name,direct_messages.Content as content,direct_messages.Sender as user, direct_messages.Timestamp as timestamp, isEdited as isEdited
                 FROM direct_messages 
                 LEFT JOIN users ON direct_messages.Sender=users.UserID 
                 WHERE ((Sender=? AND Recipient=?) OR (Sender=? AND Recipient=?)) AND isDeleted=0
                 ORDER BY direct_messages.Timestamp ASC`;
    const id = req.user.userID;
    const target = req.query.target;

    //Stop bad inputs
    if (isNaN(id) || isNaN(target)) {
        return res.status(400).json({ error: "Invalid input" });
    }

    const values = [id,target,target,id];
    database.query(query, values, (err, results) => {
        if(err){
            return res.status(500).json({error: "Failed to send message"})
        }
        const updateReadQuery = `UPDATE active_chats 
                                SET LastRead = NOW() 
                                WHERE UserID = ? AND Target = ?;`
        const updateReadyValues=[id,target]
        database.query(updateReadQuery, updateReadyValues, (err, results) => {
            if(err){
                return res.status(500).json({error: "Failed to update read status"})
            }
        });
        res.send({results: results});
    });
});

router.get("/getMessagesAfter",authenticateToken,(req,res) => {
    const query=`SELECT direct_messages.messageID as messageID,CONCAT(users.Forename,users.Surname) as name,direct_messages.Content as content,direct_messages.Sender as user, direct_messages.Timestamp as timestamp, isEdited as isEdited
                 FROM direct_messages 
                 LEFT JOIN users ON direct_messages.Sender=users.UserID 
                 WHERE (((Sender=? AND Recipient=?) OR (Sender=? AND Recipient=?)) AND direct_messages.Timestamp>CONVERT_TZ(?, '+00:00', @@session.time_zone)) AND isDeleted=0
                 ORDER BY direct_messages.Timestamp ASC`;
    const id = req.user.userID;
    const target = req.query.target;
    const timestamp= req.query.after;

    //Stop bad inputs
    if (isNaN(id) || isNaN(target)) {
        return res.status(400).json({ error: "Invalid input" });
    }


    const values = [id,target,target,id,timestamp];
    database.query(query, values, (err, results) => {
        if(err){
            return res.status(500).json({error: "Failed to send message"})
        }
        const updateReadQuery = `UPDATE active_chats 
                                SET LastRead = NOW() 
                                WHERE UserID = ? AND Target = ?;`
        const updateReadyValues=[id,target]
        database.query(updateReadQuery, updateReadyValues, (err, results) => {
            if(err){
                return res.status(500).json({error: "Failed to update read status"})
            }
        });
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
            const activeChatQuery = "INSERT INTO active_chats (UserID, Target) VALUES (?, ?) ON DUPLICATE KEY UPDATE LastUpdate = NOW();";
            const activeChat1 = [id, target];
            const activeChat2 = [target, id];
            database.query(activeChatQuery, activeChat1, () => {});
            database.query(activeChatQuery, activeChat2, () => {});

        
            alertMessage(target,id,text,'direct_messages',true);
            alertMessage(id,target,text,'direct_messages',true);
            res.status(200).json({ success: "Message sent successfully" });
        }
        else res.status(500).json({ error: "Server rejected message" });
    });
    
});

router.put("/updateMessage",authenticateToken,(req,res) => {
    const query="UPDATE direct_messages SET Content=?, isEdited = 1 WHERE MessageID=? AND Sender=?";
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
            return res.status(500).json({ error: "Failed to update message" });
        }
        //Get Target user ID
        const getTargetQuery = "SELECT Recipient FROM direct_messages WHERE MessageID=? AND Sender=?";
        database.query(getTargetQuery, [messageID,id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Failed to retrieve target user" });
            }
            const targetID = results[0].Recipient;
            alertEdit(targetID,id,messageID,"direct_messages",content);
            alertEdit(id,targetID,messageID,"direct_messages",content);
            return res.status(200).json({ success: true, message: "Message updated successfully" });
        });
    });
});

router.put("/hideMessage",authenticateToken,(req,res) => {
    const query="UPDATE direct_messages SET isDeleted=1 WHERE MessageID=? AND Sender=?";
    const id = req.user.userID;
    const messageID= req.body.id;

    //Stop bad inputs
    if (isNaN(id) || isNaN(messageID)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    const values = [messageID,id];
    database.query(query, values, err => {
        if (err) {
            return res.status(500).json({ error: "Failed to hide message" });
        }
        //Get Target user ID
        const getTargetQuery = "SELECT Recipient FROM direct_messages WHERE MessageID=? AND Sender=?";
        database.query(getTargetQuery, [messageID,id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Failed to retrieve target user" });
            }
            const targetID = results[0].Recipient;
            alertMessage(targetID,id,"Message deleted","direct_messages");
            alertMessage(id,targetID,"Message deleted","direct_messages");
            alertEdit(id,targetID,messageID,"direct_messages","Message deleted");
            return res.status(200).json({ success: true, message: "Message hidden successfully" });
        });
    });
});

module.exports = router;