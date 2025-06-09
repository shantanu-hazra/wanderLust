const userModel = require("../models/user.js");

module.exports.renderSignUp = (req, res) => {
  res.render("users/signUpPage.ejs");
};
module.exports.storeSignUpData = async (req, res) => {
  try {
    let { email, username, password } = req.body;
    let newUser = new userModel({ email, username });

    const registeredUser = await userModel.register(newUser, password);
    console.log(registeredUser);

    req.login(registeredUser, function (err) {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/register");
  }
};

module.exports.renderLoginPage = (req, res) => {
  res.render("users/loginPage.ejs");
};
module.exports.getTheUserLogin = async (req, res) => {
  req.flash("success", "Welcome to Wanderlust");
  if (res.locals.redirectURL) {
    return res.redirect(res.locals.redirectURL);
  }
  res.redirect("/listings");
};

module.exports.logOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have been logged out!");
    res.redirect("/listings");
  });
};
