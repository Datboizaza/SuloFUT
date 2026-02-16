import "./Login.css";

function Login() {
  return (
    <>
      <div className="loginContainer">
        <h1 className="loginTitle">
          welcome<br></br>TO<br></br>
          <span className="sulofutTitle">SULOfut</span>
        </h1>
        <form className="loginForm">
          <label htmlFor="usernameInput" className="formLabel">
            Username
          </label>
          <input
            type="text"
            placeholder="Username"
            className="loginInput"
            id="usernameInput"
          />
          <span id="usernameError" className="usernameError"></span>
          <label htmlFor="passwordInput" className="formLabel">
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            className="loginInput"
            id="passwordInput"
          />
          <span id="passwordError" className="passwordError"></span>
          <button type="button" className="loginButton" onClick={login}>
            Login
          </button>
        </form>
        <div className="registerLinkContainer">
          <p className="registerLinkText">Don't have an account?</p>
          <a href="/register" className="registerLink">
            Register
          </a>
        </div>
      </div>
    </>
  );
}

const login = async () => {
  try {
    const usernameValue = document.getElementById("usernameInput").value;
    const passwordValue = document.getElementById("passwordInput").value;

    const passwordErrorSpan = document.getElementById("passwordError");
    const usernameErrorSpan = document.getElementById("usernameError");

    passwordErrorSpan.innerHTML = "";
    usernameErrorSpan.innerHTML = "";
    if (usernameValue === "" || passwordValue === "") {
      passwordErrorSpan.innerHTML = "Please fill in all the details";
    } else {
      const response = await postMethodFetch(
        "http://127.0.0.1:3000/api/users/login",
        {
          username: usernameValue,
          password: passwordValue,
        },
      );

      if (response.message === "Logged in") {
        passwordErrorSpan.innerHTML = "Successful login";
        passwordErrorSpan.style.color = "rgb(0, 204, 92)";
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      }

      return response;
    }
  } catch (error) {
    const usernameErrorSpan = document.getElementById("usernameError");
    const passwordErrorSpan = document.getElementById("passwordError");
    if (error.message.includes("400")) {
      usernameErrorSpan.innerHTML = "Invalid username";
    }
    if (error.message.includes("403")) {
      passwordErrorSpan.innerHTML = "Wrong password";
    }
    console.log(error);
  }
};

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

export default Login;
