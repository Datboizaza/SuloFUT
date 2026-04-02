import "./Register.css";

function Register() {
  return (
    <>
      <div className="registerContainer">
        <h1 className="registerTitle">
          welcome<br></br>TO<br></br>
          <span className="sulofutTitle">SULOfut</span>
        </h1>
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
          <span id="usernameError" className="usernameError"></span>
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
          <span id="passwordError" className="passwordError"></span>
          <button type="button" className="registerButton" onClick={register}>
            Register
          </button>
        </form>
      </div>
    </>
  );
}

const register = async () => {
  try {
    const usernameValue = document.getElementById("usernameInput").value;
    const passwordValue = document.getElementById("passwordInput").value;
    const passwordAgainValue =
      document.getElementById("passwordAgainInput").value;

    const passwordErrorSpan = document.getElementById("passwordError");
    const usernameErrorSpan = document.getElementById("usernameError");

    passwordErrorSpan.innerHTML = "";
    usernameErrorSpan.innerHTML = "";
    if (
      usernameValue === "" ||
      passwordValue === "" ||
      passwordAgainValue === ""
    ) {
      passwordErrorSpan.innerHTML = "Please fill in all the details";
      passwordErrorSpan.classList.remove("shake");
      void passwordErrorSpan.offsetWidth;
      passwordErrorSpan.classList.add("shake");
    } else {
      if (passwordValue !== passwordAgainValue) {
        passwordErrorSpan.innerHTML = "Passwords don't match";
        passwordErrorSpan.classList.remove("shake");
        void passwordErrorSpan.offsetWidth;
        passwordErrorSpan.classList.add("shake");
      } else {
        const uppercase = (passwordValue) =>
          /[A-ZÁÉÓÚŐŰÖÜÍ]/.test(passwordValue);
        const number = (passwordValue) => /[0-9]/.test(passwordValue);
        if (
          passwordValue.length < 5 ||
          !uppercase(passwordValue) ||
          !number(passwordValue)
        ) {
          passwordErrorSpan.innerHTML = "Password is too weak";
          passwordErrorSpan.classList.remove("shake");
          void passwordErrorSpan.offsetWidth;
          passwordErrorSpan.classList.add("shake");
        } else {
          const response = await postMethodFetch(
            "http://127.0.0.1:3000/api/users",
            {
              username: usernameValue,
              password: passwordValue,
            },
          );

          if (response.message === "User created") {
            passwordErrorSpan.innerHTML =
              "Successful registration, please log in";
            passwordErrorSpan.style.color = "rgb(0, 204, 92)";
            setTimeout(() => {
              window.location.href = "/login";
            }, 1000);
          }

          return response;
        }
      }
    }
  } catch (error) {
    const usernameErrorSpan = document.getElementById("usernameError");
    if (error.message.includes("409")) {
      usernameErrorSpan.innerHTML = "This username is already taken";
      usernameErrorSpan.classList.remove("shake");
      void usernameErrorSpan.offsetWidth;
      usernameErrorSpan.classList.add("shake");
    }
    console.log(error);
  }
};

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
