const path = require('path');
var http = require('http');
const socketIO = require('socket.io');
const {
  generatemessage,
  generatelocationmessage
} = require('./utils/message');

//using express middleware
const express = require('express');

//public folder is used to store the static client files
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
app.use(express.static(publicPath));
var server = http.createServer(app);
//thorugh io we can emit or listen events of web sockets
var io = socketIO(server);

//Code Goes here
//Helps to register on event listener
io.on('connection', (socket) => {
  console.log('New user Connected');

  socket.emit('newmessage', generatemessage('Admin', 'Welcome to the chat'));

  //listener
  socket.on('createmessage', (message, callback) => {
    console.log(message);
    //io.emit will send data to all users & socket.emit to particular user
    io.emit('newmessage', generatemessage(message.from, message.text));
    callback();

  });

  socket.on('createlocationmessage', (coords) => {
    io.emit('newlocationmessage', generatelocationmessage('Admin', coords.latitude, coords.longitude))
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});



//app will listen on port localhost port 3000
server.listen(port, () => {
  console.log(`Server is up on ${port}...`);
});
