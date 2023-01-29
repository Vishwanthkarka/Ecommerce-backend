const CustomError = require("../utils/customError")
const User = require("../models/user")
const BigPromise = require("./bigPromise");
const jwt = require("jsonwebtoken");

exports.isLoggedIn= BigPromise( async(req,res,next) => {
const token =  req.cookies.token 
if (!token) {
    return next(new CustomError("Login first to access this page", 401));
  }
  const decode = jwt.verify(token,process.env.JWT_SECRET)
  req.user = await User.findById(decode.id);
  console.log(decode.id)
  next()
})


exports.customRole = (...roles)=>{
return (req,res,next)=>{
  if(!roles.includes(res.user.role)){
return next(CustomError("You are not allowed for this resource",403))
}
next()
}
}