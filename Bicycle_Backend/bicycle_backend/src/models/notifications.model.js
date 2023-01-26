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
    notification_id:{
        type: String
    },
    user_id:{
        type:String,
        default: () => uuid.v4()
    },
    
    mobile_id:{
        type: String,
        default: () => uuid.v4()
    },
    timestamps:
        Date ,
   
    message:{
        type: String
    },
 });
var notification = mongoose.model('notification', userSchema);



module.exports = notification;