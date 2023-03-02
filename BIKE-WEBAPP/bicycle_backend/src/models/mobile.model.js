const mongoose = require("mongoose");
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { string } = require("joi");
const uuid = require('uuid');
// usage
const uniqueRandomID = uuid.v4()
require("dotenv").config();

var userSchema = mongoose.Schema({
    mobile_id:{
        type: String
    },
    mobile_name:{
        type: String
    },
    
    mobile_model:{
        type: String
    },
    
    mobile_IMEI:{
        type: String
    },
    user_id:{
        type: String,
        default: () => uuid.v4()
    },
 });
var mobile = mongoose.model('mobile', userSchema);



module.exports = mobile;