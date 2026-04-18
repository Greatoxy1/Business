import React, { useState } from "react";
import axios from "axios";
import { socket } from "../socket";

export default function ListingCard({
  item,
  addToCart,
  wishlist,
  setWishlist,
  deleteListing,
  user,
  checkoutSingleItem
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [price, setPrice] = useState(item.price);
const [newImage, setNewImage] = useState(null);

 const sendMessage = (text) => {
  socket.emit("send_message", {
    senderId: user._id,
    receiverId: item.userId,
    text,
    listingId: item._id,
  });
};

  const toggleWishlist = () => {
    const exists = wishlist.find((w) => w._id === item._id);
    if (exists) {
      setWishlist(wishlist.filter((w) => w._id !== item._id));
    } else {
      setWishlist([...wishlist, item]);
    }
  };
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

        const compressed = canvas.toDataURL("image/jpeg", 0.7);
        resolve(compressed);
      };
    };
  });
};
const handleSave = async () => {
  try {
    let updatedImage = item.image;

    if (newImage) {
      updatedImage = await compressImage(newImage);
    }

    await axios.put(
      `https://business-3-zwsk.onrender.com/edit-listing/${item._id}`,
      {
        userId: user._id,
        title,
        description,
        price,
        image: updatedImage
      }
    );

    // ✅ update UI instantly
    item.title = title;
    item.description = description;
    item.price = price;
    item.image = updatedImage;

    setNewImage(null);
    setEditing(false);

  } catch (err) {
    console.error("Edit failed:", err);
  }
};
  

  const isOwner = user && (user._id === item.userId || user.id === item.userId);

  return (
    <div className="card">
      <div className="card-img-wrapper">
        <img src={item.image} alt={item.title} className="card-img" />
      </div>

      {editing ? (
  <>
    <input value={title} onChange={(e) => setTitle(e.target.value)} />
    <input value={description} onChange={(e) => setDescription(e.target.value)} />
    <input value={price} onChange={(e) => setPrice(e.target.value)} />

    {/* ✅ Image upload */}
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
        style={{ width: 100 }}
      />
    )}

    <button onClick={handleSave}>Save</button>
    <button onClick={() => setEditing(false)}>Cancel</button>
  </>
) : (
        <>
          <h3 className="card-title">{item.title}</h3>
          <p className="card-desc">{item.description}</p>
          <p className="card-price">${item.price.toFixed(2)}</p>
        </>
      )}

      <div className="card-actions">
        <button onClick={() => addToCart(item)}>Add to Cart</button>
        <button onClick={() => checkoutSingleItem(item)}>Buy Now</button>

        {isOwner && (
          <>
            <button onClick={() => deleteListing(item._id)}>Delete</button>
            <button onClick={() => setEditing(true)}>Edit</button>
          </>
        )}

        <button onClick={toggleWishlist}>
          {wishlist.find((w) => w._id === item._id) ? "💖" : "🤍"}
        </button>

        <button onClick={sendMessage}>
  Message Seller
</button>
      </div>
    </div>
  );
}