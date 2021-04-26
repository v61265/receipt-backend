const express = require("express");
const receiptRouter = express.Router();
const receiptController = require("../controllers/receiptController.js");
const { catchAsyncError } = require("../middlewares/error");
const multer = require("multer");
const upload = multer();

receiptRouter.post(
  "/add",
  upload.single("file"),
  catchAsyncError(receiptController.add)
);
receiptRouter.patch("/:id", catchAsyncError(receiptController.update));
receiptRouter.get("/delete/:id", catchAsyncError(receiptController.delete));
receiptRouter.get("/", catchAsyncError(receiptController.getReceipts));
receiptRouter.get(
  "/byTag",
  catchAsyncError(receiptController.getReceiptsByTag)
);

module.exports = receiptRouter;
