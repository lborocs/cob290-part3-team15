const express = require("express");
const router = express.Router();
const database = require("../config/database");
const {authenticateToken} = require("../exports/authenticate");
const { alertMessage } = require('../exports/socket');

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
    /*const query=`SELECT 
                CASE 
                    WHEN active_chats.Type = 'direct_messages' THEN CONCAT(users.Forename, ' ', users.Surname)
                    WHEN active_chats.Type = 'group_messages' THEN groups.Name
                    ELSE NULL 
                END AS name,
                active_chats.Target AS target,
                active_chats.Type AS type,
                users.status as status,
                active_chats.LastUpdate AS timestamp,
                CASE 
                    WHEN active_chats.Type = 'direct_messages' THEN dm.Content
                    WHEN active_chats.Type = 'group_messages' THEN gm.Content
                    ELSE NULL 
                END AS content
            FROM active_chats
            LEFT JOIN users 
                ON users.UserID = active_chats.Target 
                AND active_chats.Type = 'direct_messages'
            LEFT JOIN groups 
                ON groups.GroupID = active_chats.Target 
                AND active_chats.Type = 'group_messages'
            LEFT JOIN (
                SELECT 
                    dm.Content,
                    dm.Sender,
                    dm.Recipient,
                    dm.Timestamp,
                    ROW_NUMBER() OVER (PARTITION BY 
                        LEAST(dm.Sender, dm.Recipient), GREATEST(dm.Sender, dm.Recipient) 
                        ORDER BY dm.Timestamp DESC) AS rn
                FROM direct_messages dm
            ) AS dm 
                ON ((dm.Sender = active_chats.UserID AND dm.Recipient = active_chats.Target)
                    OR (dm.Recipient = active_chats.UserID AND dm.Sender = active_chats.Target))
                AND active_chats.Type = 'direct_messages'
                AND dm.rn = 1
            LEFT JOIN (
                SELECT 
                    gm.Content,
                    gm.GroupID,
                    gm.Timestamp,
                    ROW_NUMBER() OVER (PARTITION BY gm.GroupID ORDER BY gm.Timestamp DESC) AS rn
                FROM group_messages gm
            ) AS gm 
                ON gm.GroupID = active_chats.Target 
                AND active_chats.Type = 'group_messages'
                AND gm.rn = 1
            WHERE active_chats.UserID = ? ORDER BY active_chats.LastUpdate DESC`;*/


    const query=`SELECT 
                        CONCAT(users.Forename, ' ', users.Surname) AS name,
                        active_chats.Target AS target,
                        'direct_messages' AS type,
                        users.status AS status,
                        active_chats.LastUpdate AS timestamp,
                        dm.Content AS content
                    FROM active_chats
                    LEFT JOIN users 
                        ON users.UserID = active_chats.Target 
                    LEFT JOIN (
                        SELECT 
                            dm.Content,
                            dm.Sender,
                            dm.Recipient,
                            dm.Timestamp,
                            ROW_NUMBER() OVER (
                                PARTITION BY LEAST(dm.Sender, dm.Recipient), GREATEST(dm.Sender, dm.Recipient) 
                                ORDER BY dm.Timestamp DESC
                            ) AS rn
                        FROM direct_messages dm
                        WHERE dm.isDeleted=0
                    ) AS dm 
                        ON (
                            (dm.Sender = active_chats.UserID AND dm.Recipient = active_chats.Target) OR 
                            (dm.Recipient = active_chats.UserID AND dm.Sender = active_chats.Target)
                        )
                        AND dm.rn = 1
                    WHERE active_chats.UserID = ? 

                    UNION

                    SELECT 
                        g.Name AS name,
                        g.GroupID AS target,
                        'group_messages' AS type,
                        NULL AS status,
                        g.LastUpdate AS timestamp,
                        gm.Content AS content
                    FROM groups g
                    JOIN group_users gu ON gu.GroupID = g.GroupID
                    LEFT JOIN group_messages gm 
                        ON gm.GroupID = g.GroupID
                        AND gm.Timestamp = (
                            SELECT MAX(Timestamp)
                            FROM group_messages
                            WHERE GroupID = g.GroupID AND group_messages.isDeleted=0
                        )
                    WHERE gu.UserID = ?
                    ORDER BY timestamp DESC;`;
    const id = req.user.userID;

    //Stop bad ID's 
    if (isNaN(id)) {
        return res.status(400).json({ error: "Error with login instance, please log back in!" });
    }

    const values = [id,id];
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

    var values = [id,target];
    switch (type) {
        
        case "direct_messages":{
            query=`DELETE FROM active_chats WHERE UserID = ? AND Target = ?`;
            database.query(query, values, (err, results) => {
                if (!err) {
                    return res.status(200).json({ success: "Person removed from active chats!" });
                } else {
                    return res.status(400).json({ error: "Error removing chat instance" });
                }
            });
            break;
        }
        case "group_messages":{
            //Filler
            const groupSizeQuery=`SELECT COUNT(*) as count FROM group_users WHERE GroupID=?`;
            database.query(groupSizeQuery, [target], (err, results) => {
                if (err) {
                    return res.status(500).json({ error: "Error checking group size" });
                }
                const groupSize = results[0].count;
                if (groupSize <= 2) {
                    // If the group size is 2 or less, the result would be 1 or less, so delete the group
                    query=`DELETE FROM group_users WHERE GroupID=?`;
                    values=[target]
                }
                else{
                    query=`DELETE FROM group_users WHERE UserID=? AND GroupID=?`;
                }
                database.query(query, values, (err, results) => {
                    if (!err) {
                        return res.status(200).json({ success: "Succesfully Left Group" });
                    } else {
                        return res.status(400).json({ error: "Error leaving group" });
                    }
                });
            });
            break;
        }
        default:{
            return res.status(400).json({ error: "Invalid request type!" });
        }
    }

});

