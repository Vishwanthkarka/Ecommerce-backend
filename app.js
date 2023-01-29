const express = require('express');
const morgan = require('morgan');
const app = express();
const cookieParser = require("cookie-parser")
const fileUpload = require("express-fileupload")


//regular middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//cookie and file middleware
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}))


// morgen middleware
app.use(morgan("tiny"))


//temp check
app.set("view engine", "ejs");

// importing the all the routes
const demo = require("./routes/demo")
const userRoute = require("./routes/userRoute")
const productRoute =  require("./routes/productRoute")


//using middleware
app.use("/v1/",demo)
app.use("/api/v1",userRoute)
app.use("/api/v1",productRoute)
app.get("/signuptest", (req, res) => {
    res.render("signuptest");
  });

//exporting the app
module.exports = app