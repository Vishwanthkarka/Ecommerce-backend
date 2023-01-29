const express = require("express")
const router = express.Router()
const {addProduct,getAllProducts,getOneProduct,addReview} = require("../controllers/productController")
const {isLoggedIn} = require("../middlewares/user")


router.route("/admin/product/add").post(isLoggedIn,addProduct)
router.route("/admin/allproduct").get(isLoggedIn,getAllProducts)
router.route("/admin/product/:id").get(isLoggedIn,getOneProduct)
router.route("/review").put(isLoggedIn, addReview);
module.exports = router 