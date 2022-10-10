const userModel = require("../model/userModel");

const bcrypt = require('bcrypt');
const aws = require('../aws/aws.js')




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


 module.exports.createUser = createUser