const mongoose = require("mongoose");
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { string } = require("joi");
const uuid = require('uuid');
// usage
const uniqueRandomID = uuid.v4()
require("dotenv").config();

var userSchema = mongoose.Schema({
    device_id:{
        type: String,
        default: () => uuid.v4()
    },
    bike_id:{
        type: String,
        default: () => uuid.v4()
    },
    mac_address:{
        type: String
    },
    latitude:{
        type: String
    },
    
    longitude:{
        type: String
    },
    user_id:{
        type: String,
        default: () => uuid.v4()
    },
 });
var location = mongoose.model('location', userSchema);



module.exports = location;