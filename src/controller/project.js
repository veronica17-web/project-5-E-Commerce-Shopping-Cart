const productModel = require('../model/productModel');
const validator = require("../validator/validator");
const aws = require('../AWS/aws');




const updateProduct = async (req, res) => {
    try{
        let productId = req.params.productId
        let getId = await productModel.findOne({ _id: productId })
        if (!getId) {
            return res.status(404).send({ status: false, message: "Product Not Found for the request id" });
        }
        if (getId.isDeleted == true) {
            return res.status(404).send({ status: false, message: "Product is already deleted " });
        }

        let data = req.body;
        let files = req.files;


        let productImgUrl = await aws.uploadFile(files[0]);
            data.productImage = productImgUrl;

            if (data.title || data.title == "string") {
                if (validator.isValid(data.title)) {
                    return res.status(400).send({ status: false, message: "title should not be empty String" })
                }
    
                //Check the title for duplicate
                let duplicateTitle = await productModel.findOne({ title: data.title })
                if (duplicateTitle) {
                    return res.status(400).send({ status: false, message: "title is already present in database" })
                }
            }
            
    
            if (data.description || data.description == "string") {
                
                if (validator.isValidString(data.description)) {
                    return res.status(400).send({ status: false, message: "Description should not contains numbers" })
                }
            }
            // price validation
    
            // value shouldnt be empty--- validation
            if (data.price || data.price == "string") {
                if (!(validator.isValidString(data.price) && validator.isValidPrice(data.price))) return res.status(400).send({ status: false, message: "Price of product should be valid and in numbers" });
            }
            //  currency validation
    
            if (data.currencyId || typeof data.currencyId == 'string') {
                //checking for currencyId 
                if (validator.isValid(data.currencyId)) return res.status(400).send({ status: false, message: "Currency Id of product should not be empty" });
    
                if (!(/INR/.test(data.currencyId))) return res.status(400).send({ status: false, message: "Currency Id of product should be in uppercase 'INR' format" });
            }
            
    
            if (data.currencyFormat || typeof data.currencyFormat == 'string') {
                //checking for currency formate
                if (validator.isValid(data.currencyFormat)) return res.status(400).send({ status: false, message: "Currency format of product should not be empty" });
    
                if (!(/₹/.test(data.currencyFormat))) return res.status(400).send({ status: false, message: "Currency format of product should be in '₹' " });
            }
            // free shipping validation
            if (data.isFreeShipping || typeof data.isFreeShipping == 'string') {
                if (validator.isValid(data.isFreeShipping)) return res.status(400).send({ status: false, message: "isFreeShipping should not contain white spaces" });
                //if the user given any whitespace
                data.isFreeShipping = data.isFreeShipping.toLowerCase().trim();//trim the whitespaces
                if (data.isFreeShipping == 'true' || data.isFreeShipping == 'false') {
                    //convert from string to boolean
                    data.isFreeShipping = JSON.parse(data.isFreeShipping);
                } else {
                    return res.status(400).send({ status: false, message: "Please enter either 'true' or 'false'" })
                }
            }
    
            // style validation
            if (data.style || typeof data.style == 'string') {
                if (validator.isValid(data.style)) return res.status(400).send({ status: false, message: "Style should be valid an does not contain numbers" });
                if (validator.isValidString(data.style)) return res.status(400).send({ status: false, message: "Style should be valid an does not contain numbers" });
            }
            // availablesizes 
            if (data.availableSizes || typeof data.availableSizes == 'string') {
                //checking for available Sizes of the products
                let size = data.availableSizes.toUpperCase().split(",") //creating an array
                data.availableSizes = size;
    
                for (let i = 0; i < data.availableSizes.length; i++) {
                    if (!validator.isValidSize(data.availableSizes[i])) {
                        return res.status(400).send({ status: false, message: "Sizes should one of these - 'S', 'XS', 'M', 'X', 'L', 'XXL' and 'XL'" })
                    }
                }
            }
    
            if (data.installments || typeof data.installments == 'string') {
                if (!validator.isValidString(data.installments)) return res.status(400).send({ status: false, message: "Installments should be in numbers and valid" });
            }
    
            let updatedProduct = await productModel.findByIdAndUpdate(
                { _id: productId },
                data,
                { new: true }
            )
            return res.status(200).send({ status: true, message: "Product updated successfully", data: updatedProduct })
    
        }
        catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    }
    

        module.exports = { updateProduct}