import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import validator from 'validator'
import './LogIn.css';

export default function Root() {
    const [isValidEmail, setIsValidEmail] = useState(true)
    const [isValidPw, setIsValidPw] = useState(true)
    const navigate = useNavigate();

    const handleSignUp = () => {
        navigate('/sign-up');
        console.log("clicked")
    }

    {/**nasa loob ng onSubmit function ata dapat mangyari yung validation ng email and password */}

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

    return (
        <div className="login-container">
            <form>
                <div class="imgcontainer">
                    <img src="https://hips.hearstapps.com/hmg-prod/images/domestic-cat-lies-in-a-basket-with-a-knitted-royalty-free-image-1592337336.jpg?crop=0.668xw:1.00xh;0.247xw,0&resize=1200:*" alt="Avatar" class="avatar" />
                </div>

                 <div class="container-form">
                    <label for="email"><b>Email</b></label>
                    <input type="text" placeholder="Enter Email" name="email" onChange={(e) => validateEmail(e)} required />
                    {!isValidEmail && <p className='error-msg'>Please enter a valid email.</p>}
                    {/* error msg na dapat lalabas after iclick yung login button, bale ivavalidate dapat yung form upon submit*/}


                    <label for="psw"><b>Password</b></label>
                    <input type="password" placeholder="Enter Password" name="psw" onChange={(e) => validatePw(e)} required />
                    {!isValidPw && <p className='error-msg'>Please enter a valid password.</p>}
                    {/* error msg na dapat lalabas after iclick yung login button, bale ivavalidate dapat yung form upon submit*/}

                </div>
                <div className='login-btn-container'>
                    {/**nag lologin kahit mali yung inputs.
                     * nagrereload yung page after mag login*/}
                    <button type="submit" className='login-btn'>Login</button>
                </div>
            </form>
            <div className='signup-btn-container'>
                <button className="signup-btn" onClick={handleSignUp}>Sign Up</button>
            </div>
        </div>
    );
}   