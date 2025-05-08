const jwt = require('jsonwebtoken');

//LOGIN
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)
  
  jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
      if (err) return res.sendStatus(401)
      req.user = user
      next()
  })
}

//Sockets
function authenticateSocket(socket, next) {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error('No token provided'));
  }

  jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
    if (err) {
      return next(new Error('Invalid or expired token'));
    }

    socket.user = user;
    next();
  });
}

module.exports = {authenticateToken,authenticateSocket};