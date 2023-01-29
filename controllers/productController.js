const CustomError = require("../utils/customError")
const BigPromise = require("../middlewares/bigPromise")
const WhareClause = require("../utils/whareClause")
const Product = require("../models/product");
const cloudinary = require("cloudinary");

exports.addProduct = BigPromise(async(req,res,next) => {
let imageArray = []
if (!req.files) {
    return next(new CustomError("images are required", 401));
  }
 
if(req.files){
    for(let i=0; i<req.files.photo.length; i++){ // iteating and uploading images
       console.log(i) 
       let result = await cloudinary.v2.uploader.upload(
            req.files.photo[i].tempFilePath,{
                folder:"products"
            }
            
        )
       
        // imageArray.push({ // pushing to the array 
        //     id: result.public_id,
        //     secure_url: result.secure_url,
        // })
        imageArray.push({
            id: result.public_id,
            secure_url: result.secure_url,
          });
    }
console.log(imageArray)

}
req.body.photos = imageArray; // replacing the user inputed images to the cloudinary links
req.body.user = req.user.id // adding the user id 

const product =await Product.create(req.body);

res.status(200).json({
    success:true,
   photo: product.photos
})
})


exports.getAllProducts = BigPromise(async(req,res,next)=>{
    const resultPerPage = 6;
    const totalcountProduct = Product.countDocuments();
    const productsObj = new WhareClause(Product.find(),req.query).search().filter()
    let products = await productsObj.base;
    const filteredProductNumber = products.length;
    productsObj.pager(resultPerPage);
    // products = await productsObj.base.clone();
    res.status(200).json({
        success: true,
        products,
        filteredProductNumber,
      });
})

exports.getOneProduct = BigPromise(async(req,res,next)=>{
let product =await Product.findById(req.params.id)

if(!product){
    next(new CustomError("No product is present with the id",400))
}
res.status(200).json({
    success: true,
    product,
  });
})

exports.addReview = BigPromise(async(req,res,next)=>{
    const {productId, rating,comment} = req.body
    const review = { // maked the object  to push
        user:req.user.id,
        name:req.user.name,
        rating:Number(rating),
        comment
    }
    const product = await Product.findById(productId)
const AlreadyReview = product.reviews.find((rev)=> rev.user.toString() === req.user._id.toString()) // we used array method find 
if(AlreadyReview){
product.review.forEach((review)=>{
    if(review.user.toString() === req._id.toString()){
        review.comment = comment,
        review.rating = rating
    }
})
}
else{
    product.reviews.push(review);
    product.numberOfReviews = product.reviews.length;
}
// ajusting the rating of the product
product.ratings = product.reviews.reduce((acc,item)=> item.rating+acc, 0)/ product.reviews.length

await product.save({validateBeforeSave: false })
res.status(200).json({
    success: true,
  });

})