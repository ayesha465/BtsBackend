//import mongoose, { Schema, Model, Document } from "mongoose";
const mongoose = require("mongoose");
const Schema =require("mongoose")
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
const IDevice = mongoose.model(
    "IDevice",
    new mongoose.Schema
    ({
  createdAt: Date,
  updatedAt: Date,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  device: {
    type: Schema.Types.ObjectId,
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
  
}),
//{ timestamps: true  }
);  
module.exports = IDevice;
//module.exports = IPAddressSchema;