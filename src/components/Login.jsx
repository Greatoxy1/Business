import { useState, useContext } from "react";
import { UserContext } from "../UserContext";
import axios from "axios";

export default function Login() {
  const { login } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [Email, setEmail] = useState("");

  const handleLogin = async () => {
      if (!Email || !password) {
    alert("Fill all fields");
    return;
  }
    try {
      const res = await axios.post(
        "https://business-3-zwsk.onrender.com/login",
        {
          username: username,
          email: Email,// ⚠️ your backend uses email, not username
          password: password,

        }
      );

      login(res.data); // ✅ contains _id
      localStorage.setItem("user", JSON.stringify(res.data)); // persist

      alert("Logged in!");
    } catch (err) {
      alert("Invalid credentials");
      console.error(err);
    }
  };


  return (
    <div>
      <h2>Login</h2>

      <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}