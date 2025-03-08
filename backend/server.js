const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

//Cross Origin Error Prevention
const corsOptions = {
    origin: ["http://localhost:5173"],
};
app.use(cors(corsOptions));

//Import Routes 
const chat = require("./routes/chat");

//Use Routes E.g. localhost:3000/chat/???
app.use("/chat", chat); 



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });