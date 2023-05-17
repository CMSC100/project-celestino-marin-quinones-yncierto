import React, { useState } from "react";
import './SignUp.css'

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [studentNumber, setStudentNumber] = useState('');

    const handleSignUp = (e) => {
        e.preventDefault();
        //Sign up logic to follow
        console.log('Signing up with email:', email, 'and password:', password);
        console.log('Additional fields:', firstName, middleName, lastName, studentNumber);
    };

    return (
        <>
            <div className="signup-container">
                <form>
                    <div class="imgcontainer">
                        <img src="https://hips.hearstapps.com/hmg-prod/images/domestic-cat-lies-in-a-basket-with-a-knitted-royalty-free-image-1592337336.jpg?crop=0.668xw:1.00xh;0.247xw,0&resize=1200:*" alt="Avatar" class="avatar" />
                    </div>

                    <div class="container-form" onSubmit={handleSignUp}>
                        <label for="fname"><b>First Name</b></label>
                        <input type="text" placeholder="Enter first name" name="fname" required />

                        <label for="mname"><b>Middle Name</b></label>
                        <input type="text" placeholder="Enter middle name" name="mname" required />

                        <label for="lname"><b>Last Name</b></label>
                        <input type="text" placeholder="Enter last name" name="lname" required />

                        <label for="studno"><b>Student Number</b></label>
                        <input type="text" placeholder="Enter student number" name="studno" required />

                        <label for="email"><b>Email</b></label>
                        <input type="text" placeholder="Enter Email" name="email" required />

                        <label for="psw"><b>Password</b></label>
                        <input type="password" placeholder="Enter Password" name="psw" required />

                        <button type="submit">Sign Up</button>
                    </div>
                </form>
            </div>
        </>
    );
}