require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

//Cross Origin Error Prevention
const corsOptions = {
    origin: [process.env.IP || "http://localhost:5173"],
};
app.use(cors(corsOptions));

//Import Routes 
const chat = require("./routes/chat");

//Use Routes E.g. localhost:3000/chat/???
app.use("/chat", chat); 



app.listen(port, "0.0.0.0" ,() => {
    console.log(`Example app listening on port ${port}`);
  });