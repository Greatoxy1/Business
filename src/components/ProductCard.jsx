function ProductCard({ product }) {
  return (
    <div className="product-card">
      <a
        href={product.link}
        target="_blank"
        rel="noopener noreferrer"
        className="buy-btn"
      >
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        Buy on Amazon
      </a>
    </div>
  );
}

export default ProductCard;