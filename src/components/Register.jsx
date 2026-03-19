import { useState, useContext } from "react";
import { UserContext } from "../UserContext";

export default function Register() {
  const { login } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity]=useState("")
  const [town, setTown] = useState("")

  const handleRegister = () => {
    const users = JSON.parse(localStorage.getItem("marketplace_users") || "[]");

    if (users.find(u => u.username === username)) {
      alert("Username taken");
      return;
    }

    const newUser = { id: Date.now(), username, password, country, city, town };
    users.push(newUser);
    localStorage.setItem("marketplace_users", JSON.stringify(users));
    login(newUser);
    alert("Registered & logged in!");
  };

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <input type ="text" placeholder ="Country" onChange={e => setCountry(e.target.value)}/> 
      <input type ="text" placeholder="City" onChange={e => setCity(e.target.value)}/>
      <input type ="text" placeholder ="Town" onChange={e=>setTown (e.target.value)}/>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}