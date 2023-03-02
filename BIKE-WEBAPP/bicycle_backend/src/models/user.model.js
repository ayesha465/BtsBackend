const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    Address: String,
    contact: String,
    
    created:  Date,
    
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
      
    ],
    approve:{
      type: Boolean, default: false
    }
  })
);

module.exports = User;