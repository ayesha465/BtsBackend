const mongoose = require("mongoose");
// import
const uuid = require('uuid')

// usage
const uniqueRandomID = uuid.v4()
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { string } = require("joi");
require("dotenv").config();

var userSchema = mongoose.Schema({
    log_id:{
        type: String
    },
    user_id:{
        type:String,
        default: () => uuid.v4()
    },
    
    device_id:{
        type: String,
        default: () => uuid.v4()
    },
    
 });
var logs= mongoose.model('logs', userSchema);



module.exports = logs;