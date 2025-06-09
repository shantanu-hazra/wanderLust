const mongoose = require("mongoose");
const review = require("./reviews.js");
const reviews = require("./reviews.js");
const { data } = require("../init/data.js");

// // establishing the connection with db
// let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// main().then(
//   console.log("connected to the database in listings")
// )
//   .catch((err) => console.log(err));

// async function main() {
//   await mongoose.connect(MONGO_URL);
// }

let listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    url: {
      type: String,
      set: (v) => {
        return v === ""
          ? "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGFrZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
          : v;
      },
    },
    filename: {
      type: String,
      set: function (value) {
        return value || "default-image.jpg";
      },
    },
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "reviews",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// listingSchema.post("findOneAndDelete", async (listing)=>{
//   if(listing){
//   await reviews.deleteMany({_id:{$in: listing.reviews}});
//   }
// })

const listings = mongoose.model("listings", listingSchema);

// listings.insertMany(data);

module.exports = listings;
