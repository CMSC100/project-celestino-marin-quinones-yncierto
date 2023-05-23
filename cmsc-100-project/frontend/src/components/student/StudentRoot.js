import Cookies from 'universal-cookie';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import React, { useState } from 'react';
import ApplicationModal from '../modal/ApplicationModal';
import PdfModal from '../modal/PdfModal';

export default function ApproverRoot() {
    const navigate = useNavigate()
    const [modalOpen, setModalOpen] = useState(false);
    const [pdfModalOpen, setpdfModalOpen] = useState(false);

    const handleLogout = (e) => {
        // Clear the authentication token (if applicable)
        // Example: If you are using cookies, use the following code:
        const cookies = new Cookies();
        cookies.remove('authToken');

        // Navigate to the homepage
        navigate('/');
    }

    const handleOpenApplication = () => {
        setModalOpen(true);
    }

    const handlePrintPDF = () => {
        setpdfModalOpen(true);
    }

    return(
        <div className="student-homepage">
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
            {modalOpen && <ApplicationModal setOpenModal={setModalOpen}/>}
            {pdfModalOpen && <PdfModal setpdfModal={setpdfModalOpen}/>}
        </div>
    )
}