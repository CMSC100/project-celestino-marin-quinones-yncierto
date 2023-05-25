import Cookies from 'universal-cookie';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import ApplicationModal from '../modal/ApplicationModal';
import PdfModal from '../modal/PdfModal';

export default function ApproverRoot() {
    const navigate = useNavigate()
    const [pdfModalOpen, setpdfModalOpen] = useState(false);
    const [userData, setUserData] = useState(true);

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

return(
<div className="student-homepage">
{/* {userData && <p>Welcome, {userData._id}!</p>} */}

    <header>
        <img 
            src="https://hips.hearstapps.com/hmg-prod/images/domestic-cat-lies-in-a-basket-with-a-knitted-royalty-free-image-1592337336.jpg?crop=0.668xw:1.00xh;0.247xw,0&resize=1200:*" 
            alt="Avatar" 
            className="logo" 
        />
        <nav>
        <ul className='nav-list'>
            <li>
                <button onClick={handleOpenApplication}>Open an Application</button>
            </li>
            <li>
                <button>Profile</button>
            </li>
            <li>
                <button onClick={handlePrintPDF}>Print PDF</button>
            </li>
        </ul>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>Log Out</button>
    </header>
    <Outlet/>
    {/* {modalOpen && <ApplicationModal setOpenModal={setModalOpen}/>} */}
    {pdfModalOpen && <PdfModal setpdfModal={setpdfModalOpen}/>}
</div>
)
}