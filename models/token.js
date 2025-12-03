 const mongoose = require('mongoose');

 const userSchema = new mongoose.Schema({
 userId : { type: mongoose.Schema.Types.ObjectId, ref: "User" , require : true},
 refreshToken : { type : String , require : true },
 accessToken : { type : String  },
 createdAt : { type : Date , default : Date.now , expires : '7d' }

 })

 module.exports = mongoose.model("Token", userSchema);