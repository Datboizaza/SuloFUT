import "./Login.css";

function Login() {
  return (
    <>
      <div className="loginContainer">
        <h1 className="loginTitle">Welcome To SuloFUT</h1>
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

          <label htmlFor="passwordInput" className="formLabel">
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            className="loginInput"
            id="passwordInput"
          />
          <button type="submit" className="loginButton">
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

export default Login;
