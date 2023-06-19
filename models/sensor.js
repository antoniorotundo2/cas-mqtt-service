const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectID = Schema.ObjectID;
const Sensor = new Schema({
    idSensor:{type:String,default:'999'},
    //temperature:Number,
    //humidity:Number,
    //pressure:Number,
    //gas:Number,
    latitude:{type:Number,default:0},
    longitude:{type:Number,default:0},
    //timestamp:{type:Date,default:Date.now}
})
module.exports = mongoose.model('Sensor',Sensor);