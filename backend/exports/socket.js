// socketManager.js
let io;
let connectedClients = {};

const setIo = (_io) => {
  io = _io;
};

const getConnectedClients = () => connectedClients;

const addUser = (userId, socketId) => {
    if (!connectedClients[userId]) {
        connectedClients[userId] = [];
    }
    if (!connectedClients[userId].includes(socketId)) {
        connectedClients[userId].push(socketId);
    }
    console.log(`User ${userId} added. Active sockets:`, connectedClients[userId]);
};

// Remove a user socket connection
const removeUser = (socketId) => {
    for (let userId in connectedClients) {
        connectedClients[userId] = connectedClients[userId].filter(id => id !== socketId);
        if (connectedClients[userId].length === 0) {
            delete connectedClients[userId]; // Remove user if no sockets remain
        }
    }
    console.log(`Socket ${socketId} removed. Updated users:`, connectedClients);
};

// Ping a user on all active devices
const alertMessage = (userId) => {
    if (connectedClients[userId]) {
        connectedClients[userId].forEach(socketId => {
            io.to(socketId).emit('newMessage', { message: `Pinged user ${userId}!` });
        });
        console.log(`Pinged user ${userId} on ${connectedClients[userId].length} devices.`);
    } else {
        console.log(`User ${userId} is not connected.`);
    }
};

const isEmpty = () => {
    return Object.keys(connectedClients).length === 0;
};


module.exports = { setIo, getConnectedClients, addUser, removeUser,alertMessage,isEmpty };
