const express = require("express")
const router = express.Router()


//importing the controllers
const {Signup,login,logout,forgotPassword} = require("../controllers/userController")
const {isLoggedIn} = require("../middlewares/user")

//List of routes
router.route("/signup").post(Signup);
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/forgotpassword").post(isLoggedIn,forgotPassword)

//exporting the route
module.exports = router

