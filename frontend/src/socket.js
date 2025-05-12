import {io} from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = "/socket.io";
let socket = null

export const connectSocket = () => {
    if (!socket) {
        const accessToken = localStorage.getItem('accessToken');
        socket = io({auth: {token: accessToken},path:"/socket.io"});
    }
};

export const disconnectSocket = () => {
    if (socket && !(window.location.pathname.startsWith("/chat")|| window.location.pathname.startsWith("/analytics"))) {
        socket.disconnect();
        socket = null;
    }
};

export const getSocket = () => {return socket}