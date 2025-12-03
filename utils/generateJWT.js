const jwt = require('jsonwebtoken')

module.exports= async (payload ,token=process.env.JWT_SECRET , expiresIn="1d")=>{
    const _token = await jwt.sign(payload, token, { expiresIn: expiresIn })
    return _token
}