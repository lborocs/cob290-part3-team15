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
                 WHEN active_chats.Type = 'direct_messages' THEN CONCAT('DM: ',users.Forename, ' ', users.Surname)
                 WHEN active_chats.Type = 'group_messages' THEN CONCAT('G: ',groups.Name)
                 ELSE NULL END AS name, active_chats.Target as target,active_chats.Type as type
                 FROM active_chats
                 LEFT JOIN users ON users.UserID = active_chats.Target AND active_chats.Type = 'direct_messages'
                 LEFT JOIN groups ON groups.GroupID=active_chats.Target AND active_chats.Type = 'group_messages'
                 WHERE active_chats.UserID=? ORDER BY LastUpdate DESC`;
    const id = req.user.userID;

    //Stop bad ID's 
    if (isNaN(id)) {
        return res.status(400).json({ error: "Error with login instance, please log back in!" });
    }

    const values = [id];
    database.query(query, values, (err, results) => {
        res.send({results: results});
    });
});

router.delete("/removeChat",authenticateToken,(req,res) => {
    var query ="";
    const id = req.user.userID;
    const target = req.body.target;
    const type = req.body.type;
    //Stop bad ID's 
    if (isNaN(id)) {
        return res.status(400).json({ error: "Error with login instance, please log back in!" });
    }

    var values = [id,target,type];
    switch (type) {
        
        case "direct_messages":{
            query=`DELETE FROM active_chats WHERE UserID = ? AND Target = ? AND Type = ?;`;
            database.query(query, values, (err, results) => {
                if (!err) {
                    res.status(200).json({ success: "Person removed from active chats!" });
                } else {
                    res.status(400).json({ error: "Error removing chat instance" });
                }
            });
            break;
        }
        case "group_messages":{
            //Filler
            query=`SELECT UserID from users WHERE UserID=?`;
            values=[id]
            database.query(query, values, (err, results) => {
                if (!err) {
                    res.status(200).json({ success: "Succesfully Left Group" });
                } else {
                    res.status(400).json({ error: "Error leaving group" });
                }
            });
        }
        default:{
            res.status(400).json({ error: "Invalid request type!" });
            break;
        }
    }

});



module.exports = router;