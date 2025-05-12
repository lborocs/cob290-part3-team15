require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const database = require("./config/database");
const port = 4000;


app.use(express.json());

let refreshTokens = []

//You have a refresh token and want a new authToken
app.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name,userID:user.userID,role:user.role })
    res.json({ accessToken: accessToken })
  })
})

//The Page load authentication uses this
app.post('/verify', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
    if (err) {
      return res.json({ valid: false });
    }
    res.json({ valid: true });
  });
});

//This was part of the youtube template, might as well leave it here
app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
})

//Logging in...
app.post('/login', (req, res) => {
  // Authenticate User
  const reqUserID = req.body.userID
  const reqPass = req.body.pass

  const query = "SELECT PasswordHash as password, CONCAT(Forename,' ',Surname) as name, Role as role FROM users WHERE UserID=?";
  //Stop bad inputs
  if (isNaN(reqUserID) || !reqPass) {
    return res.status(400).json({ error: "Bad Request" });
  }
  const values = [reqUserID];
  database.query(query, values, async(err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }
    const dbUser = results[0];

    //Using Results from the database, compare them to the input with bcrypt (Hashing)... when i can be bothered (Plaintext right now)
    const match = (dbUser.password===reqPass);
    if (match) {
      const user = { name: dbUser.name , userID: reqUserID , role: dbUser.role }
      const accessToken = generateAccessToken(user)
      const refreshToken = jwt.sign(user, process.env.REFRESH)
      refreshTokens.push(refreshToken)
      res.json({ accessToken: accessToken, refreshToken: refreshToken })
    }
    else{
      return res.status(401).json({ error: "Password is incorrect" });
    }
  });
})

//authToken with packaged details + 1 hour expire time (Can be refreshed though)
function generateAccessToken(user) {
  return jwt.sign(user, process.env.SECRET_TOKEN, { expiresIn: '1h' })
}

app.listen(port, "0.0.0.0", () => {
    console.log(`App listening on port ${port}`);
});