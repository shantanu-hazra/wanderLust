const mongoose=require("mongoose");

reviewSchema= new mongoose.Schema({
  rating:Number,
  review:String,
  onAt: {
    type:Date,
    default: new Date(),
  },
  author:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
})

module.exports=mongoose.model("reviews",reviewSchema);