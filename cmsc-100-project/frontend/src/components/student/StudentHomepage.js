import { useNavigate, useOutletContext } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import ApplicationModal from "../modal/ApplicationModal";
import PdfModal from "../modal/PdfModal";
import Cookies from 'universal-cookie';
import './StudentHomepage.css';

export default function StudentHomepage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [pdfModalOpen, setpdfModalOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [userData, setUserData] = useState({})
  const [triggerFetchApp, setTriggerFetchApp] = useOutletContext();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [githubLink, setGithubLink] = useState("");
  const [adviserName, setAdviserName] = useState("");

  const navigate = useNavigate();

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
        if (!data.adviser) {
          setAdviserName(""); 
        } else {
          setAdviserName(data.adviser);
        }
        return data._id;
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const fetchApplications = async (studentID) => {
    try {
      // Fetch applications based on the user ID
      const applicationsResponse = await fetch(`http://localhost:3001/getapplications?studentID=${studentID}`);

      if (applicationsResponse.ok) {
        const applicationsData = await applicationsResponse.json();
        setApplications(applicationsData.reverse());
      } else {
        console.error("Failed to fetch applications:", applicationsResponse);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    const initialFetch = async() => {
      let studentID = await fetchUserData();
      fetchApplications(studentID)
    }

    initialFetch()
  }, [])

  useEffect(() => {
    if (userData._id) fetchApplications(userData._id)
  }, [triggerFetchApp])

  const handlePrintPDF = () => {
    setpdfModalOpen(true);
  };

  const closeApplication = async (appID) => {
    let result = await fetch('http://localhost:3001/closeapplication', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({appID})
    })
    
    if (result.ok) {
      setShowSuccessMessage("closed");
      setTriggerFetchApp(!triggerFetchApp);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 1000); 
    } else {
      alert("Failed to close application.")
    }
  }

  const submitApplication = async (appID) => {
    try {
      const response = await fetch('http://localhost:3001/submitapplication', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ appID, githubLink, status: 'pending' })
      });
  
      if (response.ok) {
        setShowSuccessMessage('submitted');
        setTriggerFetchApp(!triggerFetchApp);
        setGithubLink("");
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 1000);
      } else {
        alert("Failed to submit application.");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
  

  return (
    <div className={`student-homepage ${showSuccessMessage ? "overlay-visible" : ""}`}>
      <h1>Hello, {userData.firstName}!</h1>
      {modalOpen && (
        <ApplicationModal
          setOpenModal={setModalOpen}
          // updateUserData={updateUserData}
          userData={userData}
        />
      )}

      {applications.length > 0 ? (
        <div className='application-list'>
          <h3>APPLICATIONS</h3>
          {applications.map((application, index) => (
          <div
            className={`application-card ${application.status === 'closed' ? 'closed' : ''}`}
            key={index}
          >
            <div className='application-info'>
              <h4>Application {applications.length - index}</h4>
              <div className='status-bar'>
                <span className={`status ${application.status}`}>{application.status}</span>
              </div>
              {application.status === 'open' && application.studentSubmission.length === 0 ? (
                <>
                  <p><b>Name:</b> {userData.fullName}</p>
                  <p><b>Student Number:</b> {userData.studentNumber}</p>
                  <p><b>Email:</b> {userData.email}</p>
                  <p><b>Adviser:</b> {userData.adviserName || "Not yet assigned"}</p>
                  <label><b>Link to GitHub repository</b></label>
                  <input type="text" placeholder="https://github.com/..."  value={githubLink} onChange={(e) => setGithubLink(e.target.value)}/>
                </>
              ) : application.studentSubmission.length > 0 ? (
                <>
                  <p><b>Name:</b> {userData.fullName}</p>
                  <p><b>Student Number:</b> {userData.studentNumber}</p>
                  <p><b>Email:</b> {userData.email}</p>
                  <p><b>Adviser:</b> {userData.adviser || "Not yet assigned"}</p>
                  <p><b>GitHub Links:</b></p>
                  <ul style={{ listStyleType: 'disc', marginLeft: '3em' }}>
                    {application.studentSubmission.map((submission, index) => (
                      <li key={index}>
                        <a href={submission.githubLink} target="_blank" rel="noopener noreferrer">
                          {submission.githubLink}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>No application submitted yet</p>
              )}
            </div>
            <div className='app-card-btns'>
              {application.status === 'cleared' && (
                <button className='print-app' onClick={handlePrintPDF}>
                  Print as PDF
                </button>
              )}
              <button
                className='close-app'
                onClick={() => {
                  if (application.status !== 'closed') {
                    closeApplication(application._id);
                    setTriggerFetchApp(!triggerFetchApp);
                  }
                }}
                disabled={application.status === 'closed'}
              >
                {application.status === 'closed' ? 'Closed' : 'Close Application'}
              </button>
              {application.status === 'open' && application.studentSubmission.length === 0 && (
                <button 
                className='submit-app' 
                onClick={() => submitApplication(application._id)}
                disabled = {!adviserName}
                >Submit Application</button>
              )}
            </div>
          </div>
        ))}
        </div>
      ) : (
        <div className='application-list'>
          <p className='no-application'>No applications yet</p>
        </div>
      )}
      {pdfModalOpen && <PdfModal setpdfModal={setpdfModalOpen}/>}
      {showSuccessMessage === "closed" && (
      <div className="popup">
        <div className="popup-content">
          Successfully closed the application.
        </div>
      </div>
      )}

      {showSuccessMessage === "submitted" && (
        <div className="popup">
          <div className="popup-content">
            Successfully submitted the application.
          </div>
        </div>
      )}
    </div>
  );
}