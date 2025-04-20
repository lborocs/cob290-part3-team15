const express = require("express");
const router = express.Router();
const database = require("../config/database");
const { io,connectedClients,alertMessage,alertEdit } = require('../exports/socket');
const {authenticateToken} = require("../exports/authenticate");

router.use(express.json()) // for parsing 'application/json'

router.get("/getMessages",authenticateToken,(req,res) => {
    const query=`SELECT group_messages.messageID as messageID,CONCAT(users.Forename,users.Surname) as name,group_messages.Content as content,group_messages.Sender as user, group_messages.Timestamp as timestamp
                 FROM group_messages 
                 LEFT JOIN users ON group_messages.Sender=users.UserID 
                 INNER JOIN group_users ON group_messages.GroupID=group_users.GroupID
                 WHERE group_messages.GroupID=? AND group_users.UserID=?
                 ORDER BY group_messages.Timestamp ASC`;
    const id = req.user.userID;
    const group = req.query.target;

    //Stop bad inputs
    if (isNaN(id) || isNaN(group)) {
        return res.status(400).json({ error: "Invalid input" });
    }

    const values = [group,id];
    database.query(query, values, (err, results) => {
      if(err){
        return res.status(500).json({error: "Failed to send message"})
      }
      const updateReadQuery = `UPDATE group_users
                              SET LastRead = NOW() 
                              WHERE UserID = ? AND GroupID = ?;`
      const updateReadyValues=[id,group]
      database.query(updateReadQuery, updateReadyValues, (err, results) => {
        if(err){
          return res.status(500).json({error: "Failed to update read status"})
        }
      });
      res.send({results: results});
    });
});

router.get("/getMessagesAfter",authenticateToken,(req,res) => {
  const query=`SELECT group_messages.messageID as messageID,CONCAT(users.Forename,users.Surname) as name,group_messages.Content as content,group_messages.Sender as user, group_messages.Timestamp as timestamp
               FROM group_messages 
               LEFT JOIN users ON group_messages.Sender=users.UserID 
               INNER JOIN group_users ON group_messages.GroupID=group_users.GroupID
               WHERE group_messages.GroupID=? AND group_users.UserID=? AND group_messages.Timestamp>CONVERT_TZ(?, '+00:00', @@session.time_zone)
               ORDER BY group_messages.Timestamp ASC`;
    const id = req.user.userID;
    const group = req.query.target;
    const timestamp= req.query.after;

    //Stop bad inputs
    if (isNaN(id) || isNaN(group)) {
        return res.status(400).json({ error: "Invalid input" });
    }

    const values = [group,id,timestamp];
    database.query(query, values, (err, results) => {
      if(err){
        return res.status(500).json({error: "Failed to send message"})
      }
      const updateReadQuery = `UPDATE group_users
                              SET LastRead = NOW() 
                              WHERE UserID = ? AND GroupID = ?;`
      const updateReadyValues=[id,group]
      database.query(updateReadQuery, updateReadyValues, (err, results) => {
        if(err){
          return res.status(500).json({error: "Failed to update read status"})
        }
      });
      res.send({results: results});
    });
});

router.post("/sendMessage",authenticateToken,(req,res) => {
    const query = "INSERT INTO group_messages (Sender,GroupID,Content) VALUES (?,?,?)";
    const presenceQuery= "SELECT 1 FROM group_users WHERE UserID = ? AND GroupID = ? LIMIT 1;"
    const id = req.user.userID;
    const group = req.body.target;
    const text = req.body.text;

    //Stop bad inputs
    if (isNaN(id) || isNaN(group)) {
        return res.status(400).json({ error: "Invalid input" });
    }

    //Query Values
    const presenceValues=[id,group];
    const values = [id,group,text];
    //Group Membership / Refresh information
    const groupUserQuery = "SELECT UserID FROM group_users WHERE GroupID=?"
    const groupUserQueryValues=[group]

    //Check If the user is allowed to send messages
    database.query(presenceQuery, presenceValues, (err, results) =>{
      //Fail Cases
      if(err){
          return res.status(500).json({ error: "Error verifying group membership" });
      }
      else if (results.length===0){
          return res.status(403).json({ error: "User is not a member of the group" });
      }

      //Success Case (Member of group, send message)
      else{
        database.query(query, values, err =>{
            if (err) {
              res.status(500).json({ error: "Server rejected message" });
            }
            else{
                //Fetch Group members to ping them for updates
                database.query(groupUserQuery, groupUserQueryValues, (err, results) => {
                  if (err){
                    return res.status(500).json({ error: "Failed to refresh correctly" });
                  }
                  else if (results.length===0){
                    return res.status(403).json({ error: "Group not found or has no members" });
                  }
                  else{
                    //Ping everyone in the group for updates
                    const timestampRefreshQuery = "UPDATE groups SET LastUpdate=NOW() WHERE GroupID=?;"
                    const timestampRefreshValues=[group]
                    database.query(timestampRefreshQuery,timestampRefreshValues,err=>{
                      if (err){
                        return res.status(500).json({ error: "Failed to refresh correctly" });
                      }
                      results.forEach((row) => {
                        alertMessage(row.UserID,group,text,'group_messages');
                      });
                      res.status(200).json({ success: "Message sent successfully" });
                    });
                  }
                }) 
            }
            
        });
      }  
    });
});

router.put("/updateMessage",authenticateToken,(req,res) => {
  const query="UPDATE group_messages SET Content=? WHERE MessageID=? AND Sender=?";
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
      //Get all group members to ping them for updates
      const groupUserQuery = "SELECT UserID,GroupID FROM group_users WHERE GroupID=(SELECT GroupID FROM group_messages WHERE messageID=?)"
      const groupUserQueryValues=[messageID]
      database.query(groupUserQuery, groupUserQueryValues, (err, results) => {
        if (err){
          return res.status(500).json({ error: "Failed to refresh correctly" });
        }
        else if (results.length===0){
          return res.status(403).json({ error: "Group not found or has no members" });
        }
        for (let i=0;i<results.length;i++){
          const groupID = results[i].GroupID;
          const userID = results[i].UserID;
          alertEdit(userID,groupID,messageID,"group_messages",content);
        }
        return res.status(200).json({ success: true, message: "Message updated successfully" });
      });
  });
});

module.exports = router;