const express = require("express");
const router = express.Router();
const database = require("../config/database");
const { io,connectedClients,alertMessage,alertEdit } = require('../exports/socket');
const {authenticateToken} = require("../exports/authenticate");

router.use(express.json()) // for parsing 'application/json'

router.get("/getMessages",authenticateToken,(req,res) => {
    const query=`SELECT group_messages.messageID as messageID,
                  CONCAT(users.Forename,users.Surname) as name,
                  group_messages.Content as content,
                  group_messages.Sender as user,
                  group_messages.Timestamp as timestamp,
                  group_messages.isEdited as isEdited,
                  group_messages.isSystem as isSystem
                 FROM group_messages
                 LEFT JOIN users ON group_messages.Sender=users.UserID 
                 INNER JOIN group_users ON group_messages.GroupID=group_users.GroupID
                 WHERE group_messages.GroupID=? AND group_users.UserID=? AND group_messages.isDeleted=0
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
  const query=`SELECT group_messages.messageID as messageID,
                CONCAT(users.Forename,users.Surname) as name,
                group_messages.Content as content,
                group_messages.Sender as user,
                group_messages.Timestamp as timestamp,
                group_messages.isEdited as isEdited,
                group_messages.isSystem as isSystem
               FROM group_messages 
               LEFT JOIN users ON group_messages.Sender=users.UserID 
               INNER JOIN group_users ON group_messages.GroupID=group_users.GroupID
               WHERE group_messages.GroupID=? AND group_users.UserID=? AND group_messages.Timestamp>CONVERT_TZ(?, '+00:00', @@session.time_zone) AND group_messages.isDeleted=0
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
                        alertMessage(row.UserID,group,text,'group_messages',true);
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
  const query="UPDATE group_messages SET Content=?, isEdited = 1 WHERE MessageID=? AND Sender=?";
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

router.put("/hideMessage",authenticateToken,(req,res) => {
  const query="UPDATE group_messages SET isDeleted=1 WHERE MessageID=? AND Sender=?";
  const id = req.user.userID;
  const messageID= req.body.id;

  //Stop bad inputs
  if (isNaN(id) || isNaN(messageID)) {
      return res.status(400).json({ error: "Invalid ID" });
  }

  const values = [messageID,id];
  database.query(query, values, err => {
      if (err) {
          console.error(err);
          return res.status(500).json({ error: "Failed to hide message" });
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
          alertEdit(userID,groupID,messageID,"group_messages","Message Deleted");
        }
        return res.status(200).json({ success: true, message: "Message deleted successfully" });
      });
  });
});

router.get("/getMembers",authenticateToken,(req,res) => {
  const id = req.user.userID;
  const group = req.query.target;

  //Stop bad ID's 
  if (isNaN(id) || isNaN(group)) {
    return res.status(400).json({ error: "Bad request" });
  }

  //Verify group membership
  const membershipQuery=`SELECT 1 FROM group_users WHERE UserID=? AND GroupID=?`
  const membershipValues=[id,group]

  database.query(membershipQuery, membershipValues, (err, results) => {
    if (err){return res.status(500).json({ error: "Failed to verify membership" });}
    else{
      if (results.length < 1) {
        return res.status(403).json({ error: "You are not a member" });
      }
      const query = "SELECT CONCAT(users.Forename,' ',users.Surname) as name, group_users.UserID as id FROM group_users LEFT JOIN users ON users.UserID=group_users.UserID WHERE GroupID = ?"
      const values = [group];
      database.query(query, values, (err, results) => {
        if(err){return res.status(500).json({ error: "Failed to get users" });}
        else{
          const postResults = results.map(member => {
            if (Number(member.id) === id) {
              return { ...member, name: `${member.name} (You)` };
            }
            return member;
          });
          const leaderQuery = "SELECT Owner as owner from Groups WHERE GroupID=?"
          database.query(leaderQuery, values, (err, results) => {
            if(err){
              return res.status(500).json({ error: "Failed to get Leader" });
              
            }
            else{
              if (results.length < 1) {
                return res.status(403).json({ error: "There is no leader. (Please report, this shouldn't happen)" });
              }

              return res.status(200).json({ results: postResults, owner:results[0].owner });
            }
          })
        }
      });
    }
  });
});