router.get("/getNewPeople",authenticateToken,(req,res) => {
    const id = req.user.userID;
    const filter = req.query.filter;
    const query=`SELECT users.UserID as id, CONCAT(Forename, ' ', Surname) as name
                FROM users
                LEFT JOIN active_chats ON users.UserID = active_chats.Target AND active_chats.UserID = ?
                WHERE users.UserID != ?
                AND active_chats.Target IS NULL
                ${filter ? 'AND LOWER(CONCAT(Forename, " ", Surname)) LIKE LOWER(?)' : ''}
                LIMIT 30`;

    //Stop bad ID's 
    if (isNaN(id)) {
        return res.status(400).json({ error: "Error with login instance, please log back in!" });
    }

    const values = [id,id,`%${filter}%`];
    database.query(query, values, (err, results) => {
        res.send({results: results});
    });
});

router.get("/getPeople",authenticateToken,(req,res) => {
    const id = req.user.userID;
    const filter = req.query.filter;
    const query=`SELECT UserID as id, CONCAT(Forename, ' ', Surname) as name
                FROM users
                WHERE UserID != ?
                ${filter ? 'AND LOWER(CONCAT(Forename, " ", Surname)) LIKE LOWER(?)' : ''}
                LIMIT 30`;


    //Stop bad ID's 
    if (isNaN(id)) {
        return res.status(400).json({ error: "Error with login instance, please log back in!" });
    }

    const values = [id,`%${filter}%`];
    database.query(query, values, (err, results) => {
        res.send({results: results});
    });
});

router.post("/createGroup",authenticateToken,(req,res) => {
    const createGroup = "INSERT INTO groups (Name,Owner) VALUES (?,?)";
    const addUser = "INSERT INTO group_users (GroupID,UserID) VALUES (?,?)";
    const id = req.user.userID;
    const targets = req.body.targets;
    const name = req.body.name;

    //Stop bad inputs
    if (isNaN(id) || targets.length<2 || name.length<1){
        return res.status(400).json({ error: "Invalid input" });
    }

    const createGroupValues = [name,id];
    database.query(createGroup, createGroupValues, (err, result) => {
        if (!err) {
            const groupId = result.insertId;
            const usersToAdd = [id, ...targets];

            for (let i=usersToAdd.length-1; i>=0; i--) {
                const target = usersToAdd[i];
                //Add user to group_users table
                const addUserValues = [groupId, target];
                database.query(addUser, addUserValues, (err) => {
                    if (err) {
                        return res.status(500).json({ error: "Error adding user to group" });
                    }
                    alertMessage(target);
                    if (i === 0) {
                        return res.status(200).json({ success: "Group created successfully" });
                    }
                });
            }
        }
        else return res.status(500).json({ error: "Server rejected message" });
    });
});




module.exports = router;