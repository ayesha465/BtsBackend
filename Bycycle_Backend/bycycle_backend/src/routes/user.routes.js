const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(User) {
  User.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  User.get("/api/test/all", controller.allAccess);

  User.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  User.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  User.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};