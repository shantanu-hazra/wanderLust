const {reviewSchema}=require("./schema.js")
const ExpressError=require("./util/ExpressError.js")
const Listings=require("./models/listings.js")

module.exports.isLoggedIn=(req,res,next)=>{
  if(!req.isAuthenticated()){
    req.session.redirectUrl=req.originalUrl;
    req.flash("error","Please login to create a new listing");
    return res.redirect("/login");
  }
  next()
};

module.exports.redirectURL=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectURL=req.session.redirectUrl;
    console.log(req.session.redirectURL);
  }
  next();
}

module.exports.isOwner= async (req,res,next)=>{
  let {id}= req.params;
  let listing= await Listings.findById(id);

  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of the listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.validateReviews = (req,res,next)=>{
  let data=req.body;
  let {error}=reviewSchema.validate(data);
  if(error){
    let errMsg=error.details.map((ele)=>ele.message).join(",");
    throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }
}

module.exports.isReviewOwner= async(req,res,next)=>{
  let {reviewId}=req.params;
  let review=await Reviews.findById(reviewId);
  
  if(!res.locals.currUser._id.equals(review.author._id)){
    req.flash("error","You are not the owner of the review")
    return res.redirect(`/listings/${id}`);
  }
}