import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
  cors: { origin: "*" }
});
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send_message", async (data) => {
    try {
      const msg = new Message(data);
      await msg.save();

      const receiverSocketId = onlineUsers.get(data.receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", msg);
      }
    } catch (err) {
      console.error("Message error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

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
  userId: String,
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
    const {
      title,
      description,
      price,
      image,
      userId,
      userName,
      phone,
      category
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "You must be logged in to post a listing"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const newListing = new Listing({
      title,
      description,
      price,
      image,
      userId,
      userName,
      phone,
      category,
    });

    await newListing.save();

    res.json(newListing);

  } catch (err) {
    console.error("Add listing error:", err);

    res.status(500).json({
      error: err.message
    });
  }
});

const messageSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  text: String,
  listingId: String,
}, { timestamps: true });
messageSchema.index({ listingId: 1, senderId: 1, receiverId: 1 });

const Message = mongoose.model("Message", messageSchema);


app.get("/messages/:listingId/:user1/:user2", async (req, res) => {
  const { listingId, user1, user2 } = req.params;

  const messages = await Message.find({
    listingId,
    $or: [
      { senderId: user1, receiverId: user2 },
      { senderId: user2, receiverId: user1 }
    ]
  }).sort({ createdAt: 1 });

  res.json(messages);
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
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    ...req.body,
    password: hashedPassword,
  });

  await user.save();
  res.json(user);
});
app.get("/debug-users", async (req, res) => {
  const users = await User.find();
  res.json(users);
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

app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(req.body.password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.json(user);
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

app.post("/send-message", async (req, res) => {
  console.log("BODY:", req.body);

  const { senderId, receiverId, text, listingId } = req.body;

  if (!senderId || !receiverId || !text || !listingId) {
    return res.status(400).json({
      message: "Missing required fields",
      received: {
        senderId,
        receiverId,
        text,
        listingId,
      },
    });
  }

  // rest of code...
});


app.get("/debug-listings", async (req, res) => {
  const listings = await Listing.find();
  res.json(listings);
});
app.get("/fix-listing", async (req, res) => {
  await Listing.findByIdAndUpdate(
    "69c2ee02225f11d7b1d093e8",
    {
      userId: "69e493b9c2079493fb5d584b"
    }
  );

  res.send("Updated");
});

// =========================
// ✅ START SERVER
// =========================

const PORT = process.env.PORT || 5000 ;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});