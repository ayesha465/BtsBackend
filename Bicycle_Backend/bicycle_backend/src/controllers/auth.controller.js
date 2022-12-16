const config = require("../config/auth.config");

const db = require("../models");

const User = db.user;
const Role = db.role;
const IDevice = db.device
const RefreshToken = require("../models/refreshToken.model");

const crypto = require('crypto');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const Joi = require("joi");
const sendEmail = require("../Helpers/sendEmail");
//const { IDevice } = require("../models/device");
//const { IPAddressSchema } = require("../models/device");
exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    contact:req.body.contact,
    Address:req.body.Address,

  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

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
  });
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
      });
    });
};

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

exports.register = async (req, res) => 
{
  
    //const service = new AuthService(settings.AUTH);

    //const { session, ...result } = await service.register(req.body, req.client);
    const device = new IDevice({
      
      address:req.body.address,
  
    });
    device.save((err, device) => 
    {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
    })
  
  

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