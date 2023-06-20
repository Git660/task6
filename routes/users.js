const mongoose = require ('mongoose');
var plm=require('passport-local-mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/newdb")
var userSchema=mongoose.Schema({
  username:String,
  password:String,
  email:String,
  number:Number,
  profilepic:String,
  like:{
    default:[],
    type:Array,
  }
})
userSchema.plugin(plm)

module.exports = mongoose.model("user",userSchema);
