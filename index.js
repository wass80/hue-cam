const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const RegClient = require('npm-registry-client')
const cli = new RegClient({log: null});
const entrypoint = "http://aizawa/api/newdeveloper/"

function getStatus(fn){
  cli.get(entrypoint+"lights", {}, (error, data) => {
    fn(data);
  });
}
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

http.listen(23005, () => {
  console.log('listening on *:23005');
});

io.on('connection', (socket) => {
  console.log('connected');
  socket.on('light_data', (data) => {
    console.log(data);;
    getStatus((status)=>{
        socket.emit('light_status', status)
    });
  });
});

