const express = require("express");
const router = express.Router();
const database = require("../config/database");
const {authenticateToken} = require("../exports/authenticate");

router.use(express.json()) // for parsing 'application/json'

// Get the full details of all projects or all projects assigned to a user
router.get("/getOverview",authenticateToken,(req,res) => {

    // fist get the projects
    let query=`SELECT p.ProjectID as 'id', p.Title as 'title', p.Description as 'description' FROM projects as p`;
    const filter = req.query.filter;
    let values = [];
    // if the user is not a manager, we need to filter the projects by the user
    if (filter !== "all") {
        query += ` WHERE EXISTS (SELECT pu.ProjectID, pu.UserID FROM project_users AS pu WHERE pu.UserID=? AND pu.ProjectID=p.ProjectID)`;
        values = [filter];
    }

    // second query to get the employees on all of the projects, and if again the user is not a manager, we need to filter the employees by which projects the user is on
    let queryEmployees = `SELECT u.UserID as 'id', u.Forename as 'forename', u.Surname as 'surname'
                            FROM project_users as pu
                            INNER JOIN users as u ON pu.UserID = u.UserID
                            WHERE EXISTS (SELECT pu.ProjectID, pu.UserID FROM project_users AS pu WHERE pu.UserID=? AND pu.ProjectID=pu.ProjectID)`;
    const valuesEmployees = [filter];
    // if the user is a manager, we need to get all of the employees on all of the projects
    if (filter === "all") {
        queryEmployees += ` WHERE EXISTS (SELECT pu.ProjectID, pu.UserID FROM project_users AS pu WHERE pu.ProjectID=p.ProjectID)`;
    
    }
    // get all the tasks for all of the projects the user is on, again, if they are a manager, get all the tasks for all the projects
    let queryTasks = `SELECT t.TaskID as 'id', t.Title as 'title', t.AssigneeID as 'assignee', t.Status as 'status', t.Priority as 'priority', t.HoursRequired as 'hoursRequired', t.Deadline as 'deadline'
                        FROM tasks as t 
                        WHERE EXISTS (SELECT pu.ProjectID, pu.UserID FROM project_users AS pu WHERE pu.UserID=? AND pu.ProjectID=t.ProjectID)`;
    const valuesTasks = [filter];
    // if the user is a manager, we need to get all of the tasks for all of the projects
    if (filter === "all") {
        queryTasks += ` WHERE EXISTS (SELECT pu.ProjectID, pu.UserID FROM project_users AS pu WHERE pu.ProjectID=p.ProjectID)`;
    }

    database.query(query, values, (err, projectResults) => {
        if (err) {
            return res.status(500).send({ error: "Error fetching projects" });
        }

        database.query(queryEmployees, valuesEmployees, (err, employeeResults) => {
            if (err) {
                return res.status(500).send({ error: "Error fetching employees" });
            }

            database.query(queryTasks, valuesTasks, (err, taskResults) => {
                if (err) {
                    return res.status(500).send({ error: "Error fetching tasks" });
                }

                res.send({
                    projects: projectResults,
                    employees: employeeResults,
                    tasks: taskResults,
                });
            });
        });
    }
    );
});

// Get the IDs of all projects led by a user
router.get("/getUserLedProjects",authenticateToken,(req,res) => {
    const query=`SELECT ProjectID FROM projects WHERE projects.LeaderID=?`;
    const id = req.query.target;

    //Stop bad inputs
    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    const values = [id];
    database.query(query, values, (err, results) => {
        res.send({results: results});
    });
});

// get all tasks assigned to a user
router.get("/getUserTasks",authenticateToken,(req,res) => {
    const query=`SELECT ProjectID, AssigneeID, Title, Status, Priority, HoursRequired, Deadline, CompletionDate FROM tasks WHERE tasks.AssigneeID=?`;
    const id = req.query.target;

    //Stop bad inputs
    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    const values = [id];
    database.query(query, values, (err, results) => {
        res.send({results: results});
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



// get the different
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