const verifySignUp  = require("../middlewares/verifySignUp");
const authJwt  = require("../middlewares/authJwt");
// const authJwt = require("./middlewares/authJwt");
const controller = require("../controllers/auth.controller");
const {check} = require('express-validator');
const { isModerator } = require("../middlewares/authJwt");
//var app = require('express');
//var router = express.Router();

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  // app.post("/api/auth/accesstoken", controller.accessToken);
  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  /*app.get(
    "/api/auth/posts",
    [
      authJwt.verifyToken,
      // authJwt.isAdmin,
      // authJwt.isModerator
    ],
    controller.posts
  );
*/
  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/refreshtoken", controller.refreshToken);
  
  app.post('/api/password-reset/',[authJwt.verifyToken],controller.recoverPassword);
  app.put('/api/auth/:id',[authJwt.verifyToken],controller.updateaccount);
  //app.post('/api/auth/:id',controller.update);
  app.put('/api/:id',[authJwt.verifyToken],controller.changepassword);
  app.delete('/api/auth/:id',[authJwt.verifyToken],controller.delete);
  app.post("/api/auth/register", controller.register);
  app.post("/api/auth/Devicelogin", controller.Devicelogin);
  app.post("/api/auth/adminuser", controller.AddAdminuser);
  app.post("/api/auth/bikestoleninfo", controller.BikeStolen);
  app.post("/api/auth/healthchecker", controller.HealthChecker);
  app.post("/api/auth/notification", controller.notifications);
  app.post("/api/auth/mobile", controller.mobileapi);
  app.post("/api/auth/locationapi", controller.locationapi);
  app.post("/api/auth/logsapi", controller.logsapi);
  app.post("/api/auth/bikeapi", controller.Bikeapi);
};