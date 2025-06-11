const { Router } = require("express");
const authController = require("../controller/authController");
const authRouter = new Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/refresh", authController.refreshTokenHandler);
authRouter.get("/logout", authController.logout);
module.exports = authRouter;
