const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

let count = 0;
let users = [];

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  // console.log('a user has connected');
  count ++;
  const userName = `user${count}`;
  socket.data.username = userName;
  users.push(userName);
  console.log(`${socket.data.username} has connected`);

  const connectData = {
    numOfUsers: users.length,
    userName,
  }
  // io.emit('userJoined', users.length);
  io.emit('userJoined', connectData);

  //message sent/recieved
  socket.on('chat message', msg => {
    console.log(`${socket.data.username} sent a message`);
    io.emit('chat message', msg);
  });

  //window closed - this doesn't actually work...
  io.on('closed', (x) => {
    console.log('closed')
    console.log(x)
  })

  const _id = socket.id;
  socket.on('disconnect', () => {
    console.log('someone disconnected');
    // console.log(socket.data.username);
    users = users.filter( x => x !== socket.data.username );
    // console.log(users)
    io.emit('userLeft', users.length);
  })

  // console.log(io.sockets.adapter.rooms)
  console.log('-----------------  --------------------------');
  // console.log(io.eio.clients.length)
  console.log(users)
  // console.log(socket.data.username)
  console.log('-----------------  --------------------------');



});



http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);

});
