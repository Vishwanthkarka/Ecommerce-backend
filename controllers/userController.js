const BigPromise = require("../middlewares/bigPromise")
const User = require("../models/user")
const mailHelper = require("../utils/emailHelper")
const cookieToken = require("../utils/cookieToken")
const CustomError = require("../utils/customError")
const cloudinary = require("cloudinary")
const { findOne } = require("../models/user")

//signup
exports.Signup = BigPromise(async(req,res,next)=>{
    let result
    if(!req.files){
        return next(new CustomError("photo is required for signup", 400))
    }
        let file = req.files.photo
     result = await cloudinary.v2.uploader.upload(file.tempFilePath,{
folder:"users",
width:150,
crop:"scale"
        })
    
    
const {email,password,name} = req.body
if(!(email || password || name)) {
    return next(new CustomError("Name,email,password is mandatory ",400))
}
const user =await User.create({
    name,
    email,
    password,
    photo:{
        id:result.public_id,
        secure_url :result.secure_url
    }
})

//generating token


//generating the cookie
cookieToken(user,res)
})
//login
exports.login = BigPromise(async(req,res,next)=>{
    const {email,password} = req.body;
    if(!(email|| password)){
        return next(new CustomError("Email and password is mandatory ",400))
    }
    //finding the email in DB and getting all the credential 
    const user = await User.findOne({email}).select("+password")
    if(!user){
        return next(new CustomError("You don't have an account try to create an account",400))
    }
    //validating the password
const passwordChecker =  await user.isValidatePassword(password);


if(!passwordChecker){
    return next(new CustomError("Enter the valid password to login"))
}
//generating the cookies 
cookieToken(user,res);
})
//logout
exports.logout = BigPromise(async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true
    });
    res.status(200).json({
        success:true,
        message:"Logout success"
    })
})

//forgotPassword
exports.forgotPassword = BigPromise(async(req,res,next)=>{
    const {email} = req.body
    const user = await User.findOne({email})
    if(!user){
       next( new CustomError("Enter the valid email id"))
    }
    const forgotToken = user.getForgotPasswordToken()
    await user.save({validateBeforeSave:false})
    const myUrl = `${req.protocol}://${req.get("host")}/password/reset/${forgotToken}`
const message = `copy and paste in the url ${myUrl}`
try{
   await mailHelper({
    email:"hello@gmail.com",
    subject:"Reset password",
    message
   })

   res.status(200).json({
    succes: true,
    message: "Email sent successfully",
  });
}
catch(err){

    //setting undefine if any error occors
    user.forgotPasswordToken= undefined;
    user.forgotPasswordExpire= undefined;
    await user.save({validateBeforeSave:false});
    return next(new CustomError(err.message,500));
}
})
//Reset password
exports.passwordreset = BigPromise(async(req,res,next)=>{
    const token = req.params.token;
    const {passowrd,conformpassowrd} = req.body
    if(passowrd != conformpassowrd){
        next( new CustomError("check your password you been enter",400))
    }

   const hashedToken =  crypto.createHash('sha256').update(token).digest("hex")
   const user = await findOne({hashedToken, forgotPasswordExpiry: { $gt: Date.now() },}).select("+password")
   user.password = password;
   user.forgotPasswordToken= undefined;
   user.forgotPasswordExpire= undefined;
   await user.save({validateBeforeSave:false});
})


exports.getLoggedInUserDetails = BigPromise(async (req, res, next) => {
    //req.user will be added by middleware
    // find user by id
    const user = await User.findById(req.user.id);
  
    //send response and user data
    res.status(200).json({
      success: true,
      user,
    });
  });

//update the user data
exports.updateUserinfo = BigPromise(async(req,res,next)=>{
    req.files.photo
})