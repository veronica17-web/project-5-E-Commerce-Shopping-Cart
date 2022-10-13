const express = require("express")
const router = express.Router()
const userController = require("../controller/userController");
const productController = require("../controller/productController");
const {authentication,authorization} = require("../middleware/auth");


// ================ Start User Controller Api's ====================
router.post("/register", userController.createUser)

router.post("/login", userController.login)

router.get("/user/:userId/profile", authentication, userController.getUserProfile)

router.put("/user/:userId/profile",authentication, authorization, userController.updateUser)

// ================ Start Product Controller Api's ====================
router.post("/products",productController.createProduct)

router.put("/products/:productId", productController.updateProduct)

router.delete( "/products/:productId",productController.deletebyId)

router.get("/products", productController.getproducts)

router.get('/products/:productId',productController.getWithPath)

// ======================== End =================================
router.all("/*",function(req,res){
    return res.status(404).send({status:false,message:"Url Not Found"})
})


module.exports = router 










