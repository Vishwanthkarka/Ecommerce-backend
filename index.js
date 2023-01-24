const express = require("express")
const app = require("./app")
require("dotenv").config();
const connectWithDb = require("./config/db")
const cloudinory = require("cloudinary")

//connecting with the database
connectWithDb()

//configuring cloudinary 
cloudinory.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_KEY ,
    api_secret:process.env.CLOUDINARY_SECRET
})

app.listen(process.env.port,()=> {console.log("Server is running")})