const mongoose = require("mongoose");
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require("dotenv").config();

var userSchema = mongoose.Schema({
    Fullname:{
        type: String
    },
    Email:{
        type: String
    },
    /*password:{
        type: String,
        required: true
    },*/
    Address:{
        type: String
    },
    ContactNumber:{
        type: String
    },
    CNIC:{
        type: String
    },
 });
var AdminUser = mongoose.model('AdminUser', userSchema);


/*AdminUser.addUser = function(user, callback)
{
    console.log("Test reaching here")
    bcrypt.genSalt(12, (err, salt)=>{
        if(err)
        {
            callback('Server error');
        }else 
        {
            bcrypt.hash(user.password, salt, (err, hash)=>{
                console.log("ayesha")
                if(err)
                {
                    callback('server Error');
                }else
                {
                    
                    user.password = hash;
                    user.save((err, result)=>{
                        if(err)
                        {
                            console.log(err);
                            callback('Failed to add', null);
                        } else
                        {
                            callback(null, 'user added');
                        }
                    });
                }
            });
        }
    });    
}*/
module.exports = AdminUser;