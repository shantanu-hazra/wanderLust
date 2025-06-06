const Listings = require("../models/listings");
const Reviews = require("../models/reviews.js"); 

module.exports.postReview=async (req,res)=>{
  let newReview =new Reviews(req.body.reviews);
  let updatedListings = await Listings.findById(req.params.id);
  updatedListings.reviews.push(newReview);
  newReview.author=req.user._id;
  
  await newReview.save()
  await updatedListings.save()

  req.flash("success","Review has been created!");
  res.redirect(`/listings/${req.params.id}`)
};

module.exports.deleteReview=async (req,res)=>{
  let {id, reviewId}=req.params;
  
  await Listings.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Reviews.findByIdAndDelete(reviewId);

  req.flash("success","Review has been deleted!");
  res.redirect(`/listings/${id}`);
}