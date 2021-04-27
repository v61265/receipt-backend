const express = require("express");
const tagRouter = express.Router();
const tagController = require("../controllers/tagController.js");
const { catchAsyncError } = require("../middlewares/error");

tagRouter.post("/add", catchAsyncError(tagController.add));
tagRouter.patch("/:id", catchAsyncError(tagController.update));
tagRouter.get("/delete/:id", catchAsyncError(tagController.delete));
tagRouter.get("/", catchAsyncError(tagController.getTags));

module.exports = tagRouter;
