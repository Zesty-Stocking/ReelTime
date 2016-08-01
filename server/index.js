// Requires
const express = require('express');
const socket = require('socket.io');
const http = require('http');

// Init
const app = express();
const server = http.createServer(app);
const io = socket.listen(server);

// Config
const PORT = process.env.PORT || 3000;

// Routes

app.use(express.static(`${__dirname}/../client`));

// Socket.io
io.on('connection', (socket) => {
  console.log('A user connected with socket id', socket.id);

  socket.on('disconnect', () => {
    console.log('A user disconnected with socket id', socket.id);
  });

  socket.on('room', function(room) {
    socket.join(room);
  });

  // Chat messaging events
  socket.on('chat message', (msg, roomId) => {
    console.log('MSG: ', msg);
    console.log('RoomID: ', roomId);

    socket.to(roomId).broadcast.emit('chat message', msg);
    // socket.broadcast.emit('chat message', msg);
  });

  // Video sync events
  socket.on('play', (time) => {
    console.log('Play command received');
    socket.broadcast.emit('play', time);
  });

  socket.on('pause', (time) => {
    console.log('Pause command received');
    socket.broadcast.emit('pause', time);
  });

  socket.on('go back', (time) => {
    console.log('Go back command received');
    socket.broadcast.emit('go back', time);
  });

  socket.on('progress', (progress) => {
    // Emits the progress of youtube video from client ReactPlayer components
    socket.broadcast.emit('progress', progress);
  });
});

server.listen(PORT);

console.log(`Express server listening on port ${PORT}`);
