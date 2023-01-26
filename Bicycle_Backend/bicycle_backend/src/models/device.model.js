//import mongoose, { Schema, Model, Document } from "mongoose";
const mongoose = require("mongoose");
const Schema =require("mongoose")
//const uid = require ("uid");
const User = require("./user.model");
const { uid } =require( "rand-token");
const { escapeNumberedList } = require("discord.js");

/*const IPAddressSchema = new mongoose.Schema(
    {
      address: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  );
  
   const UserAgentSchema = new mongoose.Schema(
    {
      raw: {
        type: String,
        required: true,
      },
    },
    { timestamps: true }
  );*/

  
const UserSchema = 
   
     mongoose.Schema
    ({
  createdAt: Date,
  updatedAt: Date,
  /*user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
    required: true,
  },
  agents: {
    type: [UserAgentSchema],
    required: true,
  },
  hosts: {
    type: [IPAddressSchema],
    required: true,
  },*/
  idEquipment:{
    type:String,
    required:true
  },
  imei:{
    type:String,
    required: true
  },
  serialNumber:{
    type:String,
    required:true
  },
  typeDevice:{
    type:String,
    required:true
  },
  versionFirmware:{
    type:String,
    required:true
  },
  versionLogiciel:{
    type:String,
    required:true
  },
  
  token: {
    type: String,
    default: () => uid(256),
  },
  expiresAt: {
    type: Date,
    default: () => {
      const date = new Date();
      date.setDate(date.getDate() + 30);
      return date;
    },
  },
  revokedAt: Date,
  revokedReason: {
    type: String, 
    enum: ["logout", "expired"],
  },
  
})
//{ timestamps: true  }
var IDevice = mongoose.model('IDevice', UserSchema);

// save user to database
IDevice.adddevice = function(device, callback)
{
    console.log("Test reaching here")
    
                    device.save((err, result)=>
                    {
                        if(err){
                            console.log(err);
                            callback('Failed to add', null);
                        } else{
                            callback(null, 'device added');
                        }
                    });
}

module.exports = IDevice;