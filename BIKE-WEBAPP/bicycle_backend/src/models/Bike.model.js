const mongoose = require("mongoose");
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { string } = require("joi");
const uuid = require('uuid');
// usage
const uniqueRandomID = uuid.v4()
require("dotenv").config();

var userSchema = mongoose.Schema({
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
    bike_model:{
        type: String
    },
    bike_description:{
        type: String
    },
    bike_status:{
        type: String,
        
    },
 });
var Bike = mongoose.model('Bike', userSchema);



module.exports = Bike;