import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRouteAdmin() {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:3000/api/users/admin/me",
          {
            credentials: "include",
          },
        );
        setIsAdmin(response.ok);
      } catch {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  if (isAdmin === null) return null;

  if (!isAdmin) {
    return <Navigate to="/adminlogin" replace />;
  }
  return <Outlet />;
}

export default ProtectedRouteAdmin;
