import Cookies from 'universal-cookie';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import ApplicationModal from '../modal/ApplicationModal';
import PdfModal from '../modal/PdfModal';
import StudentProfile from '../modal/StudentProfile';

import {AiOutlineHome} from "react-icons/ai"
import {HiOutlineDocumentText} from "react-icons/hi"
import {CgProfile} from "react-icons/cg"
import {BiLogOut} from "react-icons/bi"

export default function ApproverRoot() {
    const navigate = useNavigate()
    const [pdfModalOpen, setpdfModalOpen] = useState(false);
    const [userData, setUserData] = useState(true);
    const [profileModal, setProfileModalOpen] = useState(false);

    useEffect(() => {
        // Function to fetch user data
        const fetchUserData = async () => {
        try {
            const response = await fetch('http://localhost:3001/getloggedinuserdata', {
            method: 'POST',
            credentials: 'include',
            });

            if (response.ok) {
            const data = await response.json();
            setUserData(data);
            } else {
            console.error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error occurred while fetching user data:', error);
        }
        };

        fetchUserData();
    }, []);

    const handleLogout = (e) => {
        // Clear the authentication token (if applicable)
        // Example: If you are using cookies, use the following code:
        const cookies = new Cookies();
        cookies.remove('authToken');

        // Navigate to the homepage
        navigate('/');
    }

const handleOpenApplication = async () => {
    try {
        
        // Send a POST request to create the application
      const response = await fetch('http://localhost:3001/createapplication', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            studentID: userData._id,
        })
      });
  
      // Check the response from the server
      if (response.ok) {
        // Application created successfully
        const application = await response.json();
        console.log('Application created:', application);
        alert("Successfully created application!")
      } else {
        // Failed to create the application
        const error = await response.json();
        alert("Failed to create an application!")
        console.error('Failed to create application:', error);
      }
    } catch (e) {
        console.log(e);
    }
}

const handlePrintPDF = () => {
setpdfModalOpen(true);
}

const handleProfile = () => {
    setProfileModalOpen(true);
}

const handleDashboard = () => {
    setProfileModalOpen(false);
}

return(
<div className='body'>
        <nav className='sidebar'>
            <header className='nav-header'>
                <div className='image-text'>
                    <span className='image'>
                        <img src= {require("./aprub.png")} alt=""/>
                    </span>

                    <div className='text header-text'>
                        {/* dapat dito yung name ng nag log in, kahit 1st name lang siguro */}
                        <span className='name'>Student name</span>
                        {/* dito yung type ng user */}
                        <span className='usertype'>usertype</span>
                    </div>
                </div>
            </header>

            <div className='menu-bar'> 
                <div className='menu'>
                    <li className='nav-link'>
                        <div>
                            {/* pakigawang active initially yung dashboard ehehehehehehhehe, parang yung ginawa sa admin */}
                            <AiOutlineHome className='icon'/>
                            <button className='text nav-text' onClick={handleDashboard}>Dashboard</button>
                        </div>
                    </li>

                    <li className='nav-link'>
                        <div>
                            <HiOutlineDocumentText className='icon'/>
                            <button className='text nav-text' onClick={handleOpenApplication}>Open Application</button>
                        </div>
                    </li>

                    <li className='nav-link'>
                        <div>
                            <CgProfile className='icon'/>
                            <button className='text nav-text' onClick={handleProfile}>Profile</button>
                        </div>
                    </li>
                </div>

                <div className='bottom-content'>
                    <li className=''>
                        <div>
                            <BiLogOut className='icon'/>
                            <button className='text nav-text' onClick={handleLogout}>Logout</button>
                        </div>
                    </li>
                </div>
            </div>
        </nav>
        <div className='main-content'>
            <Outlet/>
        </div>
        {profileModal && <StudentProfile setProfileModal={setProfileModalOpen}/>}
    </div>
)
}