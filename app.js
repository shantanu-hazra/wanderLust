// requiring the cloud
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

//requiring the packages
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");

const Reviews = require("./models/reviews.js");
const Listings = require("./models/listings.js");
const User = require("./models/user.js");

const reviewRoutes = require("./routes/reviews.js");
const listingRoutes = require("./routes/listings.js");
const userRoutes = require("./routes/users.js");

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set(path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

//establishing the connection with db
let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(console.log("connected to the database"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

//data insertion
//Listings.insertMany(data).then("data submitted").catch((err)=>{console.log(err)});

//root route
app.get("/", (req, res) => {
  res.send("this is the root route");
});

const sessionOptions = {
  secret: "MysecretCode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 3 * 24 * 60 * 60 * 1000,
    maxAge: 3 * 24 * 60 * 60 * 1000,
    httpOnly: true, //t prevent cross scripting attacks
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Listings paths
app.use("/", listingRoutes);
//Reviews paths
app.use("/:id/review", reviewRoutes);
// user paths
app.use("/", userRoutes);

// Error handlers
app.all("*", (err, req, res, next) => {
  res.status("404").send.message("Page not found :(");
});

app.use((err, req, res, next) => {
  console.log(err);
  let { statusCode, message } = err;
  console.log("something went wrong");
  res.render("listings/error.ejs", { message });
});

// port connection
let port = 8080;
app.listen(port, (req, res) => {
  console.log(`listening to port: ${port}`);
});
