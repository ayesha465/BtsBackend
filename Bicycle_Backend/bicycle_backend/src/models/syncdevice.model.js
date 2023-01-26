const mongoose = require("mongoose");
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config();

var userSchema = mongoose.Schema({
    id:{
        type: String
    },
    created:{
        type: String
    },
    
    title:{
        type: String
    },
  
 });
var SyncDevice = mongoose.model('AdminUser', userSchema);



module.exports = SyncDevice;