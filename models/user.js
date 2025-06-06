const mongoose=require("mongoose");
let Schema = new mongoose.Schema;
const passportLocalMongooose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email:{
    type:String,
    required:true,
  },
})

userSchema.plugin(passportLocalMongooose);

module.exports= mongoose.model("User", userSchema);