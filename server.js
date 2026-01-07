const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let players = {};

io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);
    
    // Create new player entry
    players[socket.id] = { x: 0, y: 0, z: 0, rotation: 0 };

    // Tell everyone about the new player
    io.emit('updatePlayers', players);

    // When a player moves, update their data
    socket.on('move', (data) => {
        if (players[socket.id]) {
            players[socket.id] = data;
            socket.broadcast.emit('updatePlayers', players);
        }
    });

    socket.on('disconnect', () => {
        delete players[socket.id];
        io.emit('updatePlayers', players);
    });
});

http.listen(3000, () => console.log('Server running on port 3000'));
