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
const alertMessage = (userId,target,message,type,notify) => {
    if(notify){notificationAlert(userId,target,message,type)};
    if (connectedClients[userId]) {
        connectedClients[userId].forEach(socketId => {
            io.to(socketId).emit('newMessage', {message:"New Message!"});
        });
        console.log(`Pinged user ${userId} on ${connectedClients[userId].length} devices.`);
    } else {
        console.log(`User ${userId} is not connected.`);
    }
};

// Ping a user on all active devices
const alertEdit = (userId,targetID,messageID,type,content) => {
    if (connectedClients[userId]) {
        connectedClients[userId].forEach(socketId => {
            io.to(socketId).emit('editMessage', {targetID:targetID,messageID:messageID,type:type,content:content,timestamp: new Date()});
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
            io.to(socketId).emit('selfStatus', {status:status});
        });
        console.log(`Self Status Ping to user ${userId} on ${connectedClients[userId].length} devices.`);
    } else {
        console.log(`User ${userId} is not connected.`);
    }
};

const notificationAlert = (userId,target,message,type) => {
    if (connectedClients[userId]) {
        connectedClients[userId].forEach(socketId => {
            io.to(socketId).emit('notification', { message: message, target:target, type:type });
        });
    }
} 

// Ping all users who know the user about their status (Cross-client)
const otherStatusAlert = (userId,usersToPing,status)=> {
    for (let i = 0; i < usersToPing.length; i++) {
        const pingUserId = usersToPing[i];
        if (connectedClients[pingUserId]) {
            connectedClients[pingUserId].forEach(socketId => {
                io.to(socketId).emit('otherStatus', {status:status,target:userId,timestamp: new Date()});
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


module.exports = { setIo, getConnectedClients, addUser, removeUser,alertMessage,alertEdit,isEmpty,selfStatusAlert,otherStatusAlert,getConnectedCount,getUserId};
