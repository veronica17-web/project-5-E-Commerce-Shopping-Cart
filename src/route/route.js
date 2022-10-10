const express = require("express")
const router = express.Router()
const userController = require("../Controllers/user")


// ================== Login Api ==================
router.post("/login", userController.login)

// ============== Get user Profile api=============

router.get("/user/:userId/profile",userController.getUserProfile)


module.exports = router 