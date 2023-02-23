
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const router = require('./router/router')

const app = express()

app.use(bodyParser.json())

mongoose.set('strictQuery',true)
// ===============Connect with DB=====================//
mongoose.connect('mongodb+srv://Chanchal25-DB:ZHrSPQhp8HuOM2Yy@cluster0.ypi01as.mongodb.net/user_Manaagement',{
    useNewUrlParser : true 
})
.then(()=>{
    console.log('MongoDb is connected');
})
.catch((err)=>{
    console.log(err);
})

// =================Global middleware==========================//
app.use('/',router);

// ===================Error handle if we use different url apart from api=================//
app.all("/*", function (req, res) {
    res.status(404).send({ status: false, message: "Incorrect URL! Please enter valid Url" });
});

// ====================listen port for server========================//
app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});