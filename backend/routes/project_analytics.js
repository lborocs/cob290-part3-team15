const express = require("express");
const router = express.Router();
const database = require("../config/database");
const {authenticateToken} = require("../exports/authenticate");

router.use(express.json()) // for parsing 'application/json'


// Get the quick statistics for overview
router.get("/getOverviewQuickStatistics",authenticateToken,(req,res) => {

    // If user is not manager, filter stats by led projects and users on led projects
    const leaderFilter = req.user.role === 'Manager' ? '' : `WHERE LeaderID = ${req.user.userID}`;
    const leaderUsers = req.user.role === 'Manager' ? ` (SELECT COUNT(UserID) FROM users) ` : ` (SELECT COUNT(DISTINCT pu.UserID) FROM project_users AS pu INNER JOIN projects AS p ON pu.ProjectID = p.ProjectID ${leaderFilter}) `;

    const query = `SELECT
                            (SELECT COUNT(ProjectID) FROM projects ${leaderFilter}) AS 'projects',
                            ${leaderUsers} AS 'employees',
                            (SELECT COUNT(t.TaskID) FROM tasks AS t INNER JOIN projects AS p ON t.ProjectID = p.ProjectID ${leaderFilter}) AS 'tasks'`;

    database.query(query, [], (err, results) => {
        if (err) {
            return res.status(500).send({error: "Error fetching overview quick statistics"});
        }

        res.send({results: results});
    });
});

// Get the quick statistics for a project
router.get("/getQuickStatistics",authenticateToken,(req,res) => {
    const query = `SELECT
                           (SELECT COUNT(TaskID) FROM tasks WHERE ProjectID=?) AS 'tasks',
                           (SELECT COUNT(TaskID) FROM tasks WHERE ProjectID=? AND Status='Completed') AS 'completed',
                           (SELECT COUNT(TaskID) FROM tasks WHERE ProjectID=? AND Status!='Completed' AND DATEDIFF(CURDATE(), Deadline)>0) AS 'overdue'`;
    const projectId = req.query.projectId;

    if (!projectId) {
        return res.status(400).send({ error: "Project ID is required" });
    }

    database.query(query, [projectId, projectId, projectId], (err, results) => {
        if (err) {
            return res.status(500).send({error: "Error fetching project quick statistics"});
        }

        res.send({results: results});
    });
});

// Get the full details of all projects the user is on including ones they are team leaders of
router.get("/getProjects",authenticateToken,(req,res) => {
    // this query is never called for the manager, use the getProjectsByLeader route instead
    
    let query = `SELECT p.ProjectID as 'id', p.Title as 'title', p.Description as 'description', p.LeaderID as 'leader'
                 FROM projects as p`;
    let values = [];

    // if they are an employee, get all projects they are on
    if (req.user.role === "Employee") {
        query += ` INNER JOIN project_users as pu ON pu.ProjectID = p.ProjectID
                    WHERE pu.UserID = ?`;
        values = [req.user.userID];
    }

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
    let query = `SELECT p.ProjectID as 'id', p.Title as 'title', p.Description as 'description'
                 FROM projects as p`;
    if (req.user.role === "Manager") {
        // No filter for managers, they get all projects
    } else {
        query += ` WHERE p.LeaderID = ?`;
    }
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


// Get tasks for each member on the project list, filtered by project if selected
router.get("/getOverviewTeamMembers",authenticateToken,(req,res) => {

    let values = [];
    let filterByLeaderText = 'WHERE'
    let filterAppendText = '';
    if (req.user.role !== 'Manager') {
        filterByLeaderText = 'INNER JOIN projects AS p ON tasks.ProjectID = p.ProjectID WHERE p.LeaderID = ? AND';
        filterAppendText = 'WHERE EXISTS (SELECT pu.UserID, pu.ProjectID FROM project_users AS pu INNER JOIN projects AS p on pu.ProjectID = p.ProjectID WHERE p.LeaderID = ? AND u.UserID = pu.UserID)';
        values = [req.user.userID, req.user.userID, req.user.userID, req.user.userID];
    }

    const query = `SELECT
                         u.UserID AS 'id', u.Forename as 'forename', u.Surname as 'surname',
                         (SELECT COUNT(TaskID) FROM tasks ${filterByLeaderText} AssigneeID = u.UserID) AS 'tasksGiven',
                         (SELECT COUNT(TaskID) FROM tasks ${filterByLeaderText} AssigneeID = u.UserID AND Status != 'Completed') AS 'tasksDue',
                         (SELECT COUNT(TaskID) FROM tasks ${filterByLeaderText} AssigneeID = u.UserID AND Status = 'Completed') AS 'tasksCompleted'
                     FROM users AS u ${filterAppendText}`;

    database.query(query, values, (err, employeeResults) => {
        if (err) {
            return res.status(500).send({error: "Error fetching employees"});
        }

        res.send({employees: employeeResults});
    });
});


// Get member list info for a specific project
router.get("/getProjectTeamMembers",authenticateToken,(req,res) => {
    const query = `SELECT
                             u.UserID AS 'id', u.Forename as 'forename', u.Surname as 'surname',
                             (SELECT COUNT(TaskID) FROM tasks WHERE AssigneeID = u.UserID AND ProjectID = ?) AS 'tasksGiven',
                             (SELECT COUNT(TaskID) FROM tasks WHERE AssigneeID = u.UserID AND ProjectID = ? AND Status != 'Completed') AS 'tasksDue',
                             (SELECT COUNT(TaskID) FROM tasks WHERE AssigneeID = u.UserID AND ProjectID = ? AND Status = 'Completed') AS 'tasksCompleted'
                         FROM users AS u
                         WHERE EXISTS (SELECT UserID, ProjectID FROM project_users WHERE ProjectID = ? AND u.UserID = UserID)`;
    const id = req.query.id;
    if (!id) {
        return res.status(400).send({ error: "Project ID is required" });
    }

    database.query(query, [id, id, id, id], (err, employeeResults) => {
        if (err) {
            return res.status(500).send({error: "Error fetching project team members"});
        }

        res.send({employees: employeeResults});
    });
});



// TODO remove
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


// Get info for a project card
router.get("/getProjectCardInfo",authenticateToken,(req,res) => {
    const query = `SELECT Title as 'title', Description as 'description' FROM projects WHERE ProjectID = ?`;
    const id = req.query.id;
    if (!id) {
        return res.status(400).send({ error: "Project ID is required" });
    }

    database.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).send({error: "Error fetching project card data"});
        }

        res.send({results: results});
    });
});

