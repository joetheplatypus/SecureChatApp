const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const Settings = require('./Settings.js');
const User = require('./User.js');

app.use(express.static('client'));
server.listen(Settings.port);
console.log(`Server started on port ${Settings.port}`);

io.on('connection', (socket)=> {
    socket.on('reqname', (name) => {
        if(User.nameTaken(name)) {
            socket.emit('nametaken', name);
        } else {
            socket.emit('loginsuccess', name);
            new User(name,socket);
        }
    })
    
})

