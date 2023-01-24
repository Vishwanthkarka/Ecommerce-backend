const customError = require("../utils/customError")
const User = require("../models/user")
const BigPromise = require("./bigPromise");
const jwt = require("jsonwebtoken");

exports.isLoggedIn= async(req,res,next) => {
const token = req.cookies.token || req.header("Authorization").replace("Bearer ", "");
if (!token) {
    return next(new CustomError("Login first to access this page", 401));
  }
  const decode = jwt.verify(token,process.env.JWT_SECRET)
  req.user = await User(decode.id);
  next()
}