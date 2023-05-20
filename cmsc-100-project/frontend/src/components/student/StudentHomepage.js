import { useNavigate } from 'react-router-dom'
import React, { useState } from "react";
import './SignUp.css'
import ApplicationModal from "../modal/ApplicationModal";
import PdfModal from "../modal/PdfModal"
import Cookies from 'universal-cookie';

export default function StudentHomepage() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false)
  const [pdfmodalOpen, setpdfModalOpen] = useState(false)

  const handleLogout = (e) => {
    // Clear the authentication token (if applicable)
    // Example: If you are using cookies, use the following code:
    const cookies = new Cookies();
    cookies.remove('authToken');

    // Navigate to the homepage
    navigate('/');
}

  return (
    <div className="student-homepage">
    <header>
      <img src="https://hips.hearstapps.com/hmg-prod/images/domestic-cat-lies-in-a-basket-with-a-knitted-royalty-free-image-1592337336.jpg?crop=0.668xw:1.00xh;0.247xw,0&resize=1200:*" alt="Avatar" class="logo" />
        <nav>
          <ul className='nav-list'>
            <li><button onClick={() => {setModalOpen(true);}}>Open an Application</button></li>
            <li><button>Profile</button></li>
            <li><button onClick={() => {setpdfModalOpen(true);}}>Print PDF</button></li>
          </ul>
        </nav>
      <button className="logout-btn" onClick={handleLogout}>Log Out</button>
    </header>
    {modalOpen && <ApplicationModal setOpenModal={setModalOpen} />}
    {pdfmodalOpen && <PdfModal setpdfModal={setpdfModalOpen} />}

    <p>Lorem Ipsum</p>
    <h1>P is for Papa, it's a Papas Parteh!!!</h1>
    <h2>filler langzxc</h2>
    </div>
  )
}