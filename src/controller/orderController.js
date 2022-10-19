const validator = require("../validator/validator")
const cartModel = require("../model/cartModel")
const productModel = require("../model/productModel")
const userModel = require("../model/userModel")
const orderModel = require("../model/orderModel")


const createOrder = async (req, res) => {
    try {
        let requestBody = req.body
        let userId = req.params.userId

        const { cartId, status, cancellable } = requestBody

        if (validator.isValidBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Provide some data inside the body " })
        }
        // status validation Start
        if (status) {
            if (!validator.isValidStatus(status)) {
                return res.status(400).send({ status: false, message: "Status  must be among pending, completed, cancelled" })
            }
        }

        //end status validation
        //cancellable validation Start
        if (cancellable) {
            if (!/true|false/.test(cancellable)) {
                return res.status(400).send({ status: false, message: "cancellable must be a boolean value True False" })
            }
        }

        // User Validation
        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "userId not valid" })
        }
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).send({ status: false, message: "user Not Found" })
        }
        /// End user Validation
        // Cart Validation start
        if (!validator.isValid1(cartId)) {
            return res.status(400).send({ status: false, message: "cartId is required" })
        }
        if (!validator.isValidObjectId(cartId)) {
            return res.status(400).send({ status: false, message: "Cart Id not valid" })
        }
        const checkCartPresent = await cartModel.findOne({ _id: cartId, userId: userId })
        if (!checkCartPresent) return res.status(404).send({ status: false, message: "Cart Not Found" })
        //End Cart Validation
        let arrItem = checkCartPresent.items

        if (arrItem.length == 0) {
            return res.status(400).send({ status: false, message: "Cart Is empty" })
        }

        let totalQuantity = 0
        for (let i of arrItem) {
            totalQuantity = totalQuantity + i.quantity
        }

        let order = {
            userId: userId,
            items: arrItem,
            totalPrice: checkCartPresent.totalPrice,
            totalItems: checkCartPresent.totalItems,
            totalQuantity: totalQuantity,
            cancellable: cancellable,
            status: status,
        }

        const orderCreated = await orderModel.create(order)
        await cartModel.updateOne({ _id: checkCartPresent._id },
            { items: [], totalPrice: 0, totalItems: 0 });
        const Orders = { ...orderCreated.toObject() }
        delete Orders.__v
        delete Orders.isDeleted
        return res.status(201).send({ status: true, message: "success", data: Orders })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const updateOrder = async (req, res) => {
    try {
        let requestBody = req.body
        let userId = req.params.userId

        const { orderId, status } = requestBody

        if (validator.isValidBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Provide some data inside the body " })
        }
        // status validation Start
        if (!validator.isValid1(status)) {
            return res.status(400).send({ status: false, message: "status is required" })
        }
        if (!validator.isValidStatus(status)) {
            return res.status(400).send({ status: false, message: "Status  must be among pending, completed, cancelled" })
        }
        //end status validation

        // User Validation
        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "userId not valid" })
        }
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).send({ status: false, message: "user Not Found" })
        }
        /// End user Validation
        // Cart Validation start
        if (!validator.isValid1(orderId)) {
            return res.status(400).send({ status: false, message: "order id is required" })
        }
        if (!validator.isValidObjectId(orderId)) {
            return res.status(400).send({ status: false, message: "order Id not valid" })
        }
        const checkOrder = await orderModel.findOne({ _id: orderId, userId: userId, cancellable: true, isDeleted: false })
        if (!checkOrder) {
            return res.status(404).send({ status: false, message: "Order Not Found" })
        }
        const orderUpdated = await orderModel.findByIdAndUpdate({ _id: orderId }, { $set: { status: status } }, { new: true })
        const Orders = { ...orderUpdated.toObject() }
        delete Orders.__v
        delete Orders.isDeleted
        return res.status(201).send({ status: true, message: "success", data: Orders })


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createOrder, updateOrder }