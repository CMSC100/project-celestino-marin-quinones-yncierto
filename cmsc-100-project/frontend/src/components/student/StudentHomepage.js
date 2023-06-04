import { useNavigate, useOutletContext } from "react-router-dom";
import React, { useEffect, useState } from "react";
import ApplicationModal from "../modal/ApplicationModal";
import PdfModal from "../modal/PdfModal";
import Cookies from "universal-cookie";
import "./StudentHomepage.css";

export default function StudentHomepage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [pdfModalOpen, setpdfModalOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [userData, setUserData] = useState({});
  const [triggerFetchApp, setTriggerFetchApp] = useOutletContext();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [githubLink, setGithubLink] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);
  const [adviserName, setAdviserName] = useState("");
  const [githubLinkError, setGithubLinkError] = useState("");

  const navigate = useNavigate();

  // ===========================================================================
  // fetch user data
  const fetchUserData = async () => {
    try {
      // Fetch user data
      const response = await fetch(
        "http://localhost:3001/getloggedinuserdata",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserData(data);

        // Check if user has an adviser
        if (!data.adviser) {
          setAdviserName(""); // Set adviserName as empty if no adviser
        } else {
          try {
            // Fetch adviser details based on adviser's _id
            const adviserResponse = await fetch(
              `http://localhost:3001/getapproverdetails?docRef=${data.adviser}`
            );
            if (adviserResponse.ok) {
              const adviserData = await adviserResponse.json();
              setAdviserName(adviserData.fullName); // Set adviserName with adviser's full name
            } else {
              console.error(
                "Failed to fetch adviser details:",
                adviserResponse
              );
            }
          } catch (error) {
            console.error("Error fetching adviser details:", error);
          }
        }

        return true;
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // ===========================================================================
  // fetch applications of the current user
  const fetchApplications = async () => {
    try {
      // Fetch applications based on the user ID
      const applicationsResponse = await fetch(
        `http://localhost:3001/getapplications?studentID=${userData._id}`
      );

      if (applicationsResponse.ok) {
        const applicationsData = await applicationsResponse.json();

        // Fetch commenter details for each application remark
        const updatedApplications = await Promise.all(
          applicationsData.map(async (app) => {
            const updatedRemarks = await Promise.all(
              app.remarks.map(async (remark) => {
                try {
                  // Fetch commenter details based on commenter's _id
                  const commenterResponse = await fetch(
                    `http://localhost:3001/getapproverdetails?docRef=${remark.commenter}`
                  );
                  if (commenterResponse.ok) {
                    const commenterData = await commenterResponse.json();
                    return { ...remark, commenter: commenterData.fullName };
                  } else {
                    console.error(
                      "Failed to fetch commenter details:",
                      commenterResponse
                    );
                    return remark;
                  }
                } catch (error) {
                  console.error("Error fetching commenter details:", error);
                  return remark;
                }
              })
            );

            return { ...app, remarks: updatedRemarks };
          })
        );

        setApplications(updatedApplications.reverse());
      } else {
        console.error("Failed to fetch applications:", applicationsResponse);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // ===========================================================================
  // fetch user data and set dataLoaded when the component is mounted
  useEffect(() => {
    const initialFetch = async () => {
      let result = await fetchUserData();
      if (result) {
        setDataLoaded(true);
      }
    };

    initialFetch();
  }, []);

  // ===========================================================================
  // fetch applications when dataLoaded is set to true
  useEffect(() => {
    if (dataLoaded) {
      fetchApplications();
    }
  }, [dataLoaded]);

  // ===========================================================================
  // fetch applications when triggerFetchApp is set to true
  useEffect(() => {
    if (dataLoaded) fetchApplications(userData._id);
  }, [triggerFetchApp]);

  // ===========================================================================
  // opens pdf modal
  const handlePrintPDF = () => {
    setpdfModalOpen(true);
  };

  // ===========================================================================
  // closes an application
  const closeApplication = async (appID) => {
    let result = await fetch("http://localhost:3001/closeapplication", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ appID }),
    });

    if (result.ok) {
      setShowSuccessMessage("closed");
      setTriggerFetchApp(!triggerFetchApp);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 1000);
    } else {
      alert("Failed to close application.");
    }
  };

  // ===========================================================================
  // submits an application
  const submitApplication = async (application) => {
    // Validate GitHub link
    if (!githubLink) {
      setGithubLinkError("GitHub link is required");
      return;
    }

    // Regular expression to validate GitHub link format
    const githubLinkRegex = /^(https?:\/\/)?(www\.)?github\.com\/\S+$/;
    if (!githubLinkRegex.test(githubLink)) {
      setGithubLinkError("Invalid GitHub link");
      alert("Invalid GitHub link");
      return;
    }

    // Clear the error message if validation passes
    setGithubLinkError("");

    alert(application._id)

    try {
      // Submit the application
      const response = await fetch("http://localhost:3001/submitapplication", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ appID: application._id, githubLink, status: "pending", step: 2, isReturned: false}),
      });

      if (response.ok) {    
        setShowSuccessMessage("submitted");
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


  // ===========================================================================
  // view remarks of an application
  const viewRemarks = (appID) => {
    setApplications((prevApplications) =>
      prevApplications.map((app) =>
        app._id === appID ? { ...app, showRemarks: !app.showRemarks } : app
      )
    );
  };

  if (dataLoaded) {
    // If user data is fetched
    return (
      <div
        className={`student-homepage ${
          showSuccessMessage ? "overlay-visible" : ""
        }`}
      >
        <h1>Hello, {userData.firstName}!</h1>
        {modalOpen && (
          <ApplicationModal setOpenModal={setModalOpen} userData={userData} />
        )}

        {applications.length > 0 ? ( // If there are applications
          <div className="application-list">
            <h3>APPLICATIONS</h3>

            {applications.map((application, index) => (
              <div
                className={`application-card ${
                  application.status === "closed" ? "closed" : ""
                }`}
                key={index}
              >
                <div className="application-info">
                  {application.status !== "open" && (
                    <div>
                      <button onClick={() => viewRemarks(application._id)}>
                        {application.showRemarks
                          ? "Hide Remarks"
                          : "View Remarks"}
                      </button>
                    </div>
                  )}

                  <h4>Application {applications.length - index}</h4>
                  <div className="status-bar">
                    <span className={`status ${application.status}`}>
                      {application.status}
                    </span>
                  </div>

                  {application.status === "open" &&
                  application.studentSubmission.length === 0 ? ( // If application is open and no submission yet
                    <>
                      <p>
                        <b>Name:</b> {userData.fullName}
                      </p>
                      <p>
                        <b>Student Number:</b> {userData.studentNumber}
                      </p>
                      <p>
                        <b>Email:</b> {userData.email}
                      </p>
                      <p>
                        <b>Adviser:</b> {adviserName || "Not yet assigned"}
                      </p>

                      {application.step == 1 && ( // If application is in step 1
                        <>
                          <label>
                            <b>Link to GitHub repository</b>
                          </label>
                          <input
                            type="text"
                            placeholder="https://github.com/..."
                            value={githubLink}
                            onChange={(e) => setGithubLink(e.target.value)}
                          />
                          {githubLinkError && (
                            <p className="error-message">{githubLinkError}</p>
                          )}
                        </>
                      )}
                    </>
                  ) : application.studentSubmission.length > 0 ? ( // If application has submission
                    <>
                      <p>
                        <b>Name:</b> {userData.fullName}
                      </p>
                      <p>
                        <b>Student Number:</b> {userData.studentNumber}
                      </p>
                      <p>
                        <b>Email:</b> {userData.email}
                      </p>
                      <p>
                        <b>Adviser:</b> {adviserName || "Not yet assigned"}
                      </p>
                      <p>
                        <b>GitHub Links:</b>
                      </p>
                      <ul style={{ listStyleType: "disc", marginLeft: "3em" }}>
                        {application.studentSubmission.map(
                          (submission, index) => (
                            <li key={index}>
                              <a
                                href={submission.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {submission.githubLink}
                              </a>
                            </li>
                          )
                        )}
                      </ul>
                    </>
                  ) : (
                    <p>No application submitted yet</p>
                  )}

                  {application.showRemarks &&
                    application.remarks &&
                    application.remarks.length > 0 && ( // If application has remarks
                      <div className="remarks-container">
                        <h5>Remarks:</h5>
                        <div className="remarks-chat">
                          {application.remarks.map((remark, remarkIndex) => (
                            <div className="remark-message" key={remarkIndex}>
                              <div className="remark-info">
                                <p>
                                  <b>Commenter:</b> {remark.commenter}
                                </p>
                                <p className="remark-date">
                                  {new Date(remark.date).toLocaleString(
                                    undefined,
                                    {
                                      dateStyle: "short",
                                      timeStyle: "short",
                                    }
                                  )}
                                </p>
                              </div>
                              <p className="remark-content">{remark.remark}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {application.isReturned && (
                    <>
                      <label>
                        <b>Resubmit GitHub repository</b>
                      </label>
                      <input
                        type="text"
                        placeholder="https://github.com/..."
                        value={githubLink}
                        onChange={(e) => setGithubLink(e.target.value)}
                      />
                      {githubLinkError && (
                        <p className="error-message">{githubLinkError}</p>
                      )}
                      <button
                        className="submit-app"
                        onClick={() => submitApplication(application)}
                        disabled={!adviserName}
                      >
                        Resubmit Application
                      </button>
                    </>
                  )}
                </div>

                <div className="app-card-btns">
                  {application.status === "cleared" && ( // If application is cleared, show print as PDF button
                    <button className="print-app" onClick={handlePrintPDF}>
                      Print as PDF
                    </button>
                  )}

                  <button
                    className="close-app"
                    onClick={() => {
                      if (application.status !== "closed") {
                        // If application is not closed, close application
                        closeApplication(application._id);
                        setTriggerFetchApp(!triggerFetchApp);
                      }
                    }}
                    disabled={application.status === "closed"}
                  >
                    {/* If application is closed, show closed button */}
                    {application.status === "closed"
                      ? "Closed"
                      : "Close Application"}
                  </button>

                  {application.status === "open" &&
                    application.studentSubmission.length === 0 && ( // If application is open and no submission yet, show submit application button
                      <button
                        className="submit-app"
                        onClick={() => submitApplication(application)}
                        disabled={!adviserName}
                      >
                        Submit Application
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="application-list">
            <p className="no-application">No applications yet</p>
          </div>
        )}

        {/* If pdf modal is open, show pdf modal */}
        {pdfModalOpen && <PdfModal setpdfModal={setpdfModalOpen} />}

        {showSuccessMessage === "closed" && ( // If application is closed, show success message
          <div className="popup">
            <div className="popup-content">
              Successfully closed the application.
            </div>
          </div>
        )}

        {showSuccessMessage === "submitted" && ( // If application is submitted, show success message
          <div className="popup">
            <div className="popup-content">
              Successfully submitted the application.
            </div>
          </div>
        )}
      </div>
    );
  }
}
