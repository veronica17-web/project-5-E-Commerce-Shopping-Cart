const express = require('express');
const route = require('./route/route');
const  mongoose  = require('mongoose');
const app = express(); 

const multer= require("multer");

app.use( multer().any())

app.use(express.json());

mongoose.connect("mongodb+srv://jitendra7999:Kunal8602@cluster0.2quthrr.mongodb.net/group18Database", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))



app.use('/', route)

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
})