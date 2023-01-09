const verifySignUp  = require("../middlewares/verifySignUp");
const controller = require("../controllers/auth.controller");
const {check} = require('express-validator');
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

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/refreshtoken", controller.refreshToken);
  
  app.post('/api/password-reset/',controller.recoverPassword);
  app.patch('/api/auth/:id',controller.updateaccount);
  //app.post('/api/auth/:id',controller.update);
  app.patch('/api/:id',controller.changepassword);
  app.delete('/api/auth/:id',controller.delete);
  app.post("/api/auth/register", controller.register);
  app.post("/api/auth/Devicelogin", controller.Devicelogin);
  app.post("/api/auth/adminuser", controller.AddAdminuser);
  app.post("/api/auth/bikestoleninfo", controller.BikeStolen);
  app.post("/api/auth/healthchecker", controller.HealthChecker);

};