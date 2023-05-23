import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from "react";
import ApplicationModal from "../modal/ApplicationModal";
import PdfModal from "../modal/PdfModal"
import Cookies from 'universal-cookie';

export default function StudentHomepage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [pdfmodalOpen, setpdfModalOpen] = useState(false)
  const [userData, setUserData] = useState({})

  // fetch user data based from credentials and set userData state
  useEffect(() => {
    fetch("http://localhost:3001/getloggedinuserdata", {
      method: "POST",
      credentials: "include"
    })
      .then(response => response.json())
      .then(body => setUserData(body))
      .catch(error => console.log("Error:", error));
  }, [])

  const updateUserData = (updatedData) => {
    setUserData(updatedData);
  };

  const applications = userData.applications || [];

 return (
    <div className="student-homepage">
      {modalOpen && (
        <ApplicationModal
          setOpenModal={setModalOpen}
          updateUserData={updateUserData}
          userData={userData}
        />
      )}
      {/* {pdfModalOpen && <PdfModal setPdfModal={setPdfModalOpen} />} */}

      {applications.length > 0 ? (
        <div>
          <h3>Applications:</h3>
          <ul>
            {applications.map(application => (
              <li key={application.id}>{application.name}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No applications yet.</p>
      )}
    </div>
  );
}