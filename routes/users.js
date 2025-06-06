const express=require("express");
const router=express.Router();
const passport=require("passport");
const {redirectURL}=require("../middleware.js");
const userControllers= require("../controllers/users.js");

// requiring models
const wrapAsync = require("../util/wrapAsync.js");

// sign-up route
router.get("/register",userControllers.renderSignUp)
router.post("/register",wrapAsync(userControllers.storeSignUpData));

//login route
router.get("/login",userControllers.renderLoginPage);
router.post("/login", redirectURL,
  passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userControllers.getTheUserLogin);

// logout page
router.get("/logout",userControllers.logOut);

module.exports =router;