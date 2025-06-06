const express=require("express");
const wrapAsync=require("../util/wrapAsync.js");
const Reviews=require("../models/reviews.js");
const Users=require("../models/user.js");
const Listings = require("../models/listings.js");
const {isLoggedIn, validateReviews, isReviewOwner}=require("../middleware.js");
const { reviewSchema } = require("../schema.js");
const methodOverride = require('method-override');
const reviewController=require("../controllers/reviews.js");

const app=express();
app.use(methodOverride('_method'));
const router=express.Router({mergeParams:true});


// posting a review
router.post("/", validateReviews
, isLoggedIn, wrapAsync(reviewController.postReview))

// deleting a review
router.delete("/:reviewId", isLoggedIn,isReviewOwner, wrapAsync(reviewController.deleteReview));

module.exports=router;