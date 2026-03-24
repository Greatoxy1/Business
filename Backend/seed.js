import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  image: String,
  user: String,
  category: String,
  approved: Boolean,
}, { timestamps: true });

const Listing = mongoose.model("Listings", listingSchema);

const seedData = [
  { title: "AFRICAN TWINS", image: "/assets/images/at.png", description: "African Twins MOTO bike 2025 model", price: 6500, user: "admin", category: "Moto", approved: true },
  { title: "AFRICAN TWINS MOTO", image: "/assets/images/at1.png", description: "African Twins moto bike 2022 model", price: 4500, user: "admin", category: "Moto", approved: true },
  { title: "Bens Truck", image: "/assets/images/bns.png", description: "Bens tipper Truck 2012 model", price: 14000, user: "admin", category: "Truck", approved: true },
  { title: "SUMSUNG FRIDGE", image: "/assets/images/ssf.png", description: "Sumsung Fridge in good condition new", price: 160, user: "admin", category: "Appliances", approved: true },
  { title: "IVECO TRUCK", image: "/assets/images/trk.png", description: "Iveco Truck 2010 model in perfect condition", price: 6500, user: "admin", category: "Truck", approved: true },
  { title: "FORD", image: "/assets/images/favicon.png", price: 600, description: "Ford 2009 model perfect condition", user: "admin", category: "Car", approved: true },
  { title: "globbalnews.com", image: "/assets/images/globbalnews.com.png", price: 30, description: "globbalnews for news logo", user: "admin", category: "Web", approved: true },
  { title: "KIDS MOTTO", image: "/assets/images/p1.png", price: 25, description: "kids motto bike", user: "admin", category: "Moto", approved: true },
  { title: "Toyota Yaris", image: "/assets/images/Toyota.png", price: 2500, description: "Toyota Yaris 2011 model in good condition", user: "admin", category: "Car", approved: true },
  { title: "MOTTO", image: "/assets/images/p3.png", price: 350, description: "4 wheel motto bike in good condition", user: "admin", category: "Moto", approved: true },
  { title: "Honda Motto", image: "/assets/images/p4.png", price: 450, description: "Honda in good condition", user: "admin", category: "Moto", approved: true },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    await Listing.deleteMany(); // clear old data
    await Listing.insertMany(seedData);

    console.log("✅ Database seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();