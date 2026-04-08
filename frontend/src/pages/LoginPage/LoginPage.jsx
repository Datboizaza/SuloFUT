import { useEffect } from "react";

import Login from "../../components/Login/Login.jsx";
import "./LoginPage.css";

function LoginPage() {
  useEffect(() => {
    document.title = "SuloFUT | Login";
  });
  return (
    <div>
      <Login />
    </div>
  );
}

export default LoginPage;
