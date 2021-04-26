const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController.js");
const { catchAsyncError } = require("../middlewares/error");

userRouter.post("/login", catchAsyncError(userController.login));
userRouter.get("/logout", catchAsyncError(userController.logout));

module.exports = userRouter;
