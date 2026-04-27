import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  //! Login lecheckolása
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await fetch("http://127.0.0.1:3000/api/users/me", {
          credentials: "include",
        });
        setIsLoggedIn(response.ok);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkLogin();
  }, []);

  //! Null amíg nincs eredmény
  if (isLoggedIn === null) {
    return null;
  }

  //! Átirányítás a login-hoz
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  //! Oldal renderelése ha be van jelentkezve
  return <Outlet />;
}

export default ProtectedRoute;
