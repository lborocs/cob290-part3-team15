const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

//Cross Origin Error Prevention
const corsOptions = {
    origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));
app.get("/addFive",(req,res) => {
    const inputValue = req.query.number;
    const number = parseFloat(inputValue);
    const result = isNaN(number) ? 5 : number + 5;
    res.json({result:result});
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });