// ====================Import model==============================//
const userModel = require('../model/userModel')

//=======================Import bcrypt==========================//
const bcrypt = require('bcrypt')

//===========================Import Validation module======================//
const {isValid,isValidEmail,isValidPassword,isValidName,isValidObjectId,isValidRequestBody,isValidDOB} = require('../validation/validator')

//===========================Create User===============================//
const createUser = async (req, res) => {
    try {
        const data = req.body
        if(!isValidRequestBody(data)) return  res.status(400).send({status:false,message:'Body Should not be empty!'})
        const { email, password, name, dob } = data
        if (!email || !password || !name || !dob) {
            return res.status(400).send({status:false, message: 'All fields are required i.e email,password,name,dob' });
        }
        if(!isValidEmail(email)) return res.status(400).send({status:false,message:'email is invalid.'})
        let checkEmail = await userModel.findOne({email:email})
        if(checkEmail) return res.status(400).send({status:false,message : 'email alredy used! please use another email.'}); 

        if(!isValidPassword(password)) return res.status(400).send({status:false,message:'password is invalid! Please use minimum 8 character and maximum 15 character , 1 upercase , 1 lowercase , 1 numeric value and one special symbol'})

        if(!isValidName(name)) return res.status(400).send({status:false,message:'name is invalid'})

        if(!isValidDOB(dob)) return res.status(400).send({status:false,message:`Invalid date format. Please use format YYYY-MM-DD`})

        // use Bcrypted password in db
        let salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);

        const user = await userModel.create(data)
        const token = user.generateAuthToken()
        return res.status(201).send({status:true , data:token}); 
    } catch (error) {
        return res.status(500).send({status:false,message: error.message })
    }
};

//========================Get User By filter=============================//
const getUser = async (req,res) =>{
    try{
      let queries = req.query
      let response = await userModel.find({ $and: [queries, { isDeleted: false }] })
      if (response.length == 0) return res.status(404).send({ status: false, message: "No product found" }).select({_id:1,name:1 ,password:1,email:1,dob:1});;
      return res.status(200).send({status: true,message: 'list of all data',data:response})
    }catch(error){
       return res.status(500).send({status:false, message: error.message })
    }
}

//================================Get user By Id========================//
const getUserById = async (req,res)=>{
    try{
      let data = req.query.user_id
      if(!data)  return res.status(400).send({status:false,message:'provide user id!'})
      if(!isValidObjectId)  return res.status(400).send({status:false,message:'User id  is invalid.'})
      let getuser = await userModel.findById(data)
      if (!getuser || getuser.isDeleted === true) {
        return res.status(404).send({ status: false, message: "User does not exist" })
    }
      return res.status(200).send({status:false,message:'User found by given id', data:getuser})
    }catch(error){
       return res.status(500).send({ status:false ,message: error.message })
    }
}

//=============================Get all user===============================//
const getAllUser = async(req,res)=>{
    try{
      let data = await userModel.find()
      res.status(200).json({data})
    }catch(error){
        res.status(500).json({ status:false ,message: error.message })
    }
}

//=====================Delete User By Id==================================//
const deleteUser = async function (req, res) {
    try {
        const userId = req.query.user_id;
        if(!isValidObjectId) return res.status(400).send({status:false,message:'user id is invalid!'})
        let user = await userModel.findById(userId);
        // ===============================ID not present in db==========================================================
        if (!user)return res.status(400).send({ status: false, message: "user by this id not present in db" });

        // ===============================ID already deleted==========================================================
        if (user.isDeleted == true)  return res .status(404) .send({ status: false, message: "this user is already deleted" });
        if (user.isDeleted == false) {
            let userDeleted = await userModel.findByIdAndUpdate( { _id: userId },{ $set: { isDeleted: true, deletedAt: new Date() } }, { new: true } );
            return res.status(200).send({ status: true, message: "User is deleted successfully",data: userDeleted});
      }
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};
module.exports = { createUser , getUser , getUserById , getAllUser,deleteUser}