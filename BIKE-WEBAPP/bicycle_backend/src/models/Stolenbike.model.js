const mongoose = require("mongoose");
var bcrypt = require('bcryptjs');
const uuid = require('uuid')
const jwt = require('jsonwebtoken');
require("dotenv").config();

var userSchema = mongoose.Schema({
    Broadcast:Date,
    status:{
        type: String
    },
    stolen_location:{
        type: String,
        required: true
    },
    Description:{
        type: String
    },
    bike_id:{
        type: String,
        default: () => uuid.v4()
    },
    user_id:{
        type: String,
        default: () => uuid.v4()
    },
    device_id:{
        type: String,
        default: () => uuid.v4()
    },
    
 });
var stolenBike = mongoose.model('stolenBike', userSchema);
module.exports = stolenBike;