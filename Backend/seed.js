import mongoose, { model } from "mongoose";

// connect DB
mongoose.connect("mongodb://127.0.0.1:27017/marketplace")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// schema (same as server)
const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  image: String,
});

const Listing = mongoose.model("Listing", listingSchema);

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  country: {String},
  city: {String},
  town: {String},
}, {
  timestamps: true
})
export default mongoose.model('User', UserSchema);
// 🔥 your data
const seedData = [
  {
    title :"AFRICAN TWINS ",
    image:"/assets/images/at.png",
    description:"African Twins MOTO bike 2025 model",
    price:"6500",
  },
  {
    title:"AFRICAN TWINS MOTO",
    image:"/assets/images/at1.png",
    description: "African Twins moto bike 2022 model",
    price: "4500",
  },
  {
    title :"Bens Truck",
    image:"/assets/images/bns.png",
    description:"Bens tipper Truck 2012 model",
    price:"14000",
  },
  {
    title:"SUMSUNG FRIDGE",
    image:"/assets/images/ssf.png",
    description:"Sumsung Fridge in good condition new",
    price:"160",
  },
  {
    title:"IVECO TRUCK",
    image:"/assets/images/trk.png",
    description:"Iveco Truck 2010 model in perfect condition",
    price:"6500",
  },

  {
    title: "FORD",
    image: "/assets/images/favicon.png",
    price: 600,
    description: "Ford 2009 model perfect condition",
  },
  {
    title: "globbalnews.com",
    image: "/assets/images/globbalnews.com.png",
    price: 30,
    description: "globbalnews for news logo",
  },
  {
    title: "KIDS MOTTO",
    image: "/assets/images/p1.png",
    price: 25,
    description: "kids motto bike",
  },
  {
    title: "Toyota Yaris",
    image: "/assets/images/Toyota.png",
    price: 2500,
    description: "Toyota Yaris 2011 model in good condition",
  },
  {
    title: "MOTTO",
    image: "/assets/images/p3.png",
    price: 350,
    description: "4 wheel motto bike in good condition",
  },
  {
    title: "Honda Motto",
    image: "/assets/images/p4.png",
    price: 450,
    description: "Honda in good condition",
  },
];

// 🔥 run seed
const seedDB = async () => {
  try {
    await Listing.deleteMany(); // optional (clear old data)
    await Listing.insertMany(seedData);

    console.log("✅ Database seeded successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();