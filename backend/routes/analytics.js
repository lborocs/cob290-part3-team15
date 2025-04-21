const express = require("express");
const router = express.Router();
const database = require("../config/database");
const {authenticateToken} = require("../exports/authenticate");

router.use(express.json()) // for parsing 'application/json'

// Get the full details of all projects or all projects assigned to a user
router.get("/getProjects",authenticateToken,(req,res) => {
    let query=`SELECT p.ProjectID as 'id', p.Title as 'title', p.Description as 'description' FROM projects as p`;
    const filter = req.query.filter;
    let values = [];

    if (filter !== "all") {
        query += ` WHERE EXISTS (SELECT pu.ProjectID, pu.UserID FROM project_users AS pu WHERE pu.UserID=? AND pu.ProjectID=p.ProjectID)`;
        values = [filter];
    }

    database.query(query, values, (err, results) => {
        res.send({results: results});
    });
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

// Get all tasks assigned to a user
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

module.exports = router;