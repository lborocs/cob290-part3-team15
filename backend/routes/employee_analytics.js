const express = require("express");
const router = express.Router();
const database = require("../config/database");
const {authenticateToken} = require("../exports/authenticate");

router.use(express.json()) // for parsing 'application/json'


// Get overview quick stats
router.get("/getOverviewQuickStatistics",authenticateToken,(req,res) => {
    const query = `SELECT
                            (SELECT COUNT(ProjectID) FROM project_users WHERE UserID = ?) as 'projects',
                            (SELECT COUNT(TaskID) FROM tasks WHERE AssigneeID = ?) as 'tasks',
                            (SELECT COUNT(TaskID) FROM tasks WHERE AssigneeID = ? AND DATEDIFF(CURDATE(), Deadline)>0) as 'overdue'`;

    database.query(query, [req.user.userID, req.user.userID, req.user.userID], (err, results) => {
        if (err) {
            return res.status(500).send({error: "Error fetching overview quick statistics"});
        }

        res.send({results: results});
    });
});

// TODO unused
// Get all tasks assigned to a user
router.get("/getUserTasks",authenticateToken,(req,res) => {
    print("getUserTasks called");
    const query=`SELECT ProjectID, AssigneeID, Title, Status, Priority, HoursRequired, Deadline, CompletionDate FROM tasks WHERE tasks.AssigneeID=?`;
    const id = req.query.target;

    print("getUserTasks called with id: ", id);

    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    const values = [id];
    database.query(query, values, (err, results) => {
        res.send({results: results});
    });
});



module.exports = router;