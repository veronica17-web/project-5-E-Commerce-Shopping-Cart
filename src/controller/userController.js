const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const aws = require('../aws/aws.js')
const validator = require("validator")


const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}

const isValidPassword = (password) => {
    if (password.length > 7 && password.length < 16) return true
}

const isValidObjectId = (objectId) => {
    return mongoose.isValidObjectId(objectId)
}

const createUser = async (req, res) => {
    try {   
    let data = req.body;
    let files = req.files;

    let { fname, lname, email, password, phone } = data;

    if (!fname) return res.status(400).send({ status: false, message: "First name is required" });

    if (!lname) return res.status(400).send({ status: false, message: "Last name is required" })

    if (!email) return res.status(400).send({ status: false, message: "User Email-id is required" });

    let duplicateEmail = await userModel.findOne({ email: email })
    if (duplicateEmail) return res.status(400).send({ status: false, message: "Email already exist" })


    if (!phone) return res.status(400).send({ status: false, message: "User Phone number is required" });

    let duplicatePhone = await userModel.findOne({ phone: phone })
        if (duplicatePhone) return res.status(400).send({ status: false, message: "Phone already exist" })

 if (!password) return res.status(400).send({ status: false, message: "Password is required" });

      //bcrypt
      data.password = await bcrypt.hash(password, 10);


      //aws
      let profileImgUrl = await aws.uploadFile(files[0]);
        data.profileImage = profileImgUrl;

        let responseData = await userModel.create(data);
        return res.status(201).send({ status: true, message: "User created successfully", data: responseData })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const login = async (req, res) => {
    try {
        userDetails = req.body
        if (!Object.keys(userDetails) > 0) {
            return res.status(400).send({ status: false, message: "Please Enter Email or Password" })
        }

        const { email, password } = userDetails
        // ================================>> Email Validation <<===============================================

        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: " Email Id Is required" })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).send({ status: false, message: " Email Id Is Not Valid" })
        }

        const isEmailExists = await userModel.findOne({ email: email })
        if (!isEmailExists) return res.status(401).send({ status: false, message: "Email is Incorrect" })
        // ==============================>> Password Validation <<=================================================
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: " Password Is required" })
        }

        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, message: "Please provide a valid password ,Password should be of 8 - 15 characters", })
        }
        const isPasswordMatch = await bcrypt.compare(password, isEmailExists.password)
        if (!isPasswordMatch) return res.status(401).send({ status: false, message: "Password is Incorrect" })

        // ===============================>> Create Jwt Token <<=====================================================

        const token = jwt.sign(
            { userId: isEmailExists._id.toString() },
            "Project-5-shoppingCart-group18",
            { expiresIn: '24h' }
        )
        // ================================>> Make Respoense <<======================================================
        let result = {
            userId: isEmailExists._id.toString(),
            token: token,
        }

        res.status(200).send({ status: true, message: "Login Successful", data: result })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const getUserProfile = async (req, res) => {
    try {
        let userId = req.params.userId
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: " Invalid userId" })
        }
        
        const userProfile = await userModel.findById(userId)

        if(!userProfile){
            return res.status(404).send({status:false, message:"User Profile Not Found"})
        }
        res.status(200).send({status:true,data:userProfile})
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

let updateUser = async function(req,res){
    let userId = req.params.userId
   let data = req.body
    let userData = await userModel.findOneAndUpdate({_id:userId},data,{new:true})
   
   if(!userData){return res.status(404).send({satus:false,message:"no user found to update"})}
   return res.status(200).send({satus:true,message:"success",data:userData})
   
   }

 module.exports = {createUser, login, getUserProfile, updateUser}