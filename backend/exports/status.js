const database = require("../config/database");
const { selfStatusAlert,otherStatusAlert} = require('./socket');

async function setStatus(userId,status,loginAttempt) {
  var query="SELECT Status FROM users WHERE UserID=? LIMIT 1;";
  const values = [userId];
  var currentStatus = null;
  database.query(query, values, (err, results) => {
      if (err) {
          console.error(err);
          return;
      }
      if (results.length === 0) {
          console.log("User not found");
          return;
      }
      currentStatus = results[0].Status;

      // Stop bad inputs
      if (!currentStatus) {
          console.log(`Status is ${currentStatus}`);
          return;
      }

      // If this is a login attempt, Online is a lower priority than Invisible
      if (loginAttempt && currentStatus==="Invisible"){
          status="Invisible";
          return;
      }

      // Update the user's status in the database
      if (status==="Offline"){
          query = "UPDATE users SET Status='Offline' WHERE UserID=? AND Status NOT IN ('Invisible','Offline')";
      }
      else if (status==="Online"){
          query = "UPDATE users SET Status='Online' WHERE UserID=? AND Status NOT IN ('Invisible','Online')";
      }
      else if (status==="Invisible"){
          query = "UPDATE users SET Status='Invisible' WHERE UserID=? AND Status NOT IN ('Invisible')";
      }
      else {
          console.log("Invalid status update requested");
          return;
      }
      const substitutions = {"Online": "Online", "Offline": "Offline", "Invisible": "Offline"};
      database.query(query, values, (err, results) => {
          if (err) {
              console.error(err);
          } else {
              if(status==="Online"||status==="Invisible"){
                  selfStatusAlert(userId,substitutions[status]);
              }
              if((status==="Online"||status==="Offline"||status==="Invisible") && !(currentStatus===status)){
                  // Fetch users to alert (people who are in a chat with the user)
                  const usersToAlertQuery= "SELECT UserID FROM active_chats WHERE Target=? AND Type='direct_messages'";
                  var usersToAlert =[];
                  database.query(usersToAlertQuery, [userId], (err, results) => {
                      if (err) {
                          console.error(err);
                          return;
                      }
                      usersToAlert = results.map(row => row.UserID);
                      otherStatusAlert(usersToAlert,substitutions[status]);
                  });
                  
              }
              console.log(`User ${userId} set to ${status}`);
          }
      });
  });
}

module.exports = {setStatus};