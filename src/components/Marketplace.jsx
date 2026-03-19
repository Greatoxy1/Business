import React, { useState, useContext } from "react";
import { UserContext } from "../UserContext";
import Register from "../components/Register";
import Login from "../components/Login";
import ListingCard from "../components/ListingCard";
import listingsData from "../components/listingsData";
import ProductSlider from "../components/ProductSlider"; // Amazon slider
import "../App.css"; // ensure your flex styles are included

export default function Marketplace() {
  const { user, logout } = useContext(UserContext);
  const [listings, setListings] = useState(listingsData);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const addListings = (listing) => {
    if (!user) {
      alert("Login first");
      return;
    }
    setListings([
      ...listings,
      { ...listing, id: Date.now(), userId: user.id, userName: user.username },
    ]);
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

  const checkoutWhatsApp = () => {
    if (cart.length === 0) {
      alert("Cart empty");
      return;
    }
    const phone = "393123456789";
    let message = "Hello 👋 I want to order:\n\n";
    cart.forEach(
      (item, i) =>
        (message += `${i + 1}. ${item.title} - $${item.price} × ${
          item.quantity
        }\n`)
    );
    const total = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);
    message += `\nTotal: $${total}`;
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
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
    <div key={item.id} style={{ flex: "1 1 45%" }}>
      <ListingCard
        item={item}
        addToCart={addToCart}
        user={user}
        wishlist={wishlist}
        setWishlist={setWishlist}
      />
    </div>
  ))}
</div>

      <hr />

      {/* Cart */}
      <h2>Cart ({cart.reduce((sum, c) => sum + c.quantity, 0)} items)</h2>
      {cart.map((item) => (
        <div key={item.id}>
          {item.title} — {(item.price).toFixed(2)} × {item.quantity}
          <button onClick={() => removeItem(item)} style={{ marginLeft: 5 }}>
            Remove
          </button>
        </div>
      ))}
      <button onClick={checkoutWhatsApp}>Checkout via WhatsApp</button>

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
    border:"2px",
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