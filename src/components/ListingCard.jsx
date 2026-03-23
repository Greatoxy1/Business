import React from "react";

export default function ListingCard({ item, addToCart, wishlist, setWishlist, checkoutSingleItem }) {
  
  const toggleWishlist = () => {
    const exists = wishlist.find((w) => w.id === item.id);
    if (exists) {
      setWishlist(wishlist.filter((w) => w.id !== item.id));
    } else {
      setWishlist([...wishlist, item]);
    }
  };

  return (
    <div className="card">
      {/* Image */}
      <div className="card-img-wrapper">
        <img src={item.image} alt={item.title} className="card-img" />
      </div>

      {/* Title and Description */}
      <h3 className="card-title">{item.title}</h3>
      <p className="card-desc">{item.description}</p>

      {/* Price */}
      <p className="card-price">${item.price.toFixed(2)}</p>

      {/* Actions */}
      <div className="card-actions">
        <button onClick={() => addToCart(item)}>Add to Cart</button>
        <button onClick={() => checkoutSingleItem(item)}>Buy Now</button>
        <button onClick={toggleWishlist}>{wishlist.find(w => w.id === item.id) ? "💖" : "🤍"}</button>
      </div>
    </div>
  );
}