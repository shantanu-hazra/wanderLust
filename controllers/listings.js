const Listings = require("../models/listings");
const Users = require("../models/user.js");

module.exports.homeListings = async (req, res) => {
  let allListings = await Listings.find();
  res.render("listings/home.ejs", { allListings });
};

module.exports.deleteListings = async (req, res) => {
  let id = req.params.id;
  if (await Listings.findByIdAndDelete(id)) {
    req.flash("success", "Listing has been deleted!");
    res.redirect("/listings");
  }
};

module.exports.showNewListingForm = (req, res) => {
  res.render("listings/new.ejs");
};
module.exports.addNewListings = async (req, res) => {
  let newListings = new Listings(req.body.listings);
  if (req.body.image) {
    newListings.image.url = req.body.image;
  } else {
    newListings.image.url =
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGFrZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60";
    newListings.image.filename =
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pexels.com%2Fsearch%2Fscenery%2F&psig=AOvVaw2umnq9ZDcbTMtUPHMbc94U&ust=1729503711851000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNiQoMbVnIkDFQAAAAAdAAAAABAJ";
  }
  newListings.owner = res.locals.currUser;
  await newListings.save().catch((err) => {
    console.log(err);
  });
  req.flash("success", "New listing had been added!");
  res.redirect("/listings");
};

module.exports.displayListings = async (req, res) => {
  let id = req.params.id;

  let listings = await Listings.findById(`${id}`)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listings) {
    req.flash("error", "The listing does not exist..");
    return res.redirect("/listings");
  }
  let currUser;
  if (res.locals.currUser) {
    currUser = res.locals.currUser;
  }
  res.render("listings/display.ejs", {
    listings,
    theReviews: listings.reviews,
    currUser,
  });
};

module.exports.showUpdateForm = async (req, res) => {
  let id = req.params.id;
  let listings = await Listings.findById(`${id}`);
  res.render("listings/edit.ejs", { listings });
};
module.exports.UpdateTheListing = async (req, res) => {
  let { id } = req.params;

  await Listings.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    Listings.image = { url, filename };
    Listings.save();
  }
  req.flash("success", "Listing has been editted!");
  res.redirect("/listings");
};
