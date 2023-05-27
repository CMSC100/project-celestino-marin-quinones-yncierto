import { useEffect, useState } from "react";
import './SignUp.css'

import validator from "validator";
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [isSignedUp, setIsSignedUp] = useState(false);

  const navigate = useNavigate();

  // handle the reset button. Resets the form
  const handleReset = () => {
    // go to home page
    navigate("/");
  }

  useEffect(() => {
    if (isSignedUp) {
      navigate('/');
    }
  }, [isSignedUp, navigate]);

  // handle the sign up form submission. Sends POST request to API with first name, middle name, last name, student number, email and password from the form. If successful, alert the user.
  const handleSignUp = (e) => {
    e.preventDefault();

    // Form validation goes here
    // Perform form validation
    if (firstName.trim() === '') {
      alert('First Name is required');
      return;
    }

    if (middleName.trim() === '') {
      alert('Middle Name is required');
      return;
    }

    if (lastName.trim() === '') {
      alert('Last Name is required');
      return;
    }

    var pattern = /^[0-9]{4}-[0-9]{5}$/;
    var validStdnum = pattern.test(studentNumber);
    if (!validStdnum) {
      alert('Invalid Student Number');
      return;
    }

    if (!validator.isEmail(email)) {
      alert('Invalid Email');
      return;
    }

    if (password.length < 6) {
      alert('Password should be at least 6 characters long');
      return;
    }
  
    fetch("http://localhost:3001/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
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
      })
    })
      .then(response => response.json())
      .then(body => {
        if (body.success) {
          setIsSignedUp(true);
          alert("Successfully signed up! Please wait for your account to be approved.");
        } else {
          if (body.emailExists) {
            alert("Email already taken.")
          } else {
            alert("Sign up failed.")
          }
        }
      });
  };

  return (
    <>
      <div className="signup-container">
        <form onSubmit={handleSignUp} onReset={handleReset} className="signup-form">
          <div className="imgcontainer">
            <img src="https://hips.hearstapps.com/hmg-prod/images/domestic-cat-lies-in-a-basket-with-a-knitted-royalty-free-image-1592337336.jpg?crop=0.668xw:1.00xh;0.247xw,0&resize=1200:*" alt="Avatar" className="avatar" />
          </div>
          <div className="cancel-btn" onClick={handleReset}>
              <span className="cancel-icon">x</span>
            </div>
          <div className="container-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fname"><b>Given Name</b></label>
                <input id="s-fname" type="text" placeholder="Enter given name" name="fname" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="mname"><b>Middle Name</b></label>
                <input id="s-mname" type="text" placeholder="Enter middle name" name="mname" value={middleName} onChange={(e) => setMiddleName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="lname"><b>Last Name</b></label>
                <input id="s-lname" type="text" placeholder="Enter last name" name="lname" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
            </div>
  
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="studno"><b>Student Number</b></label>
                <input id="s-studno" type="text" placeholder="Enter student number (e.g., 2023-12345)" name="studno" value={studentNumber} onChange={(e) => setStudentNumber(e.target.value)} required />
              </div>
            </div>
  
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email"><b>Email</b></label>
                <input id="s-email" type="text" placeholder="Enter Email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
  
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="psw"><b>Password</b></label>
                <input id="s-password" type="password" placeholder="Enter Password" name="psw" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>
            <br/>
            <div className="signup-back-btn">
              <button className="signupbtn" type="submit">Sign Up</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
  
}