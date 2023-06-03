import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

import "./Login.css";

export default function Root() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  // handle the effect when isLoggedIn state changes
  useEffect(() => {
    if (isLoggedIn) {
      // essentially reloads page if logged in, "domino"-ing to their own appropriate page
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  // redirect to sign up page
  const handleSignUp = () => {
    navigate("/sign-up");
  };

  // handle the login form submission. Sends POST request to API with email and password from the form. If successful, set isLoggedIn to true, set the cookie, and set the username in localStorage
  const handleLogin = (e) => {
    e.preventDefault();

    fetch("http://localhost:3001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: document.getElementById("email").value,
        password: document.getElementById("psw").value,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        if (body.success) {
          setIsLoggedIn(true);
          const cookies = new Cookies();
          cookies.set("authToken", body.token, {
            path: "localhost:3001/",
            age: 60 * 60,
            sameSite: false,
          });
          localStorage.setItem("username", body.username);
          localStorage.setItem("userData", body.userData);
        } else {
          if (body.userExists) {
            setLoginError("Your account has not yet been approved.");
          } else {
            // make the outline of the input fields red
            document.getElementById("email").style.borderColor = "red";
            document.getElementById("psw").style.borderColor = "red";
            // make something that says Email or Password is incorrect not alert
            setLoginError("Email or Password is incorrect.");
            // clear the input fields
            document.getElementById("email").value = "";
            document.getElementById("psw").value = "";
          }
        }
      });
  };

  // handle input change and clear loginError
  const handleInputChange = () => {
    setLoginError("");
    document.getElementById("email").style.borderColor = "#ccc";
    document.getElementById("psw").style.borderColor = "#ccc";
  };

  return (
    <>
      <div className="login-container">
        <form onSubmit={handleLogin}>
          <div className="imgcontainer">
            <img src={require("./logo.png")} alt="Avatar" className="avatar" />
          </div>

          <div className="container-form">
            <label htmlFor="email">
              <b>Email</b>
            </label>
            <input
              type="text"
              placeholder="Enter Email"
              name="email"
              id="email"
              required
              onChange={handleInputChange}
            />

            <label htmlFor="psw">
              <b>Password</b>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="psw"
              id="psw"
              required
              onChange={handleInputChange}
            />
          </div>
          {loginError && <p className="error-message">{loginError}</p>}
          <div className="login-btn-container">
            <button type="submit" className="login-btn">
              Login
            </button>
          </div>
        </form>
        <div className="signup-btn-container">
          <br />
          <p>
            Don't have an account yet?{" "}
            <span className="signup-link" onClick={handleSignUp}>
              Sign up instead
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
