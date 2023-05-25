import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from "react";
import ApplicationModal from "../modal/ApplicationModal";
import PdfModal from "../modal/PdfModal"
import Cookies from 'universal-cookie';

export default function StudentHomepage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [pdfmodalOpen, setpdfModalOpen] = useState(false)
  const [userData, setUserData] = useState({})
  const [applications, setApplications] = useState([])

  // fetch user data based from credentials and set userData state
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3001/getloggedinuserdata", {
          method: "POST",
          credentials: "include",
        });
    
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          
          // Fetch applications based on the user ID
          const applicationsResponse = await fetch("http://localhost:3001/getapplications", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              studentID: data._id,
            }),
          });
    
          if (applicationsResponse.ok) {
            const applicationsData = await applicationsResponse.json();
            setApplications(applicationsData || []);
          } else {
            console.error("Failed to fetch applications:", applicationsResponse);
          }
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchUserData();
  }, []);

  const updateUserData = (updatedData) => {
    setUserData(updatedData);
  };

 return (
    <div className="student-homepage">
      <h1>Hello, {userData.firstName}!</h1>
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
            {applications.map((application, index) => (
              <li key={index}>
                <a href={application} target="_blank" rel="noopener noreferrer">
                  Application {index + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No applications yet.</p>
      )}
    </div>
  );
}