const express = require("express");
const router = express.Router();
const database = require("../config/database");
const {authenticateToken} = require("../exports/authenticate");

router.use(express.json()) // for parsing 'application/json'



// Get the full details of all projects or all projects led by this user
router.get("/getProjects",authenticateToken,(req,res) => {

    let query = `SELECT p.ProjectID as 'id', p.Title as 'title', p.Description as 'description', p.LeaderID as 'leader'
                 FROM projects as p`;
    let values = [];

    // if they are an employee, get all projects they are on
    if (req.user.role === "Employee") {
        query += ` INNER JOIN project_users as pu ON pu.ProjectID = p.ProjectID
                    WHERE pu.UserID = ?`;
        values = [req.user.userID];
    }

    // no need for a filter for managers

    database.query(query, values, (err, projectResults) => {
        if (err) {
            return res.status(500).send({error: "Error fetching projects"});
        }

        res.send({projects: projectResults});
    });
});

// this is different because this call is for led projects, which will allow us to distinguish between
// employees and team leaders
router.get("/getProjectsByLeader",authenticateToken,(req,res) => {
    // where the leader is the user
    const query = `SELECT p.ProjectID as 'id', p.Title as 'title', p.Description as 'description', p.LeaderID as 'leader'
                   FROM projects as p
                   WHERE p.LeaderID = ?`;
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

// Get the employees on all projects or all projects led by this user
router.get("/getTeamMembers",authenticateToken,(req,res) => {
    let query = `SELECT u.UserID as 'id', u.Forename as 'forename', u.Surname as 'surname'
                 FROM users as u`;
    let values = [];
    // Filter only employees on projects led by this user for team leaders
    if (req.user.role !== "Manager") {
        query += ` INNER JOIN projects as p ON p.LeaderID = ?
                    WHERE EXISTS (SELECT pu.ProjectID, pu.UserID
                                  FROM project_users AS pu
                                  WHERE pu.UserID = u.UserID AND pu.ProjectID = p.ProjectID)`;
        values = [req.user.userID];
    }

    database.query(query, values, (err, employeeResults) => {
        if (err) {
            return res.status(500).send({error: "Error fetching employees"});
        }

        res.send({employees: employeeResults});
    });
});



// Get the tasks on all projects or all projects led by this user
router.get("/getTasks",authenticateToken,(req,res) => {
    let query = `SELECT t.TaskID as 'id', t.Title as 'title', t.AssigneeID as 'assignee', t.ProjectID as 'project', t.Status as 'status', t.Priority as 'priority', t.HoursRequired as 'hoursRequired', t.Deadline as 'deadline'
                        FROM tasks as t`;
    let values = [];
    // Filter only tasks on projects led by this user for team leaders
    if (req.user.role !== "Manager") {
        query += ` WHERE EXISTS (SELECT p.ProjectID FROM projects AS p WHERE p.LeaderID = ? AND p.ProjectID = t.ProjectID)`;
        values = [req.user.userID];
    }

    database.query(query, values, (err, taskResults) => {
        if (err) {
            return res.status(500).send({ error: "Error fetching tasks" });
        }

        res.send({tasks: taskResults});
    });
});



// Get the hours of work completed by a given user x weeks ago
router.get("/getUserWeeklyHours",authenticateToken,(req,res) => {
    const query=`SELECT
                             SUM(IF(AssigneeID = ?
                                        AND DATEDIFF(CURDATE(), CompletionDate) >= ?
                                        AND DATEDIFF(CURDATE(), CompletionDate) < ?
                                        AND tasks.Status = 'Completed',
                                    HoursRequired, 0)
                             ) as hours
                         FROM
                             tasks`;

    const target = req.query.target;
    const week = req.query.week;

    const newestCutoff = week * 7
    const oldestCutoff = newestCutoff + 7

    const values = [target,newestCutoff,oldestCutoff];
    database.query(query, values, (err, results) => {
        res.send({results: results})
    });
});



// TODO unused - for timeline graph
// Get the hours of work completed on a project x weeks ago
router.get("/getProjectWeeklyHours",authenticateToken,(req,res) => {
    const query=`SELECT
                             SUM(IF(ProjectID = ?
                                        AND DATEDIFF(CURDATE(), CompletionDate) >= ?
                                        AND DATEDIFF(CURDATE(), CompletionDate) < ?
                                        AND tasks.Status = 'Completed',
                                    HoursRequired, 0)
                             ) as hours
                         FROM
                             tasks`;
    const target = req.query.target;
    const week = req.query.week;

    const newestCutoff = week * 7
    const oldestCutoff = newestCutoff + 7

    const values = [target,newestCutoff,oldestCutoff];
    database.query(query, values, (err, results) => {
        res.send({results: results})
    });
});



// TODO unused - for timeline graph
// Get the total hours of work in the project scope x weeks ago
router.get("/getProjectWeeklyScope",authenticateToken,(req,res) => {
    const query=`SELECT
                             SUM(IF(ProjectID = ?
                                        AND DATEDIFF(CURDATE(), CreationDate) >= ?,
                                    HoursRequired, 0)
                             ) as hours
                         FROM
                             tasks`;
    const target = req.query.target;
    const week = req.query.week;

    const newestCutoff = week * 7

    const values = [target,newestCutoff];
    database.query(query, values, (err, results) => {
        res.send({results: results})
    });
});



// Get the number of tasks assigned and completed by each user on a project
router.get("/getTaskAllocationAndPerformance", authenticateToken, (req, res) => {
    const projectId = req.query.projectId;

    if (!projectId) {
        return res.status(400).send({ error: "Project ID is required" });
    }

    const query = `
        SELECT 
            u.Forename AS label,
            COUNT(t.TaskID) AS tasksAssigned,
            SUM(CASE WHEN t.Status = 'Completed' THEN 1 ELSE 0 END) AS tasksCompleted
        FROM users u
        LEFT JOIN tasks t ON u.UserID = t.AssigneeID AND t.ProjectID = ?
        WHERE EXISTS (
            SELECT 1 
            FROM project_users pu 
            WHERE pu.UserID = u.UserID AND pu.ProjectID = ?
        )
        GROUP BY u.UserID`;

    database.query(query, [projectId, projectId], (err, results) => {
        if (err) {
            return res.status(500).send({ error: "Error fetching task allocation and performance" });
        }
        res.send(results);
    });
});



// Get the number of tasks a project has complete and incomplete
router.get("/getTaskCompletionStatus", authenticateToken, (req, res) => {
    const projectId = req.query.projectId;

    if (!projectId) {
        return res.status(400).send({ error: "Project ID is required" });
    }

    console.log("Project ID:", projectId); // Debugging

    const query = `
        SELECT 
            SUM(CASE WHEN Status = 'Completed' THEN 1 ELSE 0 END) AS completed,
            SUM(CASE WHEN Status != 'Completed' THEN 1 ELSE 0 END) AS pending
        FROM tasks
        WHERE ProjectID = ?`;

    database.query(query, [projectId], (err, results) => {
        if (err) {
            console.error("Error fetching task completion status:", err); // Debugging
            return res.status(500).send({ error: "Error fetching task completion status" });
        }

        console.log("Task Completion Status Results:", results); // Debugging

        // Format the response for the pie chart
        const formattedResults = [
            { label: "Completed", value: results[0].completed || 0 },
            { label: "Pending", value: results[0].pending || 0 },
        ];

        res.send(formattedResults);
    });
});



module.exports = router;