import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Business from "./components/Business";
import Contacts from "./components/Contacts";
import "./App.css"; 

export function App() {
  return (
    <Router>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Business />} />
        <Route path="/contact" element={<Contacts />} />
      </Routes>
    </Router>
  );
}

export default App;
