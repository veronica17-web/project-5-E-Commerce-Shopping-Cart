const validator = require("../validator/validator")
const cartModel = require("../model/cartModel")
const productModel = require("../model/productModel")
const userModel = require("../model/userModel")

const CreateCart = async(req,res)=>{
    try {
       let requestBody = req.body
       let userId = req.params.userId

       const {productId, cartId} = requestBody

       if(validator.isValidBody(requestBody)){
           return res.status(400).send({status:false, message:"Provide some data inside the body "})
       }
       
       if(!validator.isValidObjectId(userId)){
        return res.status(400).send({status:false,message:"userId not valid"})
       }
       const user = await userModel.findById(userId)
       if(!user){
        return res.status(404).send({status:false, message:"user Not Found"})
       }
       if(cartId){
          if(!validator.isValid1(cartId)){
            return res.status(400).send({status:false,message:"cartId is required"})
          }
          if(!validator.isValidObjectId(cartId)){
            return res.status(400).send({status:false,message:"Cart Id not valid"})
          }
       }

        if(!validator.isValid1(productId)){
          return res.status(400).send({status:false,message:"productId is required"})
        }
        if(!validator.isValidObjectId(productId)){
          return res.status(400).send({status:false,message:"product  Id not valid"})
        }

        const CheckProduct = await productModel.findOne({_id:productId,isDeleted:false})
        if(!CheckProduct){
            return res.status(404).send({status:false,message:'Product Not found'})
        }
   
        const checkKartPresent = await cartModel.findOne({userId:userId})

        if(!checkKartPresent){
            const cartObject = {
                userId:userId,
                items:[{productId:productId,quantity:1}],
                totalPrice:CheckProduct.price,
                totalItems:1

            }
            const createkart = await cartModel.create(cartObject)
            return res.status(201).send({status:true,message:"Success",data:createkart})
        }

        if(checkKartPresent){
            if(checkKartPresent._id.toString() !== cartId){
                return res.status(404).send({status:false,message:"Cart Not found"})
            }
        }
       let array = checkKartPresent.items
       for(let i = 0 ; i<array.length; i++){
        if(array[i].productId == productId){
            array[i].quantity = array[i].quantity + 1
            const updateKart = await cartModel.findOneAndUpdate(
                {userId:userId},
                {
                    items : array,
                    
                }
            )
        }

       }

         

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = {CreateCart}