const db = require('./firebase.config');
const SessionStore = require('./sessionStorage');
const messageStore = require('./messageStore');
const shortid = require('shortid');
const httpServer = require('http').createServer();
const PORT = 3000;
const io = require('socket.io')(httpServer, {
    cors: {
        origin: 'http://localhost:8000'
    },
});


db.collection("users").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().username}`);
    });
});


io.use(async (socket, next) => {
    const sessionID = socket.handshake.auth.sessionID;

    if(sessionID) {
        // const session = SessionStore.findSession(sessionID);
        try {
            const sessionDoc = await db.collection('users').doc(sessionID).get();

            const session = sessionDoc.data();
            if(session) {
                socket.sessionID = sessionID;
                socket.userID = session.userID;
                socket.username = session.username;
                return next();
            }
        } catch(err) {
            console.error('Reading session error with:' + err);
        }
    }

    const username = socket.handshake.auth.username;
    
    if(!username) {
        console.error('invalid username');
        return next(new Error("Invalid username"));
    }

    socket.sessionID = shortid.generate();
    socket.userID = shortid.generate();
    socket.username = username;

    next();
});

io.on('connection', async (socket) => {
    console.log('a user connected');

    //save persist session

    db.collection('users').doc(socket.sessionID).set({
        userID: socket.userID,
        username: socket.username,
        connected: true,
    }).catch(err => {
        console.log("Adding data error: " + err);
    })

    // SessionStore.saveSession(socket.sessionID, {
    //     userID: socket.userID,
    //     username: socket.username,
    //     connected: true,
    // })

    // emit session detail
    socket.emit('session', {
        sessionID : socket.sessionID,
        userID: socket.userID,
    })

    // join the userID room
    socket.join(socket.userID);

    // notify existing users
    socket.broadcast.emit('user connected', {
        userID: socket.userID,
        username: socket.username,
    });

    //fetch existing users
    const users = [];
    const messagesPerUser = new Map();

    //fetch all users from firebase

    messageStore.findMessagesForUser(socket.userID).forEach((message) => {
        console.log(message);
        const { from, to } = message;
        const otherUser = socket.userID === from ? to: from;
        if (messagesPerUser.has(otherUser)) {
            messagesPerUser.get(otherUser).push(message);
        } else {
            messagesPerUser.set(otherUser, [message]);
        }
    })

    try {
        const usersDOC = await db.collection('users').get();
        usersDOC.forEach(doc => {
            let session = doc.data();
            users.push({
                userID: session.userID,
                username: session.username,
                connected: session.connected,
                messages: messagesPerUser.get(session.userID) || [],
            })
        })

        socket.emit('users', users);
    } catch(err) {
        console.error('fetch users error', err);
    }

    // SessionStore.findAllSessions().forEach((session) => {
    //     users.push({
    //         userID: session.userID,
    //         username: session.username,
    //         connected: session.connected,
    //         messages: messagesPerUser.get(session.userID) || [],
    //     })
    // })

    // forward the private message to the right receipient (and to the other tab of sender)
    socket.on('private message', ({content, to}) => {
        const message = {
            content,
            from: socket.userID,
            to,
        }
        socket.to(to).to(socket.userID).emit('private message', message);

        messageStore.saveMessage(socket.userID, message);
        messageStore.saveMessage(to, message);
    });


    // notify users upon disconnected
    socket.on('disconnect', async () => {
        const MatchingSockets = await io.in(socket.userID).allSockets();
        const isDisconnected = MatchingSockets.size === 0;
        if(isDisconnected) {
            socket.broadcast.emit('user disconnected', socket.userID);
            // SessionStore.saveSession(socket.sessionID, {
            //     userID: socket.userID,
            //     username: socket.username,
            //     connected: false,
            // })

            db.collection('users').doc(socket.sessionID).set({
                userID: socket.userID,
                username: socket.username,
                connected: false,
            }).catch(err => {
                console.error("Update disconnect status fail: " +  err);
            });
        }
    });

});


httpServer.listen(3000, () => {
    console.log(`Server listening on port ${PORT}`);
})

