import React from "react";

export default function ListingCard({ item, addToCart, wishlist, setWishlist }) {
  
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
  <img src={item.image} alt={item.title} className="card-img" />

  <h3 className="card-title">{item.title}</h3>
  <p className="card-desc">{item.description}</p>
  <p className="card-price">${item.price}</p>

  <div className="card-actions">
    <button onClick={() => addToCart(item)}>Add to Cart</button>
    <button onClick={toggleWishlist}>❤️</button>
  </div>
</div>
  );
}