import { Link } from "react-router-dom";
import "./Contact.css";

export default function Contacts() {
  return (
    <>
      <div className="Contact">
        <h1>Contact us on the following sites</h1>
        <p></p>
        <a href="https://shop.globbalnews.com">Click for more info</a>
        <br></br>
        <a href="https://whatsapp.com/channel/0029VbBl2XH7oQhe9hDDw50K">
          Follow the Globbalnews.Com channel on WhatsApp:</a>
          <br></br>
          <a href="https://sports.globbalnews.com">Enjoy current sports and updates</a>
          <br></br>
          <a href="https://www.tiktok.com/@globbalnews2.com">Folow us on Tiktok</a>
          <br></br>
          <a href="https://www.facebook.com/profile.php?id=61587557807005">Join our facebook chanel</a>
          <br></br>
          <a href="https://t.me/globbalnews1">Follow us on Telegram</a>
          <br></br>
        <Link to="/">
          <button className="btn">Back to Home</button>
        </Link>
      </div>
    </>
  );
}
