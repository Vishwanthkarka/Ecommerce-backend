const express = require("express")
const router = express.Router()

// importing the controller
const {dummy} = require("../controllers/dummy")



router.route("/").get(dummy)


module.exports = router
