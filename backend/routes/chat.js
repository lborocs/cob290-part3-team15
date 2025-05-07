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
                        dm.Content AS content,
                        IFNULL(unread.UnreadCount, 0) AS notifications
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
                    LEFT JOIN (
                        SELECT 
                            COUNT(*) AS UnreadCount,
                            CASE 
                                WHEN dm.Sender < dm.Recipient THEN dm.Sender
                                ELSE dm.Recipient
                            END AS user1,
                            CASE 
                                WHEN dm.Sender < dm.Recipient THEN dm.Recipient
                                ELSE dm.Sender
                            END AS user2
                        FROM direct_messages dm
                        JOIN active_chats active_chats_2 
                        ON ((dm.Sender = active_chats_2.Target AND dm.Recipient = active_chats_2.UserID) 
                        OR (dm.Recipient = active_chats_2.Target AND dm.Sender = active_chats_2.UserID))
                        WHERE 
                            (active_chats_2.LastRead IS NULL OR dm.Timestamp > active_chats_2.LastRead)
                            AND active_chats_2.UserID = ?
                        GROUP BY user1, user2
                    ) unread
                    ON (LEAST(active_chats.UserID, active_chats.Target) = unread.user1 AND GREATEST(active_chats.UserID, active_chats.Target) = unread.user2
                    )
                    WHERE active_chats.UserID = ? 

                    UNION

                    SELECT 
                        g.Name AS name,
                        g.GroupID AS target,
                        'group_messages' AS type,
                        NULL AS status,
                        g.LastUpdate AS timestamp,
                        gm.Content AS content,
                        (SELECT COUNT(*)
                            FROM group_messages gm_sub
                            WHERE gm_sub.GroupID = g.GroupID
                            AND gm_sub.Timestamp > IFNULL(gu.LastRead, 0)
                            AND gm_sub.isDeleted = 0
                        ) AS notifications
                    FROM groups g
                    JOIN group_users gu ON gu.GroupID = g.GroupID
                    LEFT JOIN group_messages gm 
                        ON gm.GroupID = g.GroupID
                        AND gm.MessageID = (
                            SELECT MAX(MessageID)
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

    const values = [id,id,id];
    database.query(query, values, (err, results) => {
        res.send({results: results});
    });
});

router.delete("/removeChat",authenticateToken,(req,res) => {
    var query ="";
    const id = req.user.userID;
    const user = req.user.name;
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
            const groupOwnershipQuery=`SELECT 1 FROM groups WHERE Owner=? AND GroupID=?`;
            database.query(groupOwnershipQuery, [id,target], (err, results) => {
                if (err) {
                    return res.status(500).json({ error: "Error checking group size" });
                }
                const groupSize = results.length
                if (groupSize > 0 ) {
                    // If there is a result, you're the owner; the group must be deleted
                    query=`DELETE FROM groups WHERE GroupID=?`;
                    values=[target]
                }
                else{
                    query=`DELETE FROM group_users WHERE UserID=? AND GroupID=?`;
                }

                //Get all group members to ping them for updates
                const groupUserQuery = "SELECT UserID FROM group_users WHERE GroupID=?"
                const groupUserQueryValues=[target]
                database.query(groupUserQuery, groupUserQueryValues, (err, memberResults) => {
                    if (err){return res.status(500).json({ error: "Failed to get users" });}
                    else if (memberResults.length===0){return res.status(404).json({ error: "Group not found or has no members" })}
                    database.query(query, values, (err, results) => {
                        var systemQuery = "SELECT 1 FROM users WHERE UserID=?";
                        var systemValues= [id]
                        if (err) {return res.status(400).json({ error: "Error leaving group" });}
                        else if (groupSize<1) {
                            systemQuery = "INSERT INTO group_messages (Sender,GroupID,Content,isSystem) VALUES (?,?,?,?)";
                            systemValues= [id,target,`${user} left the group`,true]
                        }
                        //Insert a system message
                        database.query(systemQuery, systemValues, (err, results) => {
                            if(err){return res.status(500).json({ error: "Failed to send system message" });}
                            else{
                                for (let i=0;i<memberResults.length;i++){
                                const userID = memberResults[i].UserID;
                                if(groupSize<1){
                                    alertMessage(userID,target,`User Removal`,'group_messages',true);
                                }
                                else{
                                    alertMessage(userID,target,`User Removal`,'group_messages',true,{target:userID,group:target});
                                }
                                }
                                return res.status(200).json({ success: true, message: "User Removed" });
                            }
                        });
                    })
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
    const addSelf = "INSERT INTO group_users (GroupID,UserID,LastRead) VALUES (?,?,NOW())";
    const id = req.user.userID;
    const user = req.user.name
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
            const systemQuery = "INSERT INTO group_messages (Sender,GroupID,Content,isSystem) VALUES (?,?,?,?)";
            const systemValues= [id,groupId,`${user} created this group`,true]
            database.query(systemQuery, systemValues, (err, result) => {
                if (!err) {
                    for (let i=usersToAdd.length-1; i>=0; i--) {
                        const target = usersToAdd[i];
                        //Add user to group_users table
                        const addUserValues = [groupId, target];
                        database.query(i==0?addSelf:addUser, addUserValues, (err) => {
                            if (err) {
                                return res.status(500).json({ error: "Error adding user to group" });
                            }
                            alertMessage(target,groupId,`You have been added to ${name}`,'group_messages',false);
                            if (i === 0) {
                                return res.status(200).json({ success: "Group created successfully",id:groupId});
                            }
                        });
                    }
                }
                else return res.status(500).json({ error: "Server rejected message" });
            })
        }
        else return res.status(500).json({ error: "Server rejected message" });
    });
});

router.post("/startChat",authenticateToken,(req,res) => {
    const activateChat = "INSERT IGNORE INTO active_chats (UserID,Target,LastRead) VALUES (?,?,NOW())";
    const id = req.user.userID;
    const target = req.body.target;

    //Stop bad inputs
    if (isNaN(id) || isNaN(target)){
        return res.status(400).json({ error: "Invalid input" });
    }

    const activateChatValues = [id,target];
    database.query(activateChat, activateChatValues, (err, result) => {
        if (!err) {
            alertMessage(id,target,`Chat Initiated`,'direct_messages',false);
            return res.status(200).json({ success: "Chat created successfully" });
        }
        else return res.status(500).json({ error: "Server rejected message" });
    });
});

router.get("/getNotifications",authenticateToken,(req,res) => {
    //Notification is LastRead < LastUpdate
    const query=`SELECT (
    SELECT COUNT(*)
    FROM direct_messages dm
    JOIN active_chats ac 
      ON (
        (dm.Sender = ac.Target AND dm.Recipient = ac.UserID) 
        OR 
        (dm.Recipient = ac.Target AND dm.Sender = ac.UserID))
    WHERE ac.UserID = ?
      AND (ac.LastRead IS NULL OR dm.Timestamp > ac.LastRead)) +
    (SELECT COUNT(*)
    FROM group_messages gm
    JOIN group_users gu ON gm.GroupID = gu.GroupID
    WHERE gu.UserID = ?
      AND (gu.LastRead IS NULL OR gm.Timestamp > gu.LastRead)
    ) AS totalUnread;`

    const id = req.user.userID;
    //Stop bad ID's
    if (isNaN(id)) {
        return res.status(400).json({ error: "Error with login instance, please log back in!" });
    }

    const values = [id,id];
    database.query(query, values, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error fetching notifications" });
        }
        const totalUnread = results[0].totalUnread;
        res.send({results: totalUnread});
    });
})





module.exports = router;