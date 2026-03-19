function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <a
        href={product.link}
        target="_blank"
        rel="noopener noreferrer"
        className="buy-btn"
      >
        Buy on Amazon
      </a>
    </div>
  );
}

export default ProductCard;