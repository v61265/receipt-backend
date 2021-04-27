const express = require("express");
const receiptRouter = express.Router();
const receiptController = require("../controllers/receiptController.js");
const { catchAsyncError } = require("../middlewares/error");
const multer = require("multer");
const upload = multer();
const { checkAuth } = require("../middlewares/auth");

receiptRouter.post(
  "/add",
  upload.fields([{ name: "file" }, { name: "tag" }]),
  //catchAsyncError(checkAuth),
  catchAsyncError(receiptController.add)
);
receiptRouter.patch(
  "/:id",
  //catchAsyncError(checkAuth),
  catchAsyncError(receiptController.update)
);
receiptRouter.get(
  "/delete/:id",
  //catchAsyncError(checkAuth),
  catchAsyncError(receiptController.delete)
);
receiptRouter.get(
  "/",
  //catchAsyncError(checkAuth),
  catchAsyncError(receiptController.getReceipts)
);

module.exports = receiptRouter;
