import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Marketplace from "./components/Marketplace";
import Business from "./components/Business";
import Contacts from "./components/Contacts";
import TechGadgets from "./pages/TechGadgets";
import Cameras from "./pages/Cameras";
import Laptops from "./pages/Laptops";
import TravelGear from "./pages/TravelGear";
import Trending from "./pages/Trending";
import "./App.css";

export function App() {
  return (
    <Router>
      <nav className="navbar">
        <Link to="/">Marketplace</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/business">Business</Link>

        <Link to="/trending">Trending</Link>
        <Link to="/tech-gadgets">Tech Gadgets</Link>
        <Link to="/cameras">Cameras</Link>
        <Link to="/laptops">Laptops</Link>
        <Link to="/travel-gear">Travel Gear</Link>
      </nav>

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Marketplace />} />
          <Route path="/contact" element={<Contacts />} />
          <Route path="/business" element={<Business />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/tech-gadgets" element={<TechGadgets />} />
          <Route path="/cameras" element={<Cameras />} />
          <Route path="/laptops" element={<Laptops />} />
          <Route path="/travel-gear" element={<TravelGear />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;