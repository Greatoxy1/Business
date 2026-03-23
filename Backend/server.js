import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/marketplace")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

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
app.get("/listings/:id", async (req, res) => {
  try {
    const item = await Listing.findById(req.params.id);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/listings", async (req, res) => {
  const listings = await Listing.find();
  res.json(listings);
});

app.post("/add-listing", async (req, res) => {
  const newListing = new Listing(req.body);
  await newListing.save();
  res.json(newListing);
});

app.listen(5000, () => console.log("Server running on port 5000"));

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
// =========================
// ✅ ROUTES
// =========================
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = new User({ username, email, password });
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 👉 Get all listings
app.get("/listings", async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👉 Add new listing
app.post("/add-listing", async (req, res) => {
  try {
    const newListing = new Listing(req.body);
    await newListing.save();
    res.json(newListing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👉 Delete listing (optional)
app.delete("/listing/:id", async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =========================
// ✅ START SERVER
// =========================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});