//import mongoose, { Schema, Model, Document } from "mongoose";
const mongoose = require("mongoose");
const Schema =require("mongoose")
//const uid = require ("uid");
const User = require("./user.model");
const { uid } =require( "rand-token");
const { escapeNumberedList } = require("discord.js");

/*export const  IUserAgent= {
  
  
  raw: String,
  createdAt: Date,
  updatedAt: Date,
  
}

 export const IIPAddress= 
{
  address: string,
  createdAt: Date,
  updatedAt: Date,
}

  export const ISession = {
  user: Types.ObjectId | User,
  device: Types.ObjectId | IDevice,
  //agents: Types.Array<IUserAgentDocument>,
  //hosts: Types.Array<IIPAddressDocument>,
  token: string,
  revokedReason: "logout" | "expired",
  revokedAt: Date,
  expiresAt: Date,
  createdAt: Date,
  updatedAt: Date,
}

*/

 const IPAddressSchema = new mongoose.Schema(
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
  );

  
const UserSchema = 
   
     mongoose.Schema
    ({
  createdAt: Date,
  updatedAt: Date,
  user: {
    type: String,
    ref: "User",
    required: true,
  },
  device: {
    type: String,
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