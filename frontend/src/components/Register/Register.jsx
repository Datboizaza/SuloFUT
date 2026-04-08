import { useState } from "react";
import "./Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const register = async (e) => {
    e.preventDefault();

    setUsernameError("");
    setPasswordError("");

    if (!username || !password || !passwordAgain) {
      setPasswordError("Please fill in all the details");
      return;
    }

    if (password !== passwordAgain) {
      setPasswordError("Passwords don't match");
      return;
    }

    const hasUppercase = /[A-ZÁÉÓÚŐŰÖÜÍ]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (password.length < 5 || !hasUppercase || !hasNumber) {
      setPasswordError("Password is too weak");
      return;
    }

    try {
      const response = await postMethodFetch(
        "http://127.0.0.1:3000/api/users",
        {
          username,
          password,
        },
      );

      if (response.message === "User created") {
        setPasswordError("Successful registration, please log in");

        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      }

      return response;
    } catch (error) {
      if (error.message.includes("409")) {
        setUsernameError("This username is already taken");
      }

      console.log(error);
    }
  };

  return (
    <div className="registerContainer">
      <h1 className="registerTitle">
        welcome
        <br />
        TO
        <br />
        <span className="sulofutTitle">SULOfut</span>
      </h1>

      <form className="registerForm" onSubmit={register}>
        <label className="formLabel">Username</label>
        <input
          type="text"
          placeholder="Username"
          className="registerInput"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <span className="usernameError">{usernameError}</span>

        <label className="formLabel">Password</label>
        <input
          type="password"
          placeholder="Password"
          className="registerInput"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label className="formLabel">Password Again</label>
        <input
          type="password"
          placeholder="Password Again"
          className="registerInput"
          value={passwordAgain}
          onChange={(e) => setPasswordAgain(e.target.value)}
        />

        <span
          className={`passwordError ${
            passwordError === "Successful registration, please log in"
              ? "successMessage"
              : ""
          }`}
        >
          {passwordError}
        </span>

        <button type="submit" className="registerButton">
          Register
        </button>
      </form>
    </div>
  );
}

const postMethodFetch = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

export default Register;
