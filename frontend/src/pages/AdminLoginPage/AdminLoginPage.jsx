import { useEffect } from "react";

import AdminLogin from "../../components/AdminLogin/AdminLogin.jsx";
import "./AdminLoginPage.css";

function AdminLoginPage() {
  useEffect(() => {
    document.title = "SuloFUT | Admin Login";
  });
  return (
    <div>
      <div className="adminBody">
        <AdminLogin />
      </div>
    </div>
  );
}

export default AdminLoginPage;
