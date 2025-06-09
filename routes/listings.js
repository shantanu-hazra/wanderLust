const express = require("express");
const app = express();
const wrapAsync = require("../util/wrapAsync.js");
const { reviewSchema } = require("../schema.js");
const Reviews = require("../models/reviews.js");
const Listings = require("../models/listings.js");
const Users = require("../models/user.js");
const methodOverride = require("method-override");
const listingsController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const { isLoggedIn, isOwner } = require("../middleware.js");
app.use(methodOverride("_method"));
const router = express.Router({ mergeParams: true });

//home route
router.get("/", listingsController.homeListings);

//deletion route
router.post("/:id/delete", isOwner, listingsController.deleteListings);

//new route
router.get("/new", isLoggedIn, listingsController.showNewListingForm);
router.post("/new", wrapAsync(listingsController.addNewListings));

//show route
router.get("/:id", listingsController.displayListings);

//update route
router.get("/:id/edit", listingsController.showUpdateForm);
router.put(
  "/:id",
  isOwner,
  isLoggedIn,
  upload.single("listings[image]"),
  listingsController.UpdateTheListing
);

module.exports = router;
