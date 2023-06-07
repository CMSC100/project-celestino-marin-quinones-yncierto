import { useEffect, useState } from "react";
import "./SignUp.css";
import '../theme';
import { ColorModeContext, useMode } from '../theme';
import { CssBaseline, ThemeProvider, colors, IconButton } from '@mui/material';
import { tokens } from '../theme';
import validator from "validator";
import { useNavigate } from "react-router-dom";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

export default function SignUp() {
  const [theme, colorMode] = useMode();
  const colors = tokens(theme.palette.mode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [inputErrors, setInputErrors] = useState({
    studentNumber: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // handle the reset button. Resets the form
  const handleReset = () => {
    // go to home page
    navigate("/");
  };

  useEffect(() => {
    if (isSignedUp) {
      navigate("/");
    }
  }, [isSignedUp, navigate]);

  // handle the sign up form submission. Sends POST request to API with first name, middle name, last name, student number, email and password from the form. If successful, alert the user.
  const handleSignUp = (e) => {
    e.preventDefault();

    // Reset errors
    setInputErrors({
      firstName: "",
      lastName: "",
      studentNumber: "",
      email: "",
      password: "",
    });

    const errors = {};

    var pattern = /^[0-9]{4}-[0-9]{5}$/;
    var validStdnum = pattern.test(studentNumber);
    if (!validStdnum) {
      errors.studentNumber = "Invalid Student Number";
    }

    if (!validator.isEmail(email)) {
      errors.email = "Invalid Email";
    }

    if (password.length < 6) {
      errors.password = "Password should be at least 6 characters long";
    }

    if (Object.keys(errors).length > 0) {
      setInputErrors(errors);
      return;
    }

    fetch("http://localhost:3001/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: document.getElementById("s-fname").value,
        middleName: document.getElementById("s-mname").value,
        lastName: document.getElementById("s-lname").value,
        studentNumber: document.getElementById("s-studno").value,
        userType: "user",
        email: document.getElementById("s-email").value,
        password: document.getElementById("s-password").value,
        applications: [],
        adviser: null,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        if (body.success) {
          setIsSignedUp(true);
          alert(
            "Successfully signed up! Please wait for your account to be approved."
          );
        } else {
          if (body.emailExists) {
            alert("Email already taken.");
          } else if (body.studentNumberExists) {
            alert("Student number already exists.");
          } else {
            alert("Sign up failed.");
          }
        }
      });
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="screen">
          <div className='switch-container' >
            <IconButton className="light-switch" onClick={colorMode.toggleColorMode}>
              {theme.palette.mode === "light" ? (
                  <LightModeIcon/>
              ) : (<DarkModeIcon/>)}
            </IconButton>
          </div>
          <div className="signup-container" style={{boxShadow: theme.palette.mode === 'dark' ? '0 15px 35px 0 rgba(255, 255, 255, 0.178), 0 4px 10px 0 rgba(255, 255, 255, 0.26)' : '0 15px 35px 0 rgba(0, 0, 0, 0.1), 0 4px 10px 0 rgba(0, 0, 0, 0.09)'}}>
            <form
              onSubmit={handleSignUp}
              onReset={handleReset}
              className="signup-form"
            >
              <div className="imgcontainer">
                <img src={require("./logo.png")} alt="Avatar" className="avatar" style={{width: '300px'}}/>
              </div>
              <div className="cancel-btn" onClick={handleReset}>
                <span className="cancel-icon">x</span>
              </div>
              <div className="container-form">
                <div className="form-row">
                  <div
                    className={`form-group ${
                      inputErrors.firstName ? "has-error" : ""
                    }`}
                  >
                    <label htmlFor="fname">
                      <b>Given Name</b>
                    </label>
                    <input
                      id="s-fname"
                      type="text"
                      placeholder="Enter given name"
                      name="fname"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="mname">
                      <b>Middle Name</b>
                    </label>
                    <input
                      id="s-mname"
                      type="text"
                      placeholder="Enter middle name"
                      name="mname"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                    />
                  </div>

                  <div
                    className={`form-group ${
                      inputErrors.lastName ? "has-error" : ""
                    }`}
                  >
                    <label htmlFor="lname">
                      <b>Last Name</b>
                    </label>
                    <input
                      id="s-lname"
                      type="text"
                      placeholder="Enter last name"
                      name="lname"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div
                    className={`form-group ${
                      inputErrors.studentNumber ? "has-error" : ""
                    }`}
                  >
                    <label htmlFor="studno">
                      <b>Student Number</b>
                    </label>
                    <input
                      id="s-studno"
                      type="text"
                      placeholder="Enter student number (e.g., 2023-12345)"
                      name="studno"
                      value={studentNumber}
                      onChange={(e) => {
                        setStudentNumber(e.target.value);
                        setInputErrors({ ...inputErrors, studentNumber: "" });
                      }}
                      required
                    />
                    {inputErrors.studentNumber && (
                      <p className="error-message">{inputErrors.studentNumber}</p>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div
                    className={`form-group ${inputErrors.email ? "has-error" : ""}`}
                  >
                    <label htmlFor="email">
                      <b>Email</b>
                    </label>
                    <input
                      id="s-email"
                      type="text"
                      placeholder="Enter Email"
                      name="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setInputErrors({ ...inputErrors, email: "" });
                      }}
                      required
                    />
                    {inputErrors.email && (
                      <p className="error-message">{inputErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div
                    className={`form-group ${
                      inputErrors.password ? "has-error" : ""
                    }`}
                  >
                    <label htmlFor="psw">
                      <b>Password</b>
                    </label>
                    <input
                      id="s-password"
                      type="password"
                      placeholder="Enter Password"
                      name="psw"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setInputErrors({ ...inputErrors, password: "" });
                      }}
                      required
                    />
                    {inputErrors.password && (
                      <p className="error-message">{inputErrors.password}</p>
                    )}
                  </div>
                </div>
                <br />
                <div className="signupbtn-container">
                  <button className="signupbtn" type="submit">
                    Sign Up
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
