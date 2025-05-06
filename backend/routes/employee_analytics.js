const express = require("express");
const router = express.Router();
const database = require("../config/database");
const {authenticateToken} = require("../exports/authenticate");

router.use(express.json()) // for parsing 'application/json'

// Get the full details of all projects or all projects assigned to a user
router.get("/getEmployeeProjects",authenticateToken,(req,res) => {

    // first get the projects
    let query = `SELECT p.ProjectID as 'id', p.Title as 'title', p.Description as 'description'
                 FROM projects as p`;
    let values = [];
    // if the user is not a manager, we need to filter the projects by the user
    if (req.user.role !== "Manager") {
        query += ` WHERE EXISTS (SELECT pu.ProjectID, pu.UserID FROM project_users AS pu WHERE pu.UserID=? AND pu.ProjectID=p.ProjectID)`;
        values = [req.user.userID];
    }

    database.query(query, values, (err, projectResults) => {
        if (err) {
            return res.status(500).send({error: "Error fetching projects"});
        }

        res.send({projects: projectResults});
    });
});

// Query to get the employees on all of the projects or all projects led by this user
router.get("/getOverviewEmployees",authenticateToken,(req,res) => {
    let query = `SELECT u.UserID as 'id', u.Forename as 'forename', u.Surname as 'surname'
                 FROM users as u`;
    let values = [];
    // TODO this currently gets all employees on all projects the user is on regardless of if they lead that project
    // if the user is not a manager, we need to get all of the employees only on projects led by this user
    if (req.user.role !== "Manager") {
        query += ` INNER JOIN project_users as pu ON pu.UserID = u.UserID 
                   WHERE EXISTS (SELECT pu.ProjectID, pu.UserID
                               FROM project_users AS pu
                               WHERE pu.UserID = ? AND pu.ProjectID = pu.ProjectID)`;
        values = [req.user.userID];
    }

    database.query(query, values, (err, employeeResults) => {
        if (err) {
            return res.status(500).send({error: "Error fetching employees"});
        }

        res.send({employees: employeeResults});
    });
});

router.get("/getOverviewTasks",authenticateToken,(req,res) => {
    // get all the tasks for all of the projects the user is on, again, if they are a manager, get all the tasks for all the projects
    let query = `SELECT t.TaskID as 'id', t.Title as 'title', t.AssigneeID as 'assignee', t.Status as 'status', t.Priority as 'priority', t.HoursRequired as 'hoursRequired', t.Deadline as 'deadline'
                        FROM tasks as t`;
    let values = [];
    // TODO this currently shows tasks on all projects the user is on regardless of if they lead that project
    // if the user is not a manager, we need to filter only the tasks on projects they lead
    if (req.user.role !== "Manager") {
        query += ` WHERE EXISTS (SELECT pu.ProjectID, pu.UserID FROM project_users AS pu WHERE pu.UserID=? AND pu.ProjectID=t.ProjectID)`;
        values = [req.user.userID];
    }

    database.query(query, values, (err, taskResults) => {
        if (err) {
            return res.status(500).send({ error: "Error fetching tasks" });
        }

        res.send({tasks: taskResults});
    });
});

// TODO unused
// Get the IDs of all projects led by a user
router.get("/getUserLedProjects",authenticateToken,(req,res) => {
    const query=`SELECT ProjectID FROM projects WHERE projects.LeaderID=?`;
    const values = [req.user.userID];
    database.query(query, values, (err, results) => {
        res.send({results: results});
    });
});

// TODO unused
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

// TODO should filter by project too
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

module.exports = router;