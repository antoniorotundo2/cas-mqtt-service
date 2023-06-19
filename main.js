const mqtt = require('mqtt');
const Sensor = require('./modules/sensor');
const client = mqtt.connect('mqtt://broker.hivemq.com:1883');
const mongoose = require('mongoose');
const SensorModel = require('./models/sensor');
const ReadModel = require('./models/read');

mongoose.connect('mongodb://localhost:27017/cas-db')
  .then(() => {
    console.log('connection successful to DB');
    client.on('connect', function () {
      client.subscribe('cas/sensor', function (err) {
        if (!err) {
          console.log('successful subscription');
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