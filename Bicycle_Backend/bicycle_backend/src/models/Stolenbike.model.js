const mongoose = require("mongoose");
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config();

var userSchema = mongoose.Schema({
    BikeID:{
        type: String
    },
    BikeModel:{
        type: String
    },
    /*password:{
        type: String,
        required: true
    },*/
    Description:{
        type: String
    },
    
 });
var Bike = mongoose.model('Bike', userSchema);
module.exports = Bike;