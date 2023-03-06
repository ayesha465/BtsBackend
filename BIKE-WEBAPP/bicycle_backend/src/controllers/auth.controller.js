const config = require("../config/auth.config");
// const config = require("../config/db.config");


const mongoose = require("mongoose");

const db = require("../models");

const User =require("../models/user.model");
const Role =require("../models/role.model");
//const Role = db.role;
const IDevice = require("../models/device.model");
// const authJwt = require("../middlewares/authJwt");
const RefreshToken = require("../models/refreshToken.model");

const crypto = require('crypto');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const Joi = require("joi");
const sendEmail = require("../Helpers/sendEmail");
//const { IDevice } = require("../models/device");
const { IPAddressSchema } = require("../models/device.model");
const AdminUser = require("../models/Adduser.model");

const stolenBike = require("../models/Stolenbike.model");
const healthcheck = require("../models/HealthChecker.model");
const notify = require("../models/notifications.model")
const mobile = require("../models/mobile.model")
const location = require("../models/location.model")
const logs = require("../models/logs.model")
const Bikee = require("../models/Bike.model")
//<------------------------Account management-------------------------->



exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    contact:req.body.contact,
    Address:req.body.Address,

  });
  
  

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
            
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  ;
};

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .populate("roles", "-__v")
    .exec(async (err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }
      console.log(config.secret)

      let token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration,
      });

      let refreshToken = await RefreshToken.createToken(user);
      // let accessToken = await accessToken.createToken(user)
      let authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
        refreshToken: refreshToken,
        message:"successfully login "
      });
    });
};

exports.posts = async(req,res)=>{
  if (!User) {
    res.status(403)
      .send({
        message: "Invalid JWT token"
      });
  }
  if (req.role == "admin") {
    res.status(200)
      .send({
        message: "Congratulations! but there is no hidden content"
      });
  } else {
    res.status(403)
      .send({
        message: "Unauthorised access"
      });
  }
  
  }





exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec();
      
      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    let newAccessToken = jwt.sign({ id: refreshToken.user._id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};
          
/*exports.accessToken = async (req, res) => {
  const { accessToken: accessToken } = req.body;

  if (accessToken == null) {
    return res.status(403).json({ message: "access Token is required!" });
  }

  try {
    let accessToken = await authJwt.findOne({ token: accessToken });

    if (!accessToken) {
      res.status(403).json({ message: "access token is not in database!" });
      return;
    }

    if (accessToken.verifyExpiration(accessToken)) {
      accessToken.findByIdAndRemove(accessToken._id, { useFindAndModify: false }).exec();
      
      res.status(403).json({
        message: "access token was expired. Please make a new signin request",
      });
      return;
    }

    let newAccessToken = jwt.sign({ id: accessToken.user._id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};
*/








exports.delete=  async(req, res) => {
  console.log(req.params.id)
  
  const data = await db.user;
  const result = await data.deleteOne({_id:req.params.id})
  res.send(result);
};



exports.updateaccount = (req,res)=>{
  console.log(req.params.id)
  User.findOneAndUpdate(
    {
      _id:req.params.id
    },
    {
      $set:{username:req.body.username},
      $set:{contact:req.body.contact},
      $set:{Address:req.body.Address},
    },
    (err,result)=>{
      if(err) return res.status(500).json({msg:err});
      const msg={
        msg:"data reset successfully",
        id:req.params.id
        
      }
      return res.json(msg)
    }

  )
}



exports.recoverPassword =async (req, res) => {
  try {
      const schema = Joi.object({ email: Joi.string().email().required() });
      const { error } = schema.validate(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      const user = await User.findOne({ email: req.body.email });
      if (!user)
          return res.status(400).send("user with given email doesn't exist");
      //console.log(req.body.email)
      let token = await RefreshToken.findOne({ userId: user._id});
      console.log(req.body.token)
      if (!token) {
          token = await new RefreshToken({
              userId: user._id,
              token: crypto.randomBytes(32).toString("hex"),
          }).save();
      }
      //console.log(req.body.userId)
      //console.log(req.body.token)
      const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;
      await sendEmail(user.email, "Password reset", link);

      res.send("password reset link sent to your email account");
  } catch (error) {
      res.send("An error occured");
      console.log(error);
  }
};

exports.changepassword= async (req, res) => {
  console.log(req.params)
  try {
      const schema = Joi.object({ password: Joi.string().required() });
      const { error } = schema.validate(req.body);
      if (error) return res.status(400).send(error.details[0].message);

      const user = await User.findById(req.params.id);
      console.log(req.params.id)
      if (!user) return res.status(400).send("invalid link or expired");

      const token = await RefreshToken.findOne({
          userId: user._id,
          token: req.body.token,
      });
      
      console.log(token)
      if (!token) return res.status(400).send("Invalid link or expired");

      user.password = req.body.password;
      await user.save();
      await token.delete();

      res.send("password reset sucessfully.");
  } catch (error) {
      res.send("An error occured");
      console.log(error);
  }
};


//<----------------------------Device Management------------------------------------------>

exports.register = async (req, res) => 
{
    const AddUser = new IDevice({
      
   //user: mongoose.Schema.Types.ObjectId,
    //device: mongoose.Schema.Types.ObjectId,
    expiresAt: Date.now(),
    revokedAt: Date.now(),
    
    imei:req.body.imei,
    idEquipment:req.body.idEquipment,
    serialNumber:req.body.serialNumber,
    typeDevice:req.body.typeDevice,
    versionFirmware:req.body.versionFirmware,
    versionLogiciel:req.body.versionLogiciel
    
    });
    
    IDevice.adddevice(AddUser, (err, result)=>{
      console.log("request is coming")
      if(err){
          return res.json({success: false, message: err});
      }
      console.log("request is coming")
      return res.json({success: true, message: result});
  });
  

};

exports.Devicelogin = async (req, res) => {
  try {
    const service = new AuthService(settings.AUTH);

    const { session, ...result } = await service.login(req.body, req.client);

    res.cookie(settings.AUTH.refreshCookie, session.token, {
      expires: session.expiresAt,
      httpOnly: true,
      path: "/",
      signed: true,
      secure: settings.HTTPS_ONLY,
    });

    return res.status(200).json(result);
  } catch (e) {
    if (e instanceof ServiceError) return res.status(e.status).json(e);
    return res.status(500).json(new ServiceError());
  }
};



//<-----------------------------ADMIN DASHBOARD------------------------------->


exports.AddAdminuser = async (req, res) => 
{
    const user = new AdminUser({
      
    Fullname: req.body.Fullname,
    Email: req.body.Email,
    //password: req.body.password,
    ContactNumber:req.body.ContactNumber,
    Address:req.body.Address,
    CNIC:req.body.CNIC
     
  
    });
   user.save((err, result)=>
    {
      console.log("request is incoming");
        if(err)
        {
            return res.json({success: false, message: err});
        }
        
        return res.json({success: true, message: result});
    })
  

}
//<<----------------------Theft management--------------------->>
exports.BikeStolen = async (req, res) => 
{
    const user = new stolenBike({
      
    Broadcast: Date.now(),
    status: req.body.status,
    stolen_location:req.body.stolen_location,
    Description:req.body.Description
     
  
    });
   user.save((err, result)=>
    {
      console.log("request is incoming");
        if(err)
        {
            return res.json({success: false, message: err});
        }
        
        return res.json({success: true, message: result});
    })
  }


  //<------------------------HealthChecker--------------------->
  exports.HealthChecker = async (req, res) => 
{
  const checker=new  healthcheck  ({
    ClientId:req.body.ClientId,
    UserId:req.body.UserId,
    
    message: req.body.message,
    timestamps: Date.now(),
    uptime:process.uptime()
    
});

checker.save((err, result)=>
    {
      console.log("request is incoming");
        if(err)
        {
            return res.json({success: false, message: err});
        }
        
        return res.json({success: true, message: result});
    })
}

//<-----------------------Notifications----------------------------->
exports.notifications = async (req, res) => 
{
  const notification=new notify ({
    notification_id:req.body.notification_id,
    // user_id:notify.User_id.push,
    
    message: req.body.message,
    timestamps: Date.now(),
    // mobile_id:req.body.mobile_id
    
});

notification.save((err, result)=>
    {
      console.log("request is incoming");
        if(err)
        {
            return res.json({success: false, message: err});
        }
        
        return res.json({success: true, message: result});
    })
}

//<-----------------------MOBILE----------------------------->
exports.mobileapi = async (req, res) => 
{
  const mobilee = new mobile ({

  mobile_id:req.body.mobile_id,
  mobile_name:req.body.mobile_name,
  mobile_model:req.body.mobile_model,
  mobile_IMEI:req.body.mobile_IMEI
});

mobilee.save((err, result)=>
    {
      console.log("request is incoming");
        if(err)
        {
            return res.json({success: false, message: err});
        }
        
        return res.json({success: true, message: result});
    })
}
//<-----------------------Location----------------------------->
exports.locationapi = async (req, res) => 
{
  const locationn = new location({

  latitude:req.body.latitude,
  longitude:req.body.longitude,
  mac_address:req.body.mac_address
});

locationn.save((err, result)=>
    {
      console.log("request is incoming");
        if(err)
        {
            return res.json({success: false, message: err});
        }
        
        return res.json({success: true, message: result});
    })
}
//<-----------------------Logs----------------------------->
exports.logsapi = async (req, res) => 
{
  const logss = new logs({

  log_id:req.body.log_id,
  
});

logss.save((err, result)=>
    {
      console.log("request is incoming");
        if(err)
        {
            return res.json({success: false, message: err});
        }
        
        return res.json({success: true, message: result});
    })
}
//<-------------------BIKE----------------------------------->
exports.Bikeapi = async (req, res) => 
{
  const Bikes = new Bikee({

 bike_model:req.body.bike_model,
 bike_description:req.body.bike_description,
 bike_status:req.body.bike_status,

  
});

Bikes.save((err, result)=>
    {
      console.log("request is incoming");
        if(err)
        {
            return res.json({success: false, message: err});
        }
        
        return res.json({success: true, message: result});
    })
}