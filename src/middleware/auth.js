// -------------------Import JWT-------------------------// 
const jwt = require('jsonwebtoken')

//--------------------⭐Authorization⭐--------------------// 
const auth = (req,res,next) =>{
    const token = req.header('Authorization');
// ---------------------Check Token present or not-----------//
    if(!token)
    return res.status(401).json({error : 'Access denied. No token provided.'})

    try {
        // ---------------Verify token of user--------------//
        const decoded = jwt.verify(token, 'your-secret-key');
        req.user = decoded ;
        next();
    }catch(err){
        // -------------if token is invalid-----------------//
        return res.status(400).json({error:'Invalid token.'})
    }
};

module.exports = auth 