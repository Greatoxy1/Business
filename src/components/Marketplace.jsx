import React, { useState, useContext } from "react";
import { UserContext } from "../UserContext";
import Register from "../components/Register";
import Login from "../components/Login";
import ListingCard from "../components/ListingCard";
import ProductSlider from "../components/ProductSlider";
import Profile from "../components/Profile";

import "../App.css";

import { useEffect } from "react";
import axios from "axios";

export default function Marketplace() {
  const { user, logout } = useContext(UserContext);
  const [listings, setListings] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [phone, setPhone] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    axios.get("https://business-3-zwsk.onrender.com/listings")
      .then((res) => setListings(res.data))
      .catch((err) => console.error(err));
  }, []);
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");

          const MAX_WIDTH = 500;
          const scaleSize = MAX_WIDTH / img.width;

          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

          resolve(compressedBase64);
        };
      };
    });
  };

  const addListings = async () => {
    if (!user) return alert("Login first");
    if (!newTitle || !newPrice || !newImage) return alert("Fill all fields");

    try {
      const compressedImage = await compressImage(newImage);

      const newItem = {
        title: newTitle,
        description: newDescription,
        price: parseFloat(newPrice),
        image: compressedImage, // ✅ compressed
        userId: user.id || user._id,
        userName: user.username,
        category: "Custom",
        phone: phone,
      };

      const res = await axios.post(
        "https://business-3-zwsk.onrender.com/add-listing",
        newItem
      );

      setListings((prev) => [res.data, ...prev]);

      // clear form
      setNewTitle("");
      setNewDescription("");
      setNewPrice("");
      setNewImage(null);
      setPhone("");

    } catch (err) {
      console.error("Error adding listing:", err);
      alert("Upload failed");
    }
  };
  const deleteListing = async (id) => {
  try {
    await axios.delete(
      `https://business-3-zwsk.onrender.com/listing/${id}`,
      {
        data: { userId: user.id || user._id }
      }
    );

    setListings((prev) => prev.filter((item) => item._id !== id));
  } catch (err) {
    console.error("Delete failed:", err);
    alert("Failed to delete listing");
  }
};

  const addToCart = (item) => {
    const existing = cart.find((c) => c.id === item.id);
    if (existing)
      setCart(
        cart.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    else setCart([...cart, { ...item, quantity: 1 }]);
  };

  const removeItem = (item) => setCart(cart.filter((c) => c.id !== item.id));
  
  const sendMessage = async (item) => {
  await axios.post("https://business-3-zwsk.onrender.com/send-message", {
    senderId: user._id,
    receiverId: item.userId,
    text: "Hi, I'm interested in your product",
    listingId: item._id,
  });
};

  const checkoutWhatsApp = () => {
    if (cart.length === 0) return alert("Cart empty");

    const firstSellerPhone = cart[0].phone;

    if (!firstSellerPhone) {
      alert("Seller phone missing");
      return;
    }

    const sameSeller = cart.every(item => item.phone === firstSellerPhone);

    if (!sameSeller) {
      alert("Cart contains items from different sellers");
      return;
    }

    const customerName = user?.username || "Guest";

    let message = `Hello i want to buy this product 👋\n\n`;
    message += `🛒 *Cart Order*\n\n`;
    message += `👤 Name: ${customerName}\n\n`;

    cart.forEach((item, i) => {
      message += `${i + 1}. ${item.title} - $${item.price} × ${item.quantity}\n`;
    });

    const total = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
    message += `\n💰 Total: $${total}\n\n`;
    message += `Please confirm my order.`;

    window.open(
      `https://wa.me/${firstSellerPhone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const checkoutSingleItem = (item) => {
    if (!item.phone) {
      alert("Seller has no WhatsApp number");
      return;
    }

    const customerName = user?.username || "Guest";

    let message = `Hello i want to buy this product 👋\n\n`;
    message += `🛒 *New Order Request*\n\n`;
    message += `👤 Name: ${customerName}\n`;
    message += `📦 Item: ${item.title}\n`;
    message += `💵 Price: $${item.price}\n`;
    message += `📊 Quantity: 1\n\n`;
    message += `Please confirm availability. Thank you!`;

    window.open(
      `https://wa.me/${item.phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const filteredListings = listings
    .filter((item) => item.title.toLowerCase().includes(search.toLowerCase()))
    .filter((item) => category === "All" || item.category === category);

  return (
    <div style={{ padding: 20 }}>
      <h1>Global Market</h1>
      <p>Buy and sell everywhere in the World</p>

      {/* User login/logout */}
      {user ? (
        <p>
          Logged in as <strong>{user.username}</strong>
          <button onClick={logout} style={{ marginLeft: 10 }}>
            Logout
          </button>
        </p>
      ) : (
        <div style={{ display: "flex", gap: 20 }}>
          <Register />
          <Login />
        </div>
      )}
      {user && (
        <div style={{ margin: "20px 0", border: "2px solid #c9167e", padding: 10 }}>

          <h3>Post your product</h3>

          <input
            placeholder="WhatsApp Number (e.g. 4915218006238)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />

          <input
            placeholder="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />

          <input
            placeholder="Price"
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewImage(e.target.files[0])}
          />

          {/* ✅ Preview */}
          {newImage && (
            <img
              src={URL.createObjectURL(newImage)}
              alt="preview"
              style={{ width: 100, marginTop: 10 }}
            />
          )}

          <button onClick={addListings} style={{ display: "block", marginTop: 10 }}>
            Add Product
          </button>
        </div>
      )}

      {/* Search & Category */}
      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <input
          placeholder="Search Items..."
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          onChange={(e) => setCategory(e.target.value)}
          style={{ marginLeft: 10 }}
        >
          <option>All</option>
          <option>Icons</option>
          <option>Business</option>
          <option>Premium</option>
        </select>
      </div>

      <h2>Products</h2>
      <div className="grid">
        {filteredListings.map((item) => (
          <div key={item._id || item.id} style={{ flex: "1 1 45%" }}>
            <ListingCard
              item={item}
              addToCart={addToCart}
              user={user}
              wishlist={wishlist}
              setWishlist={setWishlist}
              checkoutSingleItem={checkoutSingleItem}
              deleteListing={deleteListing} 
               sendMessage={sendMessage}  // ✅ ADD THIS
            />
          </div>
        ))}
      </div>

      <hr />

      {/* Cart */}
      <h2>Cart ({cart.reduce((sum, c) => sum + c.quantity, 0)} items)</h2>
      {cart.map((item) => (
        <div key={item._id || item.id}>
          {item.title} — {(item.price).toFixed(2)} × {item.quantity}
          <button onClick={() => removeItem(item)} style={{ marginLeft: 5 }}>
            Remove
          </button>
        </div>
      ))}

      <button onClick={checkoutWhatsApp}>Checkout via WhatsApp</button>
      <button onClick={() => sendMessage(item)}>
  Message Seller
</button>

      {/* Wishlist */}
      <h2>Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>No favorites yet</p>
      ) : (
        wishlist.map((item) => (
          <div key={item.id}>
            {item.title} — {(item.price || 0).toFixed(2)} × {item.quantity}
          </div>
        ))
      )}

      <hr />

      <div
        style={{
          display: "grid",
          flexWrap: "wrap",
          gap: "10px",
          border: "2px",
          justifyContent: "space-between",
        }}
      >
        <section style={{ flex: "1 1 45%" }}>
          <h2>Best Trending</h2>
          <ProductSlider category="trending" />
        </section>

        <section style={{ flex: "1 1 45%" }}>
          <h2>Best Tech Gadgets</h2>
          <ProductSlider category="tech-gadgets" />
        </section>


        <section style={{ flex: "1 1 45%" }}>
          <h2>Best Cameras</h2>
          <ProductSlider category="cameras" />
        </section>

        <section style={{ flex: "1 1 45%" }}>
          <h2>Best Laptops</h2>
          <ProductSlider category="laptops" />
        </section>

        <section style={{ flex: "1 1 45%" }}>
          <h2>Best Travel Gear</h2>
          <ProductSlider category="travel-gear" />
        </section>
      </div>
    </div>
  );
}