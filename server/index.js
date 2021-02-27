const httpServer = require('http').createServer();
const PORT = 3000;
const io = require('socket.io')(httpServer, {
    cors: {
        origin: 'http://localhost:8000'
    },
});

io.use((socket, next) => {
    const username = socket.handshake.auth.username;
    if(!username) {
        return next(new Error("Invalid username"));
    }
    socket.username = username;
    next();
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.broadcast.emit('user connected', {
        userID: socket.id,
        username: socket.username,
    })
    const users = [];
    for(let [id, socket] of io.of("/").sockets) {
        users.push({
            userID: id,
            username: socket.username,
        });
    }
    socket.emit('users', users);

    socket.on('private message', ({content, to}) => {
        console.log('private message');
        socket.to(to).emit('private message', {
            content,
            from: socket.id,
        })
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

});


httpServer.listen(3000, () => {
    console.log(`Server listening on port ${PORT}`);
})