router.delete("/removeMember",authenticateToken,(req,res) => {
  const id = req.user.userID;
  const user = req.user.name;
  const group = req.body.group;
  const target = req.body.target

  //Stop bad ID's 
  if (isNaN(id) || isNaN(group) || isNaN(target)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  //Verify group ownership
  const ownershipQuery = `SELECT 1 FROM groups WHERE Owner = ? AND GroupID = ?`;
  const ownershipValues = [id, group];

  database.query(ownershipQuery, ownershipValues, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to verify ownership" });
    if (results.length === 0) {return res.status(403).json({ error: "You are not the owner of this group." })}
  });

  const query = `DELETE FROM group_users WHERE GroupID = ? AND UserID = ?`;
  const values = [group, target];

  const nameQuery = "SELECT CONCAT(users.Forename,' ',users.Surname) as name FROM users LEFT JOIN group_users ON group_users.UserID=users.UserID WHERE users.UserID=? AND group_users.GroupID=?"
  const nameValues= [target,group] 
  //Get the name of the target whilst also verifying they exist
  database.query(nameQuery, nameValues, (err, results) => {
    if(err){return res.status(500).json({ error: "Failed to verify target user" });}
    else if(results.length<1){return res.status(400).json({ error: "Target does not exist" });}
    else{
      const targetName=results[0].name
      //Remove the target
      database.query(query, values, (err, results) => {
        if (err) {return res.status(500).json({ error: "Failed to remove member" });}
        else{
          const systemQuery = "INSERT INTO group_messages (Sender,GroupID,Content,isSystem) VALUES (?,?,?,?)";
          const systemValues= [id,group,`${user} removed ${targetName} from the group`,true]
          //Insert a system message
          database.query(systemQuery, systemValues, (err, results) => {
            if(err){return res.status(500).json({ error: "Failed to send system message" });}
            else{
              const groupRefreshQuery = "UPDATE groups SET LastUpdate=Now() WHERE GroupID=?"
              const groupRefreshValues = [group]
              database.query(groupRefreshQuery, groupRefreshValues, (err, results) => {
                if (err){return res.status(500).json({ error: "Failed to refresh correctly" });}
                else{
                  //Get all group members to ping them for updates
                  const groupUserQuery = "SELECT UserID FROM group_users WHERE GroupID=?"
                  const groupUserQueryValues=[group]
                  database.query(groupUserQuery, groupUserQueryValues, (err, results) => {
                    if (err){return res.status(500).json({ error: "Failed to refresh correctly" });}
                    else if (results.length===0){return res.status(403).json({ error: "Group not found or has no members" })}
                    const resultsAndTarget=[{UserID:target},... results]
                    for (let i=0;i<resultsAndTarget.length;i++){
                      const userID = resultsAndTarget[i].UserID;
                      alertMessage(userID,group,`User Removal`,'group_messages',true,{target:target,group:group});
                    }
                    return res.status(200).json({ success: true, message: "User Removed" });
                  });
                }
              })
            }
          })
        }
      });
    }
  })
});