// Get the tasks on a given project or all tasks for the overview
router.get("/getTasks",authenticateToken,(req,res) => {
    let query = `SELECT t.TaskID as 'id', t.Title as 'title', u.Forename AS 'assigneeForename', u.Surname AS 'assigneeSurname', t.ProjectID as 'project', t.Status as 'status', t.Priority as 'priority', t.Deadline as 'deadline'
                        FROM tasks as t INNER JOIN users AS u ON t.AssigneeID = u.UserID`;
    let values = [];

    // Filter only tasks on projects led by this user for team leaders
    if (req.user.role !== 'Manager') {
        // this is ONLY for team leaders, what about employees?
        query += ` INNER JOIN projects as p ON p.ProjectID = t.ProjectID WHERE p.LeaderID=?`;
        values.push(req.user.userID);
    }

    // Filter by project if a project is selected (yes I'm comparing a string that says null)
    if (req.query.id !== 'null') {
        if (req.user.role === 'Manager') {
            query += ` INNER JOIN projects as p ON p.ProjectID = t.ProjectID WHERE p.ProjectID=?`
        }
        else {
            query += ` AND p.ProjectID = ?`
        }
        values.push(req.query.id);
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



// Get the employees in order of most hours contributed to the project
router.get("/getTopContributors",authenticateToken,(req,res) => {
    const query=`SELECT
                        u.Forename as 'forename', u.Surname as 'surname',
                        SUM(CASE WHEN t.Status = 'Completed' THEN t.HoursRequired ELSE 0 END) AS hours
                    FROM users as u INNER JOIN tasks as t on u.UserID = t.AssigneeID AND t.ProjectID = ?
                    WHERE EXISTS (SELECT pu.ProjectID, pu.UserID FROM project_users AS pu WHERE pu.UserID = u.UserID and pu.ProjectID = ?)
                    GROUP BY u.UserID
                    ORDER BY hours DESC`;
    const projectId = req.query.projectId;

    database.query(query, [projectId, projectId], (err, results) => {
        if (err) {
            return res.status(500).send({ error: "Error fetching top contributors" });
        }
        res.send(results);
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

    const query = `
        SELECT 
            SUM(CASE WHEN Status = 'Completed' THEN 1 ELSE 0 END) AS completed,
            SUM(CASE WHEN Status != 'Completed' THEN 1 ELSE 0 END) AS pending
        FROM tasks
        WHERE ProjectID = ?`;

    database.query(query, [projectId], (err, results) => {
        if (err) {
            return res.status(500).send({ error: "Error fetching task completion status" });
        }

        res.send({completed: results[0].completed, pending: results[0].pending});
    });
});



// Get data for the project burndown chart
router.get("/getBurndownData", authenticateToken, (req, res) => {
    const selectedProjectId = req.query.projectId;
    if(!selectedProjectId) {
        return res.status(400).send({ error: "Project ID is required" });
    }

    // First query for the project deadline
    let deadline;
    let query = `SELECT Deadline AS deadline FROM projects WHERE ProjectID = ?`;
    database.query(query, [selectedProjectId], (err, results) => {
        if (err) {
            return res.status(500).send({ error: "Error fetching employee burndown data" });
        }

        deadline = results[0].deadline;
    });

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
                 FROM (
                          SELECT
                              date as 'date',
                              IFNULL(SUM(t.HoursRequired), 0) as 'actual'
                          FROM date_range dr
                                   LEFT JOIN tasks t
                                             ON t.CreationDate <= dr.date
                                                 AND (t.CompletionDate > dr.date OR t.CompletionDate IS NULL)
                                                 AND t.ProjectID = ?
                          GROUP BY date
                          ORDER BY date) tbl) tbl
        WHERE
            actual != prev_actual
           OR prev_actual IS NULL
        ORDER BY date
    `;

    const values = [selectedProjectId, selectedProjectId, selectedProjectId];

    database.query(query, values, (err, results) => {
        if (err) {
            return res.status(500).send({ error: "Error fetching employee burndown data" });
        }

        res.send({ results: {type: 'project', deadline: deadline, content: results} });
    });
});


module.exports = router;