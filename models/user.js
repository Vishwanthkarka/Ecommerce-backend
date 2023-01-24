const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const validator = require("validator");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:[true,"name field is mandatory"],
        maxlength:[40,"Name should be under the 40 characters"]
    },
    email:{
type:String,
require:[true,"email is field is mandatory"],
validate:[validator.isEmail,"enter the email correctly"],
unique:true
    },
    password:{
        type:String,
        require:[true,"email is field is mandatory"],
        minlength:[6,"password length should atleast 6  "],
        select:false,

    },
    role:{
type:String,
default:"user"
    },
    photo:{
        id:{
            type:String,
            // required:true
        },
        secure_url:{
            type:String,
           
        }
    },
    forgotPasswordToken:String,
    forgotPasswordExpire:Date,
    createdAt:{
        type:Date,
        default:Date.now
    }
})

// encrypt the password before save
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next()
    }
    this.password = await bcrypt.hash(this.password,10)
})

//validate the password of user entered password and the password in DB
userSchema.methods.isValidatePassword =  async function (userSendPassowrd){
return  await bcrypt.compare(userSendPassowrd,this.password)
}

//create and return jwt
userSchema.methods.getJwtToken = async function (){
return jwt.sign({id:this._id},process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRY
})
}

//generate forgot password token (string)
userSchema.methods.getForgotPasswordToken = function (){

    //generating the random long string
    const forgotToken = crypto.randomBytes(20).toString('hex');

    //getting a hash - making sure to generate an hash in backend
    this.forgotPasswordToken = crypto.createHash('sha256').update(forgotToken).digest("hex")

    //time of token 
    this.forgotPasswordExpire = Date.now()*20*60*1000
    return forgotToken
}



module.exports = mongoose.model("user",userSchema)