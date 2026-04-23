import { useState } from "react";
import "./AdminLogin.css";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const login = async (e) => {
    e.preventDefault();

    setUsernameError("");
    setPasswordError("");

    if (!username || !password) {
      setPasswordError("Please fill in all the details");
      return;
    }

    try {
      const response = await postMethodFetch(
        "http://127.0.0.1:3000/api/users/login/admin",
        {
          username,
          password,
        },
      );

      if (response.message === "Logged in") {
        setPasswordError("Successful login");

        setTimeout(() => {
          window.location.href = "/admin";
        }, 1000);
      }
    } catch (error) {
      if (error.message.includes("400")) {
        setUsernameError("Invalid username");
      }

      if (error.message.includes("403")) {
        setPasswordError("Wrong password");
      }
    }
  };

  return (
    <>
      <div className="loginContainer">
        <h1 className="loginTitle">ADMIN login</h1>
        <form className="loginForm" onSubmit={login}>
          <label htmlFor="usernameInput" className="formLabel">
            Username
          </label>
          <input
            type="text"
            placeholder="Username"
            className="loginInput"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <span className="usernameError">{usernameError}</span>
          <label htmlFor="passwordInput" className="formLabel">
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            className="loginInput"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className={`passwordError ${
              passwordError === "Successful login" ? "successMessage" : ""
            }`}
          >
            {passwordError}
          </span>
          <button type="submit" className="loginButton">
            Login
          </button>
        </form>
      </div>
    </>
  );
}

const postMethodFetch = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`POST hiba: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Hiba történt: ${error.message}`);
  }
};

export default AdminLogin;
