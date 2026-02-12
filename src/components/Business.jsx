import { Link } from "react-router-dom";
import "./Business.css";

export default function Business() {
  return (
    <div className="Business">
      <h1>WELCOME TO TAHIRUS-ENTERPRISE BUSINESS FORUM</h1>
      <p>Your gateway to business growth and opportunities.</p>
      <p>Tahirus-Enterprise is an organization that support individuals who want to start Business but has no idea about how to start it,
        here is the place where we help people to start from nowhere to somewhere.
        Tahirus-Enterprise is currently one of the most trending company that has helped people to grow a profitable businesses.
        The amazing thing is that Tahirus-Enterprise operate around the globe, we offer our services aroud the word! Europe, Africa, Asia or wherever. 
        We also have a well trained people who can assist you to develop your Business if you already have one, we can gradually assist you until it reach 
        it standard level.
        We offer many services just reach to us and we are ready to welcome you.
        Dont forget to Email us for enquiries.
      </p>
      <br></br>
      <Link to="/contact">
        <button className="btn">Contact Us</button>
      </Link>
    </div>
  );
}
