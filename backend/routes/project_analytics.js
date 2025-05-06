const express = require("express");
const router = express.Router();
const database = require("../config/database");
const {authenticateToken} = require("../exports/authenticate");

router.use(express.json()) // for parsing 'application/json'

// Get quick statistics for a user on the project side, possibly filtered by project
router.get("/getQuickStatistics",authenticateToken,(req,res) => {
    const projectId = req.query.id;
    let query = "";

    // Get overview stats if no project is selected
    if (!projectId) {
        // For managers and team leaders, we get the number of projects, employees and tasks
        query = ``

        // For team leaders, we filter by projects they lead
        if (req.user.role !== "Manager") {

        }
    }
});

// this gets the details of the selected project
router.get("/getProjectDetails", authenticateToken, (req, res) => {
    const query = `SELECT p.ProjectID as 'id', p.Title as 'title', p.Description as 'description' FROM projects as p WHERE p.ProjectID=?`;

    const projectId = req.query.id;
    if (!projectId) {
        return res.status(400).send({ error: "id parameter is required" });
    }

    const values = [projectId];
    database.query(query, values, (err, projectResults) => {
        if (err) {
            return res.status(500).send({error: "Error fetching project details"});
        }
        if (projectResults.length === 0) {
            return res.status(404).send({error: "Project not found"});
        }

        res.send({project: projectResults[0]});
    });
});

// Query to get employees on the project
router.get("/getProjectMembers", authenticateToken, (req, res) => {
    const query = `SELECT u.UserID as 'id', u.Forename as 'forename', u.Surname as 'surname'
                            FROM project_users as pu
                                     INNER JOIN users as u ON pu.UserID = u.UserID
                            WHERE pu.ProjectID=?`;


    const projectId = req.query.id;
    if (!projectId) {
        return res.status(400).send({ error: "id parameter is required" });
    }

    const values = [projectId];
    database.query(query, values, (err, employeeResults) => {
        if (err) {
            return res.status(500).send({ error: "Error fetching tasks" });
        }

        res.send({employees: employeeResults});
    });
});

// Query to get tasks for the project
router.get("/getProjectTasks", authenticateToken, (req, res) => {
    const query = `SELECT t.TaskID as 'id', t.Title as 'title', t.AssigneeID as 'assignee', t.Status as 'status', t.Priority as 'priority', t.HoursRequired as 'hoursRequired', t.Deadline as 'deadline' FROM tasks as t WHERE t.ProjectID=?`;

    const projectId = req.query.id;
    if (!projectId) {
        return res.status(400).send({ error: "id parameter is required" });
    }

    const values = [projectId];
    database.query(query, values, (err, taskResults) => {
        if (err) {
            return res.status(500).send({ error: "Error fetching employees" });
        }

        res.send({tasks: taskResults});
    });
});

// TODO unused
// get the hours of work completed on a project x weeks ago
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

// TODO unused
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