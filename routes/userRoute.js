const express = require("express")
const router = express.Router()


//importing the controllers
const {Signup,login,logout,forgotPassword} = require("../controllers/userController")


//List of routes
router.route("/signup").post(Signup);
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/forgotpassword").post(forgotPassword)

//exporting the route
module.exports = router

