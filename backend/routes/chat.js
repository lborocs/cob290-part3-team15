const express = require("express");
const router = express.Router();
const database = require("../config/database");

router.get("/getMessage",(req,res) => {
    const query="SELECT Sender,Recipient,Content FROM direct_messages WHERE MessageID=?";
    const id = req.query.id

    //Stop bad inputs
    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    const values = [id];
    database.query(query, values, (err, results) => {
        res.send({results: results})
    })
});

router.get("/getDirectMessages",(req,res) => {
    const query="SELECT direct_messages.messageID as messageID, users.Name as name,direct_messages.Content as content,direct_messages.Sender as user FROM direct_messages LEFT JOIN users ON direct_messages.Sender=users.UserID WHERE (Sender=? AND Recipient=?) OR (Sender=? AND Recipient=?)";
    const id = req.query.id;
    const target = req.query.target;

    //Stop bad inputs
    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    const values = [id,target,target,id];
    database.query(query, values, (err, results) => {
        res.send({results: results})
    })
});

/* Old Test Stuff, May be easier to understand
router.get("/addFive",(req,res) => {
    const inputValue = req.query.number;
    const number = parseFloat(inputValue);
    const result = isNaN(number) ? 5 : number + 5;
    res.json({result:result});
});*/

module.exports = router;