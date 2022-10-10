const express = require("express")
const router = express.Router()
const userController = require("../controller/userController");
const {authentication,authorization} = require("../middleweres/auth")
router.post("/register", userController.createUser)
// ================== Login Api ==================
router.post("/login", userController.login)

// ============== Get user Profile api=============

router.get("/user/:userId/profile", authentication, userController.getUserProfile)

router.put("/user/:userId/profile",authentication, authorization, userController.updateUser)


module.exports = router 










