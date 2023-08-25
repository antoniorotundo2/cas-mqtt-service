const CONFIG = require('./config.json');
const mqtt = require('mqtt');
const Sensor = require('./modules/sensor');
const client = mqtt.connect(CONFIG["mqtt-broker"]);
const mongoose = require('mongoose');
const SensorModel = require('./models/sensor');
const ReadModel = require('./models/read');

mongoose.connect(CONFIG["mongodb-url"])
  .then(() => {
    console.log('connection successful to DB');
    client.on('connect', function () {
      client.subscribe(CONFIG["mqtt-topic"], function (err) {
        if (!err) {
          console.log('successful subscription');
        } else {
          console.error(err);
        }
      })
    })

    client.on('message', function (topic, message) {
      // message is Buffer
      // parse del messaggio ricevuto dal sensore
      const letturaRicevuta = JSON.parse(message.toString());
      // se l'oggetto 'listasensori' contiene il valore della chiave 'id' di 'letturaRicevuta'
      // singleton design pattern
      //ultimalettura = JSON.parse(message.toString())
      //console.log('Il sensore nodo',ultimalettura.id,'ha temperatura',ultimalettura['temp'],'pressione',ultimalettura['press'],'umidità',ultimalettura.hum,'e gas',ultimalettura.gas)
      //console.log(messaggio)
      SensorModel.findOne({idSensor:letturaRicevuta.id}).then((obj)=>{
        if(!obj){
          console.log('sensor not found');
        } else {
          const objRead = new ReadModel();
          objRead.idSensor = obj._id;
          objRead.temperature = letturaRicevuta.temp;
          objRead.pressure = letturaRicevuta.press;
          objRead.humidity = letturaRicevuta.hum;
          objRead.gas = letturaRicevuta.gas;
          objRead.save();
        }
      }).catch((err)=>{
        console.log('sensor not found');
      })
      
    })
  }).catch(() => {
    console.log('connection failed to DB');
  })