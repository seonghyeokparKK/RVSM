<<<<<<< HEAD
const io = require('socket.io')(3000);
console.log('started device servser : 3000..');

DeviceList=[];
var obj = new Object();
obj.Id = "dummy device1";
obj.description = "dummy";
DeviceList.push(obj);

// var obj = new Object();
// obj.name = "dummy device2";
// obj.description = "dummy";
// DeviceList.push(obj);

//client type
// 1: CLIENT_DEVICE
// 2: CLIENT_USER
// 0: CLIENT_ADMIN
//-1: Not defined
io.on('connection', socket => {
  var client_info = new Object();
  client_info.client_type = null;
  client_info.info = null;
  

  // either with send()
  socket.send('Hello!');
  // or with emit() and custom event names
  socket.emit('Greetings', 'identify yourself');
  // handle the event sent with socket.send()
  socket.on('ClientTypeDeclaration', (data) => {
    console.log(data);
  // or with emit() and custom event names
    client_info.client_type=data.client_type;
//  socket.emit('greetings', 'Hey!', { 'ms': 'jane' }, Buffer.from([4, 3, 3, 1]));
    if(client_info.client_type=="CLIENT_DEVICE"){
      socket.emit('DevInfo', 'Request for device information');
    }else if(client_info.client_type=="CLIENT_USER"){
      socket.emit('greetings', 'Hey!',{'ms':'data'},'its me');
    }else if(client_info.client_type=="CLIENT_ADMIN"){
      socket.emit('greetings', 'Hey!',{'ms':'data'},'its me');
    }

  });
  socket.on('disconnect', (data) => {
    console.log(data);
    console.log("\n\nDisconnected!\n\n");
    if(client_info.client_type=="CLIENT_DEVICE"){
      var FilterList = DeviceList.filter(e => e.Id === client_info.device.id);
      FilterList.forEach(f => DeviceList.splice(DeviceList.findIndex(e => e.Id === f.Id),1));
      console.log(DeviceList);
    }
  // or with emit() and custom event names
//  socket.emit('greetings', 'Hey!', { 'ms': 'jane' }, Buffer.from([4, 3, 3, 1]));
    socket.emit('command', 'some commands');
  });
  
  

  // or with emit() and custom event names
  // socket.emit('greetings123', 'Hey!', { 'ms': 'jane' }, Buffer.from([4, 3, 3, 1]));

  // handle the event sent with socket.send()
  socket.on('message', (data) => {
    console.log(data);
  // or with emit() and custom event names
//  socket.emit('greetings', 'Hey!', { 'ms': 'jane' }, Buffer.from([4, 3, 3, 1]));
    socket.emit('greetings', 'Hey!',{'ms':'data'},'its me');

  });


  socket.on('command', (data) => {
    console.log(data);
  // or with emit() and custom event names
//  socket.emit('greetings', 'Hey!', { 'ms': 'jane' }, Buffer.from([4, 3, 3, 1]));
    socket.emit('command', 'some commands');
  });

  //From user to device
  socket.on('SetParams', (data) => {
    //security, network time, sampling interval, and other operation conditions
    //initiate operation immediately
    //schedule operation at a specific time & interval
    console.log(data);
  });
  socket.on('GetParams', (data) => {
    //display current params settings of the device
    console.log(data);
  });
  socket.on('SetData', (data) => {
    //not used
    console.log(data);
  });
  socket.on('GetData', (data) => {
    //request one time data
    console.log(data);
  });
  socket.on('Reset', (data) => {
    //reset device
    console.log(data);
  });



  // From user to server
  socket.on('Record', (data) => {
    //if true, record sensor data on Database
    console.log(data);
  });
  socket.on('DevList', (data) => {
    //Display the available device list
    console.log(data);
  });
  socket.on('Query_DevList', (data) => {
    //Display the available device list
    socket.emit('DevList', DeviceList);
    console.log(data);
    console.log(DeviceList);
  });

  socket.on('join', function(room){
    console.log('Received request to join room: ' + room);
    var clientsInRoom = io.sockets.adapter.rooms[room];
    var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
    log('Room ' + room + ' now has ' + numClients + ' client(s)');

    if (numClients === 0) {
      socket.emit('The target device has left the room:', room);

      socket.join(room);
      log('Client ID ' + socket.id + ' created room ' + room);
      socket.emit('created', room, socket.id);
      console.log('room created');

    } else if (numClients <= 10) {
      log("Client ID '" + socket.id + "' joined room " + room);
      io.sockets.in(room).emit('join', room);
      socket.join(room);
      socket.emit('joined', room, socket.id);
      io.sockets.in(room).emit('ready');
      console.log('A client joined the room');
    } else { // max clients
      socket.emit('full', room);
    }
  })

  socket.on('greetings', function(data){
    // console.log('New device arrived. creating room for the device');
    console.log(data);

  // or with emit() and custom event names
//  socket.emit('greetings', 'Hey!', { 'ms': 'jane' }, Buffer.from([4, 3, 3, 1]));
    socket.emit('welcome', 'registered in the available device list');

  });
  //Belows are from devices
  socket.on('dev_info', (data) => {
    //device (re-)arrived.
    console.log('New device arrived. creating room for the device');
    console.log(data);
    var room = data.id;

    var clientsInRoom = io.sockets.adapter.rooms[room];
    var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
    console.log("Room '" + room + "' now has " + numClients + ' client(s)');

    socket.join(room);
    console.log('Client ID ' + socket.id + " created room '" + room+"'");
    socket.emit('created', room, socket.id);
    console.log('room created');
    var obj = new Object();
    obj.Id = room;
    obj.Description = data.description;
    var queriedList = DeviceList.filter(function(item){return (item.Id===obj.Id)});
    if(queriedList.length===0){
      DeviceList.push(obj);
      client_info.device = data;
    }
    

    socket.emit('welcome', 'INFO:registered in the available device list');

  });
  socket.on('dev_params', (data) => {
    //new sensor data from the device
    console.log(data);
  });
  socket.on('data', (data) => {
    //new sensor data from the device
    // serialport.write(data);
    console.log(data);
  });




  //TODO:
  //1. get command from user and transfer it.
  //2. DB:my SQL
  //* mySQL vs MongoDB- https://soojle.gitbook.io/project/requirements/undefined-2/undefined-2-1/mysql-vs-mongodb


  // handle the event sent with socket.emit()
  socket.on('salutations', (elem1, elem2, elem3) => {
    console.log(elem1, elem2, elem3);
  });
=======
const io = require('socket.io')(3000);
console.log('started device servser : 3000..');

DeviceList=[];
var obj = new Object();
obj.Id = "dummy device1";
obj.description = "dummy";
DeviceList.push(obj);

// var obj = new Object();
// obj.name = "dummy device2";
// obj.description = "dummy";
// DeviceList.push(obj);

//client type
// 1: CLIENT_DEVICE
// 2: CLIENT_USER
// 0: CLIENT_ADMIN
//-1: Not defined
io.on('connection', socket => {
  var client_info = new Object();
  client_info.client_type = null;
  client_info.info = null;
  

  // either with send()
  socket.send('Hello!');
  // or with emit() and custom event names
  socket.emit('Greetings', 'identify yourself');
  // handle the event sent with socket.send()
  socket.on('ClientTypeDeclaration', (data) => {
    console.log(data);
  // or with emit() and custom event names
    client_info.client_type=data.client_type;
//  socket.emit('greetings', 'Hey!', { 'ms': 'jane' }, Buffer.from([4, 3, 3, 1]));
    if(client_info.client_type=="CLIENT_DEVICE"){
      socket.emit('DevInfo', 'Request for device information');
    }else if(client_info.client_type=="CLIENT_USER"){
      socket.emit('greetings', 'Hey!',{'ms':'data'},'its me');
    }else if(client_info.client_type=="CLIENT_ADMIN"){
      socket.emit('greetings', 'Hey!',{'ms':'data'},'its me');
    }

  });
  socket.on('disconnect', (data) => {
    console.log(data);
    console.log("\n\nDisconnected!\n\n");
    if(client_info.client_type=="CLIENT_DEVICE"){
      var FilterList = DeviceList.filter(e => e.Id === client_info.device.id);
      FilterList.forEach(f => DeviceList.splice(DeviceList.findIndex(e => e.Id === f.Id),1));
      console.log(DeviceList);
    }
  // or with emit() and custom event names
//  socket.emit('greetings', 'Hey!', { 'ms': 'jane' }, Buffer.from([4, 3, 3, 1]));
    socket.emit('command', 'some commands');
  });
  
  

  // or with emit() and custom event names
  // socket.emit('greetings123', 'Hey!', { 'ms': 'jane' }, Buffer.from([4, 3, 3, 1]));

  // handle the event sent with socket.send()
  socket.on('message', (data) => {
    console.log(data);
  // or with emit() and custom event names
//  socket.emit('greetings', 'Hey!', { 'ms': 'jane' }, Buffer.from([4, 3, 3, 1]));
    socket.emit('greetings', 'Hey!',{'ms':'data'},'its me');

  });


  socket.on('command', (data) => {
    console.log(data);
  // or with emit() and custom event names
//  socket.emit('greetings', 'Hey!', { 'ms': 'jane' }, Buffer.from([4, 3, 3, 1]));
    socket.emit('command', 'some commands');
  });

  //From user to device
  socket.on('SetParams', (data) => {
    //security, network time, sampling interval, and other operation conditions
    //initiate operation immediately
    //schedule operation at a specific time & interval
    console.log(data);
  });
  socket.on('GetParams', (data) => {
    //display current params settings of the device
    console.log(data);
  });
  socket.on('SetData', (data) => {
    //not used
    console.log(data);
  });
  socket.on('GetData', (data) => {
    //request one time data
    console.log(data);
  });
  socket.on('Reset', (data) => {
    //reset device
    console.log(data);
  });



  // From user to server
  socket.on('Record', (data) => {
    //if true, record sensor data on Database
    console.log(data);
  });
  socket.on('DevList', (data) => {
    //Display the available device list
    console.log(data);
  });
  socket.on('Query_DevList', (data) => {
    //Display the available device list
    socket.emit('DevList', DeviceList);
    console.log(data);
    console.log(DeviceList);
  });

  socket.on('join', function(room){
    console.log('Received request to join room: ' + room);
    var clientsInRoom = io.sockets.adapter.rooms[room];
    var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
    log('Room ' + room + ' now has ' + numClients + ' client(s)');

    if (numClients === 0) {
      socket.emit('The target device has left the room:', room);

      socket.join(room);
      log('Client ID ' + socket.id + ' created room ' + room);
      socket.emit('created', room, socket.id);
      console.log('room created');

    } else if (numClients <= 10) {
      log("Client ID '" + socket.id + "' joined room " + room);
      io.sockets.in(room).emit('join', room);
      socket.join(room);
      socket.emit('joined', room, socket.id);
      io.sockets.in(room).emit('ready');
      console.log('A client joined the room');
    } else { // max clients
      socket.emit('full', room);
    }
  })

  socket.on('greetings', function(data){
    // console.log('New device arrived. creating room for the device');
    console.log(data);

  // or with emit() and custom event names
//  socket.emit('greetings', 'Hey!', { 'ms': 'jane' }, Buffer.from([4, 3, 3, 1]));
    socket.emit('welcome', 'registered in the available device list');

  });
  //Belows are from devices
  socket.on('dev_info', (data) => {
    //device (re-)arrived.
    console.log('New device arrived. creating room for the device');
    console.log(data);
    var room = data.id;

    var clientsInRoom = io.sockets.adapter.rooms[room];
    var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
    console.log("Room '" + room + "' now has " + numClients + ' client(s)');

    socket.join(room);
    console.log('Client ID ' + socket.id + " created room '" + room+"'");
    socket.emit('created', room, socket.id);
    console.log('room created');
    var obj = new Object();
    obj.Id = room;
    obj.Description = data.description;
    var queriedList = DeviceList.filter(function(item){return (item.Id===obj.Id)});
    if(queriedList.length===0){
      DeviceList.push(obj);
      client_info.device = data;
    }
    

    socket.emit('welcome', 'INFO:registered in the available device list');

  });
  socket.on('dev_params', (data) => {
    //new sensor data from the device
    console.log(data);
  });
  socket.on('data', (data) => {
    //new sensor data from the device
    // serialport.write(data);
    console.log(data);
  });




  //TODO:
  //1. get command from user and transfer it.
  //2. DB:my SQL
  //* mySQL vs MongoDB- https://soojle.gitbook.io/project/requirements/undefined-2/undefined-2-1/mysql-vs-mongodb


  // handle the event sent with socket.emit()
  socket.on('salutations', (elem1, elem2, elem3) => {
    console.log(elem1, elem2, elem3);
  });
>>>>>>> 34d41c3270d6bbe96a574e4bca312d19f4d14ee1
});