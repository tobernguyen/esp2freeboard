var mqtt = require('mqtt');
var client = mqtt.connect(process.env.MQTT_URI || 'mqtt://localhost:1883');

client.on('connect', () => {
  console.log('Connected to MQTT server. Ready to subscribe.');
});

module.exports = client;
