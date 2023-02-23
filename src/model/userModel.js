//========================Import mongoose==============//
const mongoose = require('mongoose')

//========================Import JWT==============//
const jwt = require('jsonwebtoken')

//========================Create Schema==============//
const userSchema = new mongoose.Schema({
    email: {
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },

    name:{
        type:String,
        required:true
    },

    dob:{
        type:Date,
        required:true
    },
    isDeleted : {
        type:Boolean,
        default:false
    }
},{timestamps:true});


// =================Generate Token for user==================//
userSchema.methods.generateAuthToken = ()=>{
    const user = this;
    const token = jwt.sign({userId: user._id },'your-secret-key',{expiresIn:'1h'});
    return token ;
}

// =================Export Schema============================//
module.exports = mongoose.model('User',userSchema)