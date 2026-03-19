// index.jsx
import ReactDOM from "react-dom/client";
import App from "./App";
import UserProvider from "./UserContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <UserProvider>
    <App />
  </UserProvider>
);