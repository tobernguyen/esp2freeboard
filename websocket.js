'use strict';

let handler = (req, res) => {
  res.statusCode = 200;
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.end();
};

var app = require('http').createServer(handler);
var mqttClient = require('./libs/mqtt');
var EspMessage = require('./data_types/esp');

var io = require('socket.io')(app);
var port = process.env.WEBSOCKET_PORT || 8080;
app.listen(port);
console.log(`Start websocket server at port ${port}`);

var connectingDevices = {};

io.on('connection', socket => {
  socket.on('join device channel', data => {
    let deviceId = data;
    let mqttTopic = `public/esp/${deviceId}/device_out`;
    socket.join(`public/esp/${deviceId}/device_out`);
    // Subscribe proper MQTT channel of deviceId
    // then transmit every message from MQTT to this channel
    mqttClient.subscribe(mqttTopic);
    if (connectingDevices[deviceId]) {
      connectingDevices[deviceId] += 1;
    } else {
      connectingDevices[deviceId] = 1;
    }
    console.log(`Device ${deviceId} connected. Active client(s): ${connectingDevices[deviceId]}`);

    socket.on('disconnect', () => {
      connectingDevices[deviceId] -= 1;
      console.log(`Client of device ${deviceId} disconnected. Remaining client(s): ${connectingDevices[deviceId]}`);

      if (connectingDevices[deviceId] <= 0) {
        console.log(`No active client for device ${deviceId}. Unsubscribe MQTT channel.`);
        mqttClient.unsubscribe(mqttTopic);
        delete connectingDevices[deviceId];
      }
    });
  });
});

mqttClient.on('message', (topic, message) => {
  try {
    let espMsg = new EspMessage(message);
    console.log(`Sending message to room "${topic}/device_out": ${espMsg.toJSON()}`);
    io.to(topic).emit('device_out', espMsg.toJSON());
  } catch (error) {
    console.error(error.message);
  }
});
