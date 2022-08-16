// ! set environment variables
require("dotenv").config();

// ! import third-party
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const app = express();

// ! ================== setup ================== //
app.use(express.static(path.join(__dirname, "/src/build")));

const dev = app.get("env") !== "production";

if (!dev) {
  app.disable("x-powered-by");
  app.use(morgan("common"));
  /* app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/src/build", "index.html"));
  }); */
} else {
  app.use(morgan("dev"));
}

// ! ================== Connect mongodb with mongoose ================== //
const mongoose = require("mongoose");
const MONGO_URL = dev ? process.env.MONGO_URL_LOCAL : process.env.MONGO_URL;
mongoose.connect(MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

// ! ================== config ==================//
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
app.use(cookieParser());
const corsConfig = require("./configs/cors");
app.use(cors(corsConfig));

// ! ================== Listening ... ================== //
app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT} !!`);
});

// ! import local file
const accountApi = require("./routes/account");
const authAdminApi = require("./routes/admin/auth");
const productAdminApi = require("./routes/admin/product");
const orderAdminApi = require("./routes/admin/order");
const sliderAdminApi = require("./routes/admin/slider");
const addressApi = require("./routes/address");
const loginApi = require("./routes/login");
const productApi = require("./routes/product");
const commentApi = require("./routes/comment");
const userApi = require("./routes/user");
const orderApi = require("./routes/order");
const sliderApi = require("./routes/slider");
const statisticApi = require("./routes/statistic");

// ! ================== Routes - Api ================== //

// api liên quan đến account
app.use("/apis/accounts", accountApi);

// api trang admin
app.use("/apis/admin", authAdminApi);
app.use("/apis/admin", productAdminApi);
app.use("/apis/admin", sliderAdminApi);
app.use("/apis/admin", orderAdminApi);

// api liên quan đến address
app.use("/apis/address", addressApi);

// api liên quan user
app.use("/apis/user", userApi);

// api liên quan đến login
app.use("/apis/login", loginApi);

// api liên quan đến product
app.use("/apis/products", productApi);

// api liên quan comment
app.use("/apis/comments", commentApi);

// api liên quan đơn hàng
app.use("/apis/orders", orderApi);

// api liên quan slider
app.use("/apis/slider", sliderApi);

// api liên quản đến thống kê admin
app.use("/apis/statistic", statisticApi);
