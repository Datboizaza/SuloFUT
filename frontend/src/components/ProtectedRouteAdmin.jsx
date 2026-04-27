import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRouteAdmin() {
  const [isAdmin, setIsAdmin] = useState(null);

  //! Login lecheckolása
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

  //! Null amíg nincs eredmény
  if (isAdmin === null) return null;

  //! Átirányítás a login-hoz
  if (!isAdmin) {
    return <Navigate to="/adminlogin" replace />;
  }

  //! Oldal renderelése ha be van jelentkezve
  return <Outlet />;
}

export default ProtectedRouteAdmin;
