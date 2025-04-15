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

// Ping a user about their own status (Cross-client)
const selfStatusAlert = (userId,status) => {
    if (connectedClients[userId]) {
        connectedClients[userId].forEach(socketId => {
            io.to(socketId).emit('selfStatus', { message: `Pinged user ${userId} - Self Status!`,status:status});
        });
        console.log(`Self Status Ping to user ${userId} on ${connectedClients[userId].length} devices.`);
    } else {
        console.log(`User ${userId} is not connected.`);
    }
};

// Ping all users who know the user about their status (Cross-client)
const otherStatusAlert = (usersToPing,status)=> {
    for (let i = 0; i < usersToPing.length; i++) {
        const pingUserId = usersToPing[i];
        if (connectedClients[pingUserId]) {
            connectedClients[pingUserId].forEach(socketId => {
                io.to(socketId).emit('otherStatus', { message: `Pinged user ${pingUserId} - Other Status!`,status:status});
            });
            console.log(`Other Status Ping to user ${pingUserId} on ${connectedClients[pingUserId].length} devices.`);
        }
    }
}

const isEmpty = () => {
    return Object.keys(connectedClients).length === 0;
};

const getConnectedCount = (userId) => {
    if (connectedClients[userId]) {
        return connectedClients[userId].length;
    }
    return 0; //No Users connected
};

const getUserId = (socketId) => {
    for (let userId in connectedClients) {
        if (connectedClients[userId].includes(socketId)) {
            return userId;
        }
    }
    return null; //User Not Found
}


module.exports = { setIo, getConnectedClients, addUser, removeUser,alertMessage,isEmpty,selfStatusAlert,otherStatusAlert,getConnectedCount,getUserId};
