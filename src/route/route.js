const express = require("express")
const router = express.Router()
const userController = require("../controller/userController");
const {authentication,authorization} = require("../middleware/auth");
const userModel = require("../model/userModel");


router.post("/register", userController.createUser)
// ================== Login Api ==================
router.post("/login", userController.login)

// ============== Get user Profile api=============

router.get("/user/:userId/profile", authentication, userController.getUserProfile)

router.put("/user/:userId/profile",authentication, authorization, userController.updateUser)

router.all("/*",function(req,res){
    return res.status(404).send({status:false,message:"Url Not Found"})
})


module.exports = router 










