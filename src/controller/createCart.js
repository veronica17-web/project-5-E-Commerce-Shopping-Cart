const validator = require("../validator/validator")
const cartModel = require("../model/cartModel")
const productModel = require("../model/productModel")
const userModel = require("../model/userModel")

const CreateCart = async (req, res) => {
    try {
        let requestBody = req.body
        let userId = req.params.userId

        const { productId, cartId } = requestBody

        if (validator.isValidBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Provide some data inside the body " })
        }

        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "userId not valid" })
        }
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).send({ status: false, message: "user Not Found" })
        }
        if (cartId) {
            if (!validator.isValid1(cartId)) {
                return res.status(400).send({ status: false, message: "cartId is required" })
            }
            if (!validator.isValidObjectId(cartId)) {
                return res.status(400).send({ status: false, message: "Cart Id not valid" })
            }
        }

        if (!validator.isValid1(productId)) {
            return res.status(400).send({ status: false, message: "productId is required" })
        }
        if (!validator.isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "product  Id not valid" })
        }

        const CheckProduct = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!CheckProduct) {
            return res.status(404).send({ status: false, message: 'Product Not found' })
        }

        const checkCartPresent = await cartModel.findOne({ userId: userId })

        if (!checkCartPresent) {
            const cartObject = {
                userId: userId,
                items: [{ productId: productId, quantity: 1 }],
                totalPrice: CheckProduct.price,
                totalItems: 1

            }
            const createCart = await cartModel.create(cartObject)
            return res.status(201).send({ status: true, message: "Success", data: createCart })
        }

        if (checkCartPresent) {
            if (checkCartPresent._id.toString() !== cartId) {
                return res.status(404).send({ status: false, message: "Cart Not found" })
            }
        }
        let array = checkCartPresent.items
        for (let i = 0; i < array.length; i++) {
            if (array[i].productId == productId) {
                array[i].quantity = array[i].quantity + 1
                const updateCart = await cartModel.findOneAndUpdate(
                    { userId: userId },
                    {

                        items: array,
                        totalPrice: checkCartPresent.totalPrice + CheckProduct.price

                    }, { new: true }
                )
                return res.status(201).send({ status: true, message: "Success", data: updateCart })
            }
        }

        const cartObject = {
            $addToSet: { items: { productId: productId, quantity: 1 } },
            totalPrice: checkCartPresent.totalPrice + CheckProduct.price,
            totalItems: checkCartPresent.totalItems + 1,
        }

        const cartUpdate = await cartModel.findOneAndUpdate({ userId: userId }, cartObject, { new: true })

        return res.status(201).send({ status: true, message: "Success", data: cartUpdate })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const updateCart = async (req, res) => {
    try {
        let requestBody = req.body
        let userId = req.params.userId

        const { productId, cartId, removeProduct } = requestBody

        if (validator.isValidBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Provide some data inside the body " })
        }

        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "userId not valid" })
        }
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).send({ status: false, message: "user Not Found" })
        }

        if (!validator.isValid1(cartId)) {
            return res.status(400).send({ status: false, message: "cartId is required" })
        }
        if (!validator.isValidObjectId(cartId)) {
            return res.status(400).send({ status: false, message: "Cart Id not valid" })
        }
         const checkCart = await cartModel.findById(cartId)
         if(!checkCart){
            return res.status(404).send({status:false, message:'Cart Not Found'})
         }

        if (!validator.isValid1(productId)) {
            return res.status(400).send({ status: false, message: "productId is required" })
        }
        if (!validator.isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "product  Id not valid" })
        }

        const CheckProduct = await productModel.findOne({ _id: productId, isDeleted: false })

        if (!CheckProduct) {
            return res.status(404).send({ status: false, message: 'Product Not found' })
        }

        if(!validator.isValid1(removeProduct)){
            return res.status(400).send({status:false, message:"removeProduct key required"})
        }

        if(!/1|0/.test(removeProduct)){
            return res.status(400).send({status:false, message:"removeProduct must be 0 or 1"})
        }
        if(removeProduct == 1){
           let productPrice = CheckProduct.price
        }


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { CreateCart, updateCart }