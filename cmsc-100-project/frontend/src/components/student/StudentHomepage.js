import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import ApplicationModal from "../modal/ApplicationModal";
import PdfModal from "../modal/PdfModal";
import Cookies from 'universal-cookie';
import './StudentHomepage.css';

export default function StudentHomepage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [pdfmodalOpen, setpdfModalOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [applications, setApplications] = useState([]);
  const [updateFlag, setUpdateFlag] = useState(false); // Flag to trigger manual update

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data
        const response = await fetch("http://localhost:3001/getloggedinuserdata", {
          method: "POST",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };

    const fetchApplications = async () => {
      try {
        // Fetch applications based on the user ID
        const applicationsResponse = await fetch("http://localhost:3001/getapplications", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentID: userData._id,
          }),
        });

        if (applicationsResponse.ok) {
          const applicationsData = await applicationsResponse.json();
          setApplications(applicationsData || []);
        } else {
          console.error("Failed to fetch applications:", applicationsResponse);
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };

    fetchUserData();
    fetchApplications();
  }, [updateFlag]); // Update when the updateFlag changes

  const updateUserData = (updatedData) => {
    setUserData(updatedData);
  };

  const handleManualUpdate = () => {
    setUpdateFlag(!updateFlag); // Toggle the updateFlag to trigger manual update
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

      {applications.length > 0 ? (
        <div>
          <h3>Applications:</h3>
          {applications.map((application, index) => (
            <div className="application-card" key={index}>
              <h4>Application {index + 1}</h4>
              <ul>
                {Object.entries(application).map(([field, value]) => (
                  <li key={field}>
                    <strong>{field}:</strong> {value}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p>No applications yet.</p>
      )}

      <button onClick={handleManualUpdate}>Refresh Applications</button>
    </div>
  );
}

// gagawin ko pang real-time update ung fetching