import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = "/socket.io";
let socket = null

export const connectSocket = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!socket) {
        socket = io({auth: {token: accessToken},path:"/socket.io"});
        console.log("Socket connected on /chat");
    }
};

export const disconnectSocket = () => {
    if (socket && !(window.location.pathname.startsWith("/chat")|| window.location.pathname.startsWith("/analytics"))) {
        socket.disconnect();
        socket = null;
        console.log("Socket disconnected");
    }
};

export const getSocket = () => {return socket}