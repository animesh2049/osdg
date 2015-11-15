//require necessary modules
var http = require('http');
var express = require('express');
var socketIO = require("socket.io");

//initialize our application
var app = express();
var server = http.createServer(app).listen(55555);
var io = socketIO.listen(server);
var mainIp = '10.1.40.93';
var mainId = '';
var connectedConnections = [];
//settings
var settings = {
  'view_directory': './',
  'stylesheets_directory': './css',
  'javascript_directory': './js'
}

app.get('/', function(request, response){
  response.sendfile('index.html');
});

app.get('/*.css', function(request, response){
  response.sendfile(settings.stylesheets_directory + request.originalUrl);
});

app.get('/*.js', function(request, response){
  response.sendfile(settings.javascript_directory + request.originalUrl);
});

io.sockets.on('connection', function(client){

  var address = client.handshake.address.address;
  
  if(connectedConnections[address] == undefined){
    connectedConnections[address] = client.id;
  }
  // if(address == mainIp){
  //   console.log(client.id)
  //   mainId = client.id;
  // }

  // console.log(io.settings.store.clients[mainId]);  

  // alert("Joining message");
  client.on('join', function(data, cb){
    console.log(data + " joined");
    // console.log("Setting the name as " + data);
    client.set('Name', data); 
    // client.broadcast.emit('message', { message: data + " joined", nickname: "Server side msg" });
    cb();
  });

  //Joining message
  client.on('message', function(data, cb){

    var clientIp = this.handshake.address.address;
    var sendingIp = data.ip;
    console.log("The sending ip is:=================");
    console.log(sendingIp)

    client.get('Name', function(err, Name){
      console.log("The name is : ")
      console.log(Name);
      // console.log(io.to(mainId));
      // io.settings.store.clients[mainId].send('message', { message: data, Name: Name })
      io.sockets.socket(connectedConnections[sendingIp]).emit('message', {'message': data.message,'ip': data.ip, 'Name': Name});  
      // io.to(mainId).emit('message', { message: data, Name: Name});
    });
  });

});
//UDP