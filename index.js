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

app.use("/", (req, res, next) => {
  res.locals.pool = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  };
  next();
});

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(handleError);

app.use("/v1/users", userRoutes);
app.use("/v1/tags", tagRoutes);
app.use("/v1/receipts", receiptRoutes);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}!`);
});
