import { useState, useContext } from "react";
import { UserContext } from "../UserContext";
  import axios from "axios";

export default function Register() {
  const { login } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("")
  const [town, setTown] = useState("")


  const handleRegister = async () => {
    try {
      const res = await axios.post(
        "https://business-3-zwsk.onrender.com/register",
        {
          username,
          email: username + "@mail.com", // temporary if no email input
          password,
          country,
          city,
          town,
        }
      );

      login(res.data); // save user in context
      alert("Registered & logged in!");

    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <input type="text" placeholder="Country" onChange={e => setCountry(e.target.value)} />
      <input type="text" placeholder="City" onChange={e => setCity(e.target.value)} />
      <input type="text" placeholder="Town" onChange={e => setTown(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}