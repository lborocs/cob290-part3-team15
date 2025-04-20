const database = require("../config/database");
const { selfStatusAlert,otherStatusAlert} = require('./socket');

async function setStatus(userId,status,loginAttempt) {
  var query="SELECT Status,SavedStatus FROM users WHERE UserID=? LIMIT 1;";
  const values = [userId];
  var currentStatus = null;
  var savedStatus = null;
  var expectedStatus=status;
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
    savedStatus = results[0].SavedStatus;

    if (!status){
        return;
    }

    // If this is a login attempt, Online is a lower priority than Invisible
    if (loginAttempt) {
        if (currentStatus==="Invisible"){
            status="Invisible";
            return;
        }
        else if (currentStatus==="Offline"){
            query = "UPDATE users SET Status=SavedStatus WHERE UserID=?";
            expectedStatus=savedStatus;
        }
        else{
            selfStatusAlert(userId,currentStatus)
            return;
        }}
    else{
        expectedStatus=status;
        // Update the user's status in the database
        if (status==="Offline"){
            query = "UPDATE users SET Status='Offline' WHERE UserID=? AND Status NOT IN ('Offline','Invisible')";
        }
        else if (status==="Online"){
            query = "UPDATE users SET Status='Online',SavedStatus='Online' WHERE UserID=? AND Status NOT IN ('Online')";
        }
        else if (status==="Invisible"){
            query = "UPDATE users SET Status='Invisible' WHERE UserID=? AND Status NOT IN ('Invisible')";
        }
        else if (status==="DND"){
            query = "UPDATE users SET Status='DND',SavedStatus='DND' WHERE UserID=? AND Status NOT IN ('DND')";
        }
        else if (status==="Away"){
            query = "UPDATE users SET Status='Away',SavedStatus='Away' WHERE UserID=? AND Status NOT IN ('Away')";
        }
        else {
            console.log("Invalid status update requested");
            return;
        }
    }

    const substitutions = {"Online": "Online", "Offline": "Offline", "Invisible": "Offline" ,"DND":"DND","Away":"Away"};
    database.query(query, values, (err, results) => {
        if (err) {
            console.error(err);
        } else {
            if (expectedStatus!==null){
                selfStatusAlert(userId,substitutions[expectedStatus]);
            }
            if(!(currentStatus===expectedStatus)){
                // Fetch users to alert (people who are in a chat with the user)
                const usersToAlertQuery= "SELECT UserID FROM active_chats WHERE Target=?";
                var usersToAlert =[userId];
                database.query(usersToAlertQuery, usersToAlert, (err, results) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    usersToAlert = results.map(row => row.UserID);
                    otherStatusAlert(userId,usersToAlert,substitutions[expectedStatus]);
                });
                
            }
            console.log(`User ${userId} set to ${expectedStatus}`);
        }
    });
});
};



module.exports = {setStatus};