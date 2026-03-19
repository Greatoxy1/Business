import { useState, useContext } from "react";
import { UserContext } from "../UserContext";

export default function Login() {
  const { login } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("marketplace_users") || "[]");
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) return alert("Invalid username or password");

    login(user);
    alert("Logged in!");
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}