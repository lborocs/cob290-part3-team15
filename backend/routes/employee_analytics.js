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

// get burndown data for a project
router.get("/getBurndownData", authenticateToken, (req, res) => {
    const selectedProjectId = req.query.projectId;
    let query;
    let values;

    if(!selectedProjectId) {

        // Get burndown data for an employee's overview
        query = `
            WITH RECURSIVE date_range AS (
                SELECT
                    sort.CreationDate AS 'date'
                FROM (
                         SELECT
                             CreationDate,
                             ROW_NUMBER() over (ORDER BY CreationDate) AS 'first'
                         FROM tasks
                         WHERE AssigneeID = ?
                     ) sort
                WHERE sort.first = 1
                UNION ALL
                SELECT
                    DATE_FORMAT(DATE_ADD(date, INTERVAL 1 DAY), '%Y-%m-%d')
                FROM date_range
                WHERE DATEDIFF(date, CURDATE()) < 0
            )

            SELECT
                tbl.date,
                tbl.actual
            FROM (
                     SELECT
                         date,
                         actual,
                         LAG(actual) OVER (ORDER BY date) as 'prev_actual'
                     FROM (SELECT
                               date as 'date',
                               IFNULL(SUM(t.HoursRequired), 0) as 'actual'
                           FROM date_range dr
                                    LEFT JOIN tasks t
                                              ON t.CreationDate <= dr.date
                                                  AND (t.CompletionDate > dr.date OR t.CompletionDate IS NULL)
                                                  AND t.AssigneeID = ?
                           GROUP BY date
                           ORDER BY date) tbl) tbl
            WHERE
                actual != prev_actual
               OR prev_actual IS NULL
            ORDER BY date
            `;

        values = [req.user.userID, req.user.userID];
    }
    else {

        // Get burndown data for an employee for a specific project
        query = `
            WITH RECURSIVE date_range AS (
                SELECT
                    StartDate AS 'date'
                FROM projects
                WHERE ProjectID = ?
                UNION ALL
                SELECT
                    DATE_FORMAT(DATE_ADD(date, INTERVAL 1 DAY), '%Y-%m-%d')
                FROM date_range
                WHERE DATEDIFF(date, (SELECT Deadline FROM projects WHERE ProjectID = ?)) < 0
            )

            SELECT
                tbl.date,
                tbl.actual
            FROM (
                     SELECT
                         date,
                         actual,
                         LAG(actual) OVER (ORDER BY date) as 'prev_actual',
                         ROW_NUMBER() OVER (ORDER BY date DESC) as 'last_row'
                     FROM (
                              SELECT
                                  date as 'date',
                                  IFNULL(SUM(t.HoursRequired), 0) as 'actual'
                              FROM date_range dr
                                       LEFT JOIN tasks t
                                                 ON t.CreationDate <= dr.date
                                                     AND (t.CompletionDate > dr.date OR t.CompletionDate IS NULL)
                                                     AND t.AssigneeID = ?
                                                     AND t.ProjectID = ?
                              GROUP BY date
                              ORDER BY date) tbl) tbl
            WHERE
                actual != prev_actual
               OR prev_actual IS NULL
               OR last_row = 1
            ORDER BY date
        `;

        values = [selectedProjectId, selectedProjectId, req.user.userID, selectedProjectId];
    }

    database.query(query, values, (err, results) => {
        if (err) {
            return res.status(500).send({ error: "Error fetching employee burndown data" });
        }

        res.send({ results: {type: selectedProjectId ? 'project' : 'overview', content: results} });
    });
});

// get week-by-week stats for the work statistics pane
router.get("/getWorkStatistics", authenticateToken, (req, res) => {
    // if the parameter selectedProjectId is not null, then we need to filter the tasks by project
    const selectedProjectId = req.query.projectId;

    let query = `
        WITH last_4_weeks AS (
            SELECT
                DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL (WEEKDAY(CURDATE())) DAY) - INTERVAL (7 * (n - 1)) DAY, '%Y-%m-%d') AS weekStart,
                DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL (WEEKDAY(CURDATE()) - 6) DAY) - INTERVAL (7 * (n - 1)) DAY, '%Y-%m-%d') AS weekEnd
            FROM (SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) AS weeks
        )
        SELECT
            weekStart,
            weekEnd,
            COUNT(CASE WHEN CompletionDate <= weekEnd THEN 1 END) as 'completed',
            SUM(CASE WHEN CompletionDate <= weekEnd THEN HoursRequired ELSE 0 END) as 'hours',
            COUNT(CASE WHEN CreationDate >= weekStart THEN 1 END) as 'assigned',
            COUNT(CASE WHEN Deadline BETWEEN weekStart AND weekEnd AND (CompletionDate > Deadline OR CompletionDate IS NULL) THEN 1 END) as 'overdue'
        FROM last_4_weeks lw
                 LEFT JOIN tasks t
                           ON t.CreationDate <= lw.weekEnd
                               AND (t.CompletionDate >= lw.weekStart OR t.CompletionDate IS NULL)
                               AND t.AssigneeID = ?
    `;

    const values = [req.user.userID];

    // If projectId is provided, add a filter for the specific project
    if (selectedProjectId && selectedProjectId !== 'null') {
        query += ` AND t.ProjectID = ?`;
        values.push(selectedProjectId);
    }

    query += `
        GROUP BY lw.weekStart, lw.weekEnd
        ORDER BY lw.weekStart DESC;
    `;

    database.query(query, values, (err, results) => {
        if (err) {
            return res.status(500).send({ error: "Error fetching employee week-by-week stats" });
        }

        res.send({ results: results });
    });
});


//getting all projects the employee contributed to, and returning for each proct the number of tasks completed due and overdue
router.get("/getAllEmployeeProjects",authenticateToken,(req,res) => {
    const projectId = req.query.projectId;
    let projectFilter = '';
    const values = [req.user.userID, req.user.userID, req.user.userID, req.user.userID];
    // Filter for selected project if not overview
    if (projectId) {
        projectFilter = ' AND pu.ProjectID = ? ';
        values.push(projectId);
    }
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
                        ${projectFilter}
                        GROUP BY p.ProjectID`;

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



// Get all tasks assigned to a user
router.get("/getUserTasks", authenticateToken, (req, res) => {
    let query = `SELECT t.TaskID as 'id', t.Title as 'title', p.Title as 'projectTitle', t.Status as 'status', t.Priority as 'priority', t.Deadline as 'deadline'
                 FROM tasks as t INNER JOIN projects AS p ON t.ProjectID = p.ProjectID
                 WHERE t.AssigneeID = ?`;

    const selectedProjectId = req.query.id;
    let values = [req.user.userID];

    // If projectId is provided, fetch tasks for the specific project
    if (selectedProjectId !== 'null') {
        query += ` AND t.ProjectID = ?`;
        values = [req.user.userID, selectedProjectId];
    }

    database.query(query, values, (err, taskResults) => {
        if (err) {
            return res.status(500).send({ error: "Error fetching tasks" });
        }

        res.send({tasks: taskResults});
    });
 });

 // get the project name by id
router.get("/getProjectById", authenticateToken, (req, res) => {
    const query = `SELECT p.Title as 'title'
                        FROM projects as p WHERE p.ProjectID = ?`;

    const values = [req.query.projectId];

    database.query(query, values, (err, projectResults) => {
        if (err) {
            return res.status(500).send({ error: "Error fetching project" });
        }

        if (!projectResults || projectResults.length === 0) {
            return res.send({project: []});
        }

        res.send({project: projectResults[0]});
    });
}
);



module.exports = router;