router.post("/addMember",authenticateToken,(req,res) => {
  const id = req.user.userID;
  const user = req.user.name;
  const group = req.body.group;
  const target = req.body.target

  //Stop bad ID's 
  if (isNaN(id) || isNaN(group) || isNaN(target)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  //Verify group ownership
  const ownershipQuery = `SELECT 1 FROM groups WHERE Owner = ? AND GroupID = ?`;
  const ownershipValues = [id, group];

  database.query(ownershipQuery, ownershipValues, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to verify ownership" });
    if (results.length === 0) {return res.status(403).json({ error: "You are not the owner of this group." })}
  });

  const query = `INSERT IGNORE INTO group_users (GroupID,UserID) VALUES (?,?)`;
  const values = [group, target];


  const nameQuery = "SELECT CONCAT(users.Forename,' ',users.Surname) as name FROM users WHERE UserID=?"
  const nameValues= [target] 
  //Get the name of the target whilst also verifying they exist
  database.query(nameQuery, nameValues, (err, results) => {
    if(err){return res.status(500).json({ error: "Failed to verify target user" });}
    else if(results.length<1){return res.status(400).json({ error: "Target does not exist" });}
    else{
      const targetName=results[0].name
      //Add the target
      database.query(query, values, (err, results) => {
        if (err) {return res.status(500).json({ error: "Failed to add member" });}
        else{
          const systemQuery = "INSERT INTO group_messages (Sender,GroupID,Content,isSystem) VALUES (?,?,?,?)";
          const systemValues= [id,group,`${user} added ${targetName} to the group`,true]
          //Insert a system message
          database.query(systemQuery, systemValues, (err, results) => {
            if(err){return res.status(500).json({ error: "Failed to send system message" });}
            else{
              const groupRefreshQuery = "UPDATE groups SET LastUpdate=Now() WHERE GroupID=?"
              const groupRefreshValues = [group]
              database.query(groupRefreshQuery, groupRefreshValues, (err, results) => {
                if (err){return res.status(500).json({ error: "Failed to refresh correctly" });}
                else{
                  //Get all group members to ping them for updates
                  const groupUserQuery = "SELECT UserID,GroupID FROM group_users WHERE GroupID=?"
                  const groupUserQueryValues=[group]
                  database.query(groupUserQuery, groupUserQueryValues, (err, results) => {
                    if (err){return res.status(500).json({ error: "Failed to refresh correctly" });}
                    else if (results.length===0){return res.status(403).json({ error: "Group not found or has no members" })}
                    for (let i=0;i<results.length;i++){
                      const userID = results[i].UserID;
                      alertMessage(userID,group,`New user Added`,'group_messages',true);
                    }
                    return res.status(200).json({ success: true, message: "User Added" });
                  });
                }
              })
            }
          })
        }
      });
    }
  })
});

router.post("/updateName",authenticateToken,(req,res) => {
  const id = req.user.userID;
  const user = req.user.name;
  const group = req.body.group;
  const name = req.body.name

  //Stop bad ID's 
  if (isNaN(id) || isNaN(group)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  //Verify group ownership
  const ownershipQuery = `SELECT 1 FROM groups WHERE Owner = ? AND GroupID = ?`;
  const ownershipValues = [id, group];


  database.query(ownershipQuery, ownershipValues, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to verify ownership" });
    if (results.length === 0) {return res.status(403).json({ error: "You are not the owner of this group." })}
  });

  const query = `UPDATE groups SET Name=? WHERE GroupID=?`;
  const values = [name, group];

  database.query(query, values, (err, results) => {
    if (err) {return res.status(500).json({ error: "Failed to add member" });}
    else{
      const systemQuery = "INSERT INTO group_messages (Sender,GroupID,Content,isSystem) VALUES (?,?,?,?)";
      const systemValues= [id,group,`${user} renamed the group to ${name}`,true]
      database.query(systemQuery, systemValues, (err, results) => {
        if(err){return res.status(500).json({ error: "Failed to send system message" });}
        else{
          const groupRefreshQuery = "UPDATE groups SET LastUpdate=Now() WHERE GroupID=?"
          const groupRefreshValues = [group]
          database.query(groupRefreshQuery, groupRefreshValues, (err, results) => {
            if (err){return res.status(500).json({ error: "Failed to refresh correctly" });}
            else{
              //Get all group members to ping them for updates
              const groupUserQuery = "SELECT UserID,GroupID FROM group_users WHERE GroupID=?"
              const groupUserQueryValues=[group]
              database.query(groupUserQuery, groupUserQueryValues, (err, results) => {
                if (err){return res.status(500).json({ error: "Failed to refresh correctly" });}
                else if (results.length===0){return res.status(403).json({ error: "Group not found or has no members" })}
                for (let i=0;i<results.length;i++){
                  const userID = results[i].UserID;
                  alertMessage(userID,group,`Group Rename`,'group_messages',true);
                }
                return res.status(200).json({ success: true, message: "Rename successful" });
              });
            }
          })
        }
      })
    }
  });
});

module.exports = router;