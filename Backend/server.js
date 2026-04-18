import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });
});

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

app.use(cors({
  origin: "*"
}));
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB error:", err);
    process.exit(1);
  });

const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  image: String,
  user: String,
  category: String,
  approved: Boolean,
  phone: String, 
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
app.post("/add-listing", async (req, res) => {
  try {
    const newListing = new Listing(req.body);
    await newListing.save();
    res.json(newListing);
  } catch (err) {
    console.error("Add listing error:", err);
    res.status(500).json({ error: "Failed to add listing" });
  }
});

const messageSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  text: String,
  listingId: String,
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);

app.post("/send-message", async (req, res) => {
  try {
    const msg = new Message(req.body);
    await msg.save();
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  country: String,
  city: String,
  town: String,
  avatar: String,   
  bio: String, 
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
// =========================
// ✅ ROUTES
// =========================
app.post("/register", async (req, res) => {
  try {
    const { username, email, password , country, city, town} = req.body;

    const user = new User({ username, email, password, country, city, town });
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/debug-users", async (req, res) => {
  const users = await User.find();
  res.json(users);
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

app.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.put("/profile/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select("-password");

    res.json(updatedUser);
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

 app.put("/edit-listing/:id", async (req, res) => {
  try {
    const { userId, title, description, price } = req.body;

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Not found" });
    }

    if (listing.userId !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    listing.title = title;
    listing.description = description;
    listing.price = price;

    await listing.save();

    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/delete-listing/:id", async (req, res) => {
  try {
    const { userId } = req.body; // sent from frontend

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // 🔒 Only owner can delete
    if (listing.userId !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await listing.deleteOne();

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/", (req, res) => {
  res.send("API is running ✅");
});

// =========================
// ✅ START SERVER
// =========================

const PORT = process.env.PORT || 5000 ;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});