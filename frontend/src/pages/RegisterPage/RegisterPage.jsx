import { useEffect } from "react";

import Register from "../../components/Register/Register.jsx";
import "./RegisterPage.css";

function RegisterPage() {
  useEffect(() => {
    document.title = "SuloFUT | Register";
  });
  return (
    <div>
      <Register />
    </div>
  );
}

export default RegisterPage;
