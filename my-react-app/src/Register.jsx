import "./Register.css";

function Register() {
  return (
    <>
      <div className="registerContainer">
        <h1 className="registerTitle">Welcome To SuloFUT</h1>
        <form className="registerForm">
          <label htmlFor="usernameInput" className="formLabel">
            Username
          </label>
          <input
            type="text"
            placeholder="Username"
            className="registerInput"
            id="usernameInput"
          />

          <label htmlFor="passwordInput" className="formLabel">
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            className="registerInput"
            id="passwordInput"
          />
          <label htmlFor="passwordInput" className="formLabel">
            Password Again
          </label>
          <input
            type="password"
            placeholder="Password Again"
            className="registerInput"
            id="passwordAgainInput"
          />
          <button type="submit" className="registerButton">
            Register
          </button>
        </form>
      </div>
    </>
  );
}

export default Register;
