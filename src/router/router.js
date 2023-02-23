//===============Import Express==================//
const express = require('express')

//==================Import middleware=======//
const auth = require('../middleware/auth')

//==================Import User Controller==========//
const {createUser , getUser ,getUserById ,getAllUser ,deleteUser} = require('../controller/userController')

//=================Use Router=====================//
const router = express.Router()


//==================Create User ==========//
router.post('/users',createUser)


//==================Get User By filter==========//
router.get('/getUser',auth,getUser)

//================Get User By Id=========//
router.get('/getUserById',auth,getUserById)

//================Get All User=========//
router.get('/getAllUser',auth ,getAllUser)

//================Delete User=========//
router.delete('/deleteUser',auth ,deleteUser)

// =====================Export Router===========//
module.exports = router 