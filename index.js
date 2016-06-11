const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Client = require('node-rest-client').Client;
const cli = new Client();
const entrypoint = "http://192.168.220.127/api/newdeveloper/"

function getStatus(fn){
  cli.get(entrypoint+"lights", (data) => {
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
    console.log(data.hsl);;
    const [h, s, l] = data.hsl;

    const put_color = {};
    put_color.on = true;
    if(l < 0.2){
      put_color.bri = 1;
      put_color.sat = 0;
    }else{
      put_color.bri = 0|(l * 254);
      if(l > 0.8){
        put_color.sat = 0;
      }else{
        put_color.sat = 0|(s * 254);
        put_color.hue = 0|(h * 25565);
      }
    }
        put_color.bri = 0|(l * 254);
        put_color.sat = 0|(s * 254);
        put_color.hue = 0|(h * 25565);
    console.log(entrypoint+"groups/1/action", JSON.stringify(put_color));

    const url = "http://aizawa/api/newdeveloper/groups/1/action";
    cli.put(url, {data: put_color}, (data)=>{
      console.log("error", data);
    });
  });
});

process.on('uncaughtException', function (err){
  console.error(err);
});
