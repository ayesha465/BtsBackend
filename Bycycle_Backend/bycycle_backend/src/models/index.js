const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.refreshToken = require("./refreshToken.model");
db.IDevice = require("./device");
db.ROLES = ["user", "admin", "moderator"];
db.approve={
    type: Boolean, default: false
  }
module.exports = db;
