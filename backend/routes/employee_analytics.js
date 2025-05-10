const express = require("express");
const router = express.Router();
const database = require("../config/database");
const {authenticateToken} = require("../exports/authenticate");

router.use(express.json()) // for parsing 'application/json'


// Check if an employee leads any projects
router.get("/getIsLeader",authenticateToken,(req,res) => {
    const query = `SELECT
                            EXISTS (SELECT ProjectID FROM projects WHERE LeaderID = ?) AS 'isLeader'`;

    database.query(query, [req.user.userID], (err, results) => {
        if (err) {
            return res.status(500).send({error: "Error fetching leader status"});
        }

        res.send({result: results[0]});
    });
});


// Get overview quick stats
router.get("/getOverviewQuickStatistics",authenticateToken,(req,res) => {
    const query = `SELECT
                            (SELECT COUNT(ProjectID) FROM project_users WHERE UserID = ?) as 'projects',
                            (SELECT COUNT(TaskID) FROM tasks WHERE AssigneeID = ?) as 'tasks',
                            (SELECT COUNT(TaskID) FROM tasks WHERE AssigneeID = ? AND Status != 'Completed' AND DATEDIFF(CURDATE(), Deadline)>0) as 'overdue'`;

    database.query(query, [req.user.userID, req.user.userID, req.user.userID], (err, results) => {
        if (err) {
            return res.status(500).send({error: "Error fetching overview quick statistics"});
        }

        res.send({results: results});
    });
});

// Get all projects assigned to a user
router.get("/getAssignedProjects",authenticateToken,(req,res) => {
    const query=`SELECT p.ProjectID as 'id', p.Title as 'title', p.Description as 'description'
                        FROM projects as p INNER JOIN project_users as pu ON p.ProjectID = pu.ProjectID
                        WHERE pu.UserID = ?`;

    const values = [req.user.userID];
    database.query(query, values, (err, projectResults) => {
        if (err) {
            return res.status(500).send({error: "Error fetching projects"});
        }

        if (!projectResults || projectResults.length === 0) {
            return res.send({projects: []});
        }

        res.send({projects: projectResults});
    });
});

/* ADDED FUNCTIONS FOR THE EMPLOYEE OVERVIEW */
// get the employee hours 
router.get("/getAllEmployeeHours", authenticateToken, (req, res) => {
    const query = `
        WITH last_4_weeks AS (
            SELECT 
                DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL (WEEKDAY(CURDATE())) DAY) - INTERVAL (7 * (n - 1)) DAY, '%Y-%m-%d') AS weekStart,
                DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL (WEEKDAY(CURDATE()) - 6) DAY) - INTERVAL (7 * (n - 1)) DAY, '%Y-%m-%d') AS weekEnd
            FROM (SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) AS weeks
        )
        SELECT 
            SUM(t.HoursRequired) AS 'hours',
            lw.weekStart,
            lw.weekEnd
        FROM last_4_weeks lw
        LEFT JOIN tasks t 
            ON t.CompletionDate BETWEEN lw.weekStart AND lw.weekEnd
            AND t.AssigneeID = ? 
            AND t.Status = 'Completed'
        GROUP BY lw.weekStart, lw.weekEnd
        ORDER BY lw.weekStart DESC;
    `;

    database.query(query, [req.user.userID], (err, results) => {
        if (err) {
            return res.status(500).send({ error: "Error fetching employee hours" });
        }

        res.send({ results: results });
    });
});

//getting all projects the employee contributed to, and returning for each proct the number of tasks completed due and overdue
router.get("/getAllEmployeeProjects",authenticateToken,(req,res) => {
    const query = `SELECT
                            p.ProjectID as 'id',
                            p.Title as 'title',
                            COUNT(t1.TaskID) as 'completed',
                            COUNT(t2.TaskID) as 'overdue',
                            COUNT(t3.TaskID) as 'due'
                        FROM projects as p
                        INNER JOIN project_users as pu ON p.ProjectID = pu.ProjectID
                        LEFT JOIN tasks as t1 ON p.ProjectID = t1.ProjectID AND t1.Status = 'Completed' AND t1.AssigneeID = ?
                        LEFT JOIN tasks as t2 ON p.ProjectID = t2.ProjectID AND t2.Status != 'Completed' AND DATEDIFF(CURDATE(), t2.Deadline) > 0 AND t2.AssigneeID = ?
                        LEFT JOIN tasks as t3 ON p.ProjectID = t3.ProjectID AND t3.Status != 'Completed' AND DATEDIFF(CURDATE(), t3.Deadline) <= 0 AND t3.AssigneeID = ?
                        WHERE pu.UserID = ?
                        GROUP BY p.ProjectID`;

    const values = [req.user.userID, req.user.userID, req.user.userID, req.user.userID];

    database.query(query, values, (err, results) => {
        if (err) {
            return res.status(500).send({error: "Error fetching employee projects"});
        }

        res.send({results: results});
    });
});

router.get("/getTasks",authenticateToken,(req,res) => {
    let query = `SELECT t.TaskID as 'id', t.Title as 'title', t.ProjectID as 'project', t.Status as 'status', t.Priority as 'priority', t.Deadline as 'deadline'
                        FROM tasks as t WHERE t.AssigneeID = ?`;
    let values = [req.user.userID];

    database.query(query, values, (err, taskResults) => {
        if (err) {
            return res.status(500).send({ error: "Error fetching tasks" });
        }

        res.send({tasks: taskResults});
    });
});


// TODO unused
// Get all tasks assigned to a user
router.get("/getUserTasks", authenticateToken, (req, res) => {
    const selectedProjectId = req.query.id;

    let query;
    let values;

    if (selectedProjectId == 'null') {
        // If no projectId is provided, fetch all tasks assigned to the user
        query = `SELECT t.TaskID as 'id', t.Title as 'title', u.Forename AS 'assigneeForename', u.Surname AS 'assigneeSurname', t.Status as 'status', t.Priority as 'priority', t.Deadline as 'deadline'
                 FROM tasks as t INNER JOIN users as u ON t.AssigneeID = u.UserID
                 WHERE t.AssigneeID = ?`;
        values = [req.user.userID];
    } else {
        // If projectId is provided, fetch tasks for the specific project
        query = `SELECT t.TaskID as 'id', t.Title as 'title', u.Forename AS 'assigneeForename', u.Surname AS 'assigneeSurname', t.Status as 'status', t.Priority as 'priority', t.Deadline as 'deadline'
                 FROM tasks as t INNER JOIN users as u ON t.AssigneeID = u.UserID
                 WHERE t.AssigneeID = ? AND t.ProjectID = ?`;
        values = [req.user.userID, selectedProjectId];
    }

    database.query(query, values, (err, taskResults) => {
        if (err) {
            return res.status(500).send({ error: "Error fetching tasks" });
        }

        res.send({tasks: taskResults});
    });
 });



module.exports = router;