const mongoose=require("mongoose");
const initData=require("./data.js");
const listingModel=require("../models/listings.js");

//establishing the connection with db
let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(
  console.log("connected to the database")
)
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB= async()=>{
  await listingModel.deleteMany({});
  initData.data=initData.data.map((obj)=>({...obj, owner:"66ad192a4664f314725d893b"}));
  await listingModel.insertMany(initData.data);
  console.log("Data was initialized");
}

initDB();
mongoose.connection.close();