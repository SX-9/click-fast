const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });
const users = [];

app.get('/', (req, res) => res.sendFile(__dirname + '/lobby.html'));
io.on("connection", (socket) => {
    let { id } = socket;
    users.push({
        id: socket.id,
        score: 0,
    });
    io.emit('users', users.sort((a, b) => a.score - b.score).slice(0, 10));
    socket.on('disconnect', () => {
        let index = users.findIndex(el => el.id === id);
        if (index === -1) return;
        users.splice(index, 1);
        io.emit('users', users.sort((a, b) => a.score - b.score).slice(0, 10));
    });
    socket.on('add', () => {
        let index = users.findIndex(el => el.id === socket.id);
        if (index === -1) return;
        users[index].score++;
        io.emit('users', users.sort((a, b) => a.score - b.score).slice(0, 10));
    });
});

httpServer.listen(process.env.PORT, () => console.log('http://localhost:' + process.env.PORT));
