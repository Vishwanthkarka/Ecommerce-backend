const mongoose = require("mongoose")

const  productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        maxlength:[120,"max Length to enter is 120 words"],
        trim:true

    },
    description:{
type:String,
required:true,
minlength:[20,"Min length should be 80"],
trim:true
    },
    price:{
        type:Number,
        required:true,
    },
    photos: [
        {
          id: {
            type: String,
            required: true,
          },
          secure_url: {
            type: String,
            required: true,
          },
        },
      ],
    // photo:[
    //     {
    //         id:{
    //             type:String,
    //             required:true
    //         },
       
    //         secure_url:{
    //         type:String,
    //         required:true

    //     }

    //     }
    // ],
    category:{
        type:String,
        required:true,
        enum:{
            values: ["mobiles","laptops",],
            message:"select from the list "
        }


    },
    stock: {
        type: Number,
        required: [true, "please add a number in stock"],
      },
      brand: {
        type: String,
        required: [true, "please add a brand for clothing"],
      },
      ratings: {
        type: Number,
        default: 0,
      },
      numberOfReviews: {
        type: Number,
        default: 0,
      },
      reviews: [
        {
          user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
          rating: {
            type: Number,
            required: true,
          },
          comment: {
            type: String,
            required: true,
          },
        },
      ],
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
})

module.exports = mongoose.model("Product", productSchema);
