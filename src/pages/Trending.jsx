import ProductSlider from "../components/ProductSlider";

function Trending() {
  return (
    <div>
      <h1>Best Trending</h1>
      <ProductSlider category="tech-gadgets" />
      <p>As an Amazon Associate I earn from qualifying purchases.</p>
    </div>
  );
}

export default Trending;