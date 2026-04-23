import { useEffect } from "react";
import Admin from "../../components/Admin/Admin.jsx";
import "./AdminPage.css";

function AdminPage() {
  useEffect(() => {
    document.title = "SuloFUT | Admin";
  });
  return (
    <div className="adminPage">
      <div className="adminBody">
        <Admin />
      </div>
    </div>
  );
}

export default AdminPage;
