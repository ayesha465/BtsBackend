const mongoose = require("mongoose");
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const healthchecker = mongoose.model(
    "healthchecker",
    new mongoose.Schema({
        ClientId:String,
    UserId:String,
   
    uptime:String,
    message:String,
    timestamps: Date

    
    
    
    }));

module.exports = healthchecker;