import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import validator from 'validator';

import './Login.css';

export default function Root() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // handle the effect when isLoggedIn state changes
  useEffect(() => {
    if (isLoggedIn) {
      // essentially reloads page if logged in, "domino"-ing to their own appropriate page
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  // redirect to sign up page
  const handleSignUp = () => {
    navigate('/sign-up');
  };

  // handle the login form submission. Sends POST request to API with email and password from the form. If successful, set isLoggedIn to true, set the cookie, and set the username in localStorage
  const handleLogin = (e) => {
    e.preventDefault();

    // perform validation
    // Get the input values
    const email = document.getElementById('email').value;
    const password = document.getElementById('psw').value;

    // Perform validation
    if (!validator.isEmail(email)) {
      alert('Invalid Email');
      return;
    }

    if (password.length < 6) {
      alert('Password should be at least 6 characters long');
      return;
    }

    fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: document.getElementById('email').value,
        password: document.getElementById('psw').value,
      }),
    })
      .then((response) => response.json())
      .then((body) => {
        console.log(body)
        if (body.success) {
          setIsLoggedIn(true);
          const cookies = new Cookies();
          cookies.set('authToken', body.token, {
            path: 'localhost:3001/',
            age: 60 * 60,
            sameSite: false,
          });
          localStorage.setItem('username', body.username);
        } else {
          if (body.userExists) {
            alert("Your account has not yet been approved.")
          } else {
            alert("Login failed.")
          }
        }
      });
  };

  return (
    <>
      <div className="login-container">
        <form onSubmit={handleLogin}>
          <div className="imgcontainer">
            <img 
              src="https://hips.hearstapps.com/hmg-prod/images/domestic-cat-lies-in-a-basket-with-a-knitted-royalty-free-image-1592337336.jpg?crop=0.668xw:1.00xh;0.247xw,0&resize=1200:*" 
              alt="Avatar" 
              className="avatar" 
            />
          </div>

          <div className="container-form">
            <label htmlFor="email"><b>Email</b></label>
            <input type="text" placeholder="Enter Email" name="email" id="email" required />

            <label htmlFor="psw"><b>Password</b></label>
            <input type="password" placeholder="Enter Password" name="psw" id="psw" required />
          </div>
          <div className="login-btn-container">
            <button type="submit" className="login-btn">Login</button>
          </div>
        </form>
        <div className="signup-btn-container">
        <br/>
        <p>Don't have an account yet? <span onClick={handleSignUp}>Sign up instead</span></p>
        </div>
      </div>
    </>
  );
}