import { io } from 'socket.io-client';

const URL = 'http://localhost:3000';
const socket = io(URL, { autoConnect: false });

socket.on('connect_error', (err) => {
    if(err.message === 'invalid username') {
        
    }
})

socket.onAny((event, ...args) => {
    console.log(event, args);
});

export default socket;
