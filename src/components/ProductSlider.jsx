import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/grid";

import ProductCard from "./ProductCard";
import productsData from "../data/productData";

function ProductSlider({ category }) {
  const products = productsData[category] || [];

  return (
    <Swiper
  modules={[Grid, Autoplay]}
  spaceBetween={20}
  slidesPerView={3}
  grid={{
    rows: 2,
    fill: "row",
  }}
  breakpoints={{
    640: {
      slidesPerView: 1,
      grid: { rows: 1 },
    },
    768: {
      slidesPerView: 2,
      grid: { rows: 2 },
    },
    1024: {
      slidesPerView: 3,
      grid: { rows: 2 },
    },
    1024: {
      slidesPerView: 4,
      grid: { rows: 2 },
    },
  }}
  loop={false} // ✅ FIXED
  autoplay={{ delay: 3000 }}
>
      {products.map((product, index) => (
        <SwiperSlide key={index}>
          <ProductCard product={product} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default ProductSlider;