const express = require("express");
const router = express.Router();
const database = require("../config/database");
const {authenticateToken} = require("../exports/authenticate");

router.use(express.json()) // for parsing 'application/json'

// Get the IDs of all projects led by a user
router.get("/getLedProjects",authenticateToken,(req,res) => {
    const query=`SELECT ProjectID FROM projects WHERE projects.LeaderID=?`;
    const id = req.user.userID;

    //Stop bad inputs
    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    const values = [id];
    database.query(query, values, (err, results) => {
        res.send({results: results});
    });
});

module.exports = router;