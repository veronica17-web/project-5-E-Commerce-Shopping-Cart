const express = require("express")
const router = express.Router()
const userController = require("../controller/userController");
const {authentication,authorization} = require("../middleware/auth");
const product = require("../controller/productcreate")

// ================ Start User Controller Api's ====================
router.post("/register", userController.createUser)

router.post("/login", userController.login)

router.get("/user/:userId/profile", authentication, userController.getUserProfile)

router.put("/user/:userId/profile",authentication, authorization, userController.updateUser)
// ======================== End =================================
// ================ Start Product Controller Api's ====================
router.post("/products", product.createProduct)
// ======================== End =================================
router.all("/*",function(req,res){
    return res.status(404).send({status:false,message:"Url Not Found"})
})


module.exports = router 










