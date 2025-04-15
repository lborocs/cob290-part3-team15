import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = "http://localhost:8080";
let socket = null

export const connectSocket = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!socket && window.location.pathname.startsWith("/chat")) {
        socket = io(URL,{auth: {token: accessToken}});
        console.log("Socket connected on /chat");
    }
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
        console.log("Socket disconnected");
    }
};

export const getSocket = () => {return socket}