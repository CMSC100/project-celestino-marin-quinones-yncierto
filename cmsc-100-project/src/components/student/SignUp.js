import { useNavigate } from 'react-router-dom'
import React, { useState } from "react";
import validator from 'validator'
import './SignUp.css'

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [studentNumber, setStudentNumber] = useState('');

    const [isValidEmail, setIsValidEmail] = useState(true)
    const [isValidPw, setIsValidPw] = useState(true)
    const [isValidSn, setIsValidSn] = useState(true)

    const navigate = useNavigate();

    const homepageRoute = (e) => {
        navigate('/student-homepage');
        console.log("clicked")
    }

    const handleSignUp = (e) => {
        e.preventDefault();
        //Sign up logic to follow
        console.log('Signing up with email:', email, 'and password:', password);
        console.log('Additional fields:', firstName, middleName, lastName, studentNumber);
    };

    const handleBack = (e) => {
        navigate('/');
        console.log("clicked")
    }

    const validateEmail = (e) => {
        var email = e.target.value
  
        if (!validator.isEmail(email)) {
            setIsValidEmail(false)
            console.log('Invalid Email')
        } else {
            setIsValidEmail(true)
            console.log('Valid Email')
        }
    }

    const validatePw = (e) => {
        var password = e.target.value

        if(password.length < 6) {
            setIsValidPw(false)
            console.log("Password should be at least 6 characters long")
        } else {
            setIsValidPw(true)
            console.log("Valid Password")
        }
    }

    const validateStudnum = (e) => {
        var studentNumber = e.target.value
        var pattern = /^[0-9]{4}-[0-9]{5}$/;

        var validstdnum = pattern.test(studentNumber)

        if(!validstdnum) {
            setIsValidSn(false)
            console.log("Invalid Student number")
        } else {
            setIsValidSn(true)
            console.log("Valid Student number")
        }


    }

    return (
        <div className="signup-container">
            <form>
                <div class="imgcontainer">
                    <img src="https://hips.hearstapps.com/hmg-prod/images/domestic-cat-lies-in-a-basket-with-a-knitted-royalty-free-image-1592337336.jpg?crop=0.668xw:1.00xh;0.247xw,0&resize=1200:*" alt="Avatar" class="avatar" />
                </div>

                 <div class="container-form" onSubmit={handleSignUp}>
                    <label for="fname" ><b>First Name</b></label>
                    <input type="text" placeholder="Enter first name" name="fname" required />

                     <label for="mname"><b>Middle Name</b></label>
                    <input type="text" placeholder="Enter middle name" name="mname" required />

                     <label for="lname"><b>Last Name</b></label>
                    <input type="text" placeholder="Enter last name" name="lname" required />

                     <label for="studno"><b>Student Number</b></label>
                    <input type="text" placeholder="Enter student number" name="studno" onChange={(e) => validateStudnum(e)} required />
                    {!isValidSn && <p className='error-msg'>Please enter a valid student number.</p>}
                    {/* error msg na dapat lalabas after iclick yung login button, bale ivavalidate dapat yung form upon submit*/}

                     <label for="email"><b>Email</b></label>
                    <input type="text" placeholder="Enter Email" name="email" onChange={(e) => validateEmail(e)} required />
                    {!isValidEmail && <p className='error-msg'>Please enter a valid email.</p>}
                    {/* error msg na dapat lalabas after iclick yung login button, bale ivavalidate dapat yung form upon submit*/}

                     <label for="psw"><b>Password</b></label>
                    <input type="password" placeholder="Enter Password" name="psw" onChange={(e) => validatePw(e)} required />
                    {!isValidPw && <p className='error-msg'>Please enter a valid password.</p>}
                    {/* error msg na dapat lalabas after iclick yung login button, bale ivavalidate dapat yung form upon submit*/}

                    <div className="signup-back-btn">
                        <button className="signup-back-btn" onClick={handleBack}>Back</button>
                        <button type="submit" onClick={homepageRoute}>Sign Up</button>
                    </div>
                </div>
            </form>
        </div>
    );
}