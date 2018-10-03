const path = require('path');
var http = require('http');
const socketIO = require('socket.io');
const {
  generatemessage,
  generatelocationmessage
} = require('./utils/message');

const {
  isRealString
} = require('./utils/validation.js');

const {
  Users
} = require('./utils/users.js');

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

var users = new Users();
//Code Goes here
//Helps to register on event listener
io.on('connection', (socket) => {
  console.log('New user Connected');



  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateuserList', users.getUserList(params.room));
    socket.emit('newmessage', generatemessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newmessage', generatemessage('Admin', `${params.name} has joined.`));
    callback();
  });

  //listener
  socket.on('createmessage', (message, callback) => {
    var user = users.getUser(socket.id);

      if(user && isRealString(message.text)){
        io.to(user.room).emit('newmessage', generatemessage(user.name, message.text));
      }


    //io.emit will send data to all users & socket.emit to particular user
    callback();

  });

  socket.on('createlocationmessage', (coords) => {
    var user = users.getUser(socket.id);

    if(user){
      io.to(user.room).emit('newlocationmessage', generatelocationmessage(user.name, coords.latitude, coords.longitude));
    }
    
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('updateuserList', users.getUserList(user.room));
      io.to(user.room).emit('newmessage',generatemessage('Admin', `${user.name} has left`));
    }

  });
 
});



//app will listen on port localhost port 3000
server.listen(port, () => {
  console.log(`Server is up on ${port}...`);
});
