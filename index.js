const express = require("express");

const app = express();
const cors = require("cors");
const port = 3001;
const bodyParser = require("body-parser");
const session = require("express-session");
const { handleError } = require("./middlewares/error");
const userRoutes = require("./routes/userRoutes");
const tagRoutes = require("./routes/tagRoutes");
const receiptRoutes = require("./routes/receiptRoutes");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
require("dotenv").config();

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/v1/users", userRoutes);
app.use("/v1/tags", tagRoutes);
app.use("/v1/receipts", receiptRoutes);

app.use(handleError);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}!`);
});
