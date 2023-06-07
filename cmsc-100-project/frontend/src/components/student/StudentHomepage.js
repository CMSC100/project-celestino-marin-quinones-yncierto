import { useNavigate, useOutletContext } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import ApplicationModal from "../modal/ApplicationModal";
import PdfModal from "../modal/PdfModal";
import Cookies from "universal-cookie";
import "./StudentHomepage.css";
import { ColorModeContext, useMode } from "../../theme";
import {
  CssBaseline,
  ThemeProvider,
  IconButton,
  useTheme,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import "../../theme.js";
import { tokens } from "../../theme";
import LinkIcon from "@mui/icons-material/Link";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";

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
  const [remarkContent, setRemarkContent] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

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
                    return {
                      ...remark,
                      commenter: commenterData.fullName,
                      userType: commenterData.userType,
                    };
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

  const handleSubmit = (value) => {
    setRemarkContent(value);
    postRemark
    console.log(remarkContent);
  };

  const handleTextareaChange = (e) => {
    setRemarkContent(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(remarkContent);
  };

  // ===========================================================================
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

    try {
      // Submit the application
      const response = await fetch("http://localhost:3001/submitapplication", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appID: application._id,
          githubLink,
          status: "pending",
          step: "2", // Update the step value
          isReturned: false, // Update the isReturned value
        }),
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
  // post remark to an application
  const postRemark = async (application) => {
    try {
      const response = await fetch("http://localhost:3001/returnapplication", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appID: application._id,
          remarks: remarkContent,
          returnUserID: userData._id,
          userType: userData.userType,
        }),
      });

      if (response.ok) {
        // Remark posted successfully
        setRemarkContent(""); // Clear remark input
        setTriggerFetchApp(!triggerFetchApp); // Fetch updated application data
      } else {
        console.error("Failed to post remark:", response);
      }
    } catch (error) {
      console.error("Error posting remark:", error);
    }
  };

  // ===========================================================================
  // view remarks of an application
  const viewRemarks = (appID) => {
    setApplications((prevApplications) =>
      prevApplications.map((app) =>
        app._id === appID
          ? { ...app, showRemarks: !app.showRemarks, enableRemarks: true }
          : app
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
        <div className="topBar">
          <h1 className="greeting">Hello, {userData.fullName}!</h1>
          {modalOpen && (
            <ApplicationModal setOpenModal={setModalOpen} userData={userData} />
          )}

          <div className="lightSwitch">
            <IconButton onClick={colorMode.toggleColorMode}>
              {theme.palette.mode === "light" ? (
                <LightModeIcon />
              ) : (
                <DarkModeIcon />
              )}
            </IconButton>
          </div>
        </div>

        {applications.length > 0 ? ( // If there are applications
          <div
            className="application-list"
            style={{
              backgroundColor:
                theme.palette.mode === "dark" ? colors.primary[400] : "white",
            }}
          >
            <h3>APPLICATIONS</h3>

          <div className={`student-homepage ${showSuccessMessage ? "overlay-visible" : ""}`}>
          <div className="application-cards">
              {applications.map((application, index) => (
                <div
                  className={`application-card ${
                    application.status === "closed" ? "closed" : ""
                  }`}
                  style={{
                    background:
                      application.status === "closed"
                        ? theme.palette.mode === "dark"
                          ? colors.primary[100]
                          : "#f5f4f7"
                        : theme.palette.mode === "dark"
                        ? "linear-gradient(90deg, #4b6cb7 0%, #182848 100%)"
                        : "linear-gradient(90deg, #e3ffe7 0%, #d9e7ff 100%)",
                  }}
                  key={index}
                >
                  <div className="application-info">
                    {application.status !== "open" && (
                      <div>
                        <div className="app-num-and-status">
                          <div className="status-bar">
                            <span
                              className={`status ${application.status}`}
                              style={{ margin: "0px" }}
                            >
                              {application.status}
                            </span>
                          </div>
                          <h4 className="app-num" style={{ fontSize: "18px" }}>
                            APPLICATION {applications.length - index}
                          </h4>
                        </div>
                      </div>
                    )}

                    {application.status === "open" &&
                    application.studentSubmission.length === 0 ? ( // If application is open and no submission yet
                      <div className="info-and-link">
                        <div className="header-and-info">
                          <div className="app-num-and-status">
                            <div className="status-bar">
                              <span
                                className={`status ${application.status}`}
                                style={{ margin: "0px" }}
                              >
                                {application.status}
                              </span>
                            </div>
                            <h4
                              className="app-num"
                              style={{ fontSize: "18px" }}
                            >
                              APPLICATION {applications.length - index}
                            </h4>
                          </div>
                          <div className="application-text-info">
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
                              <b>Adviser:</b>{" "}
                              {adviserName || "Not yet assigned"}
                            </p>
                            <p>
                              <b>Step: {" "}</b>{" "}
                                {
                                  (application.step === 1)
                                    ? "Pre-Adviser"
                                    :  (application.step === 2)
                                      ? "Adviser"
                                      : "Clearance Officer"
                                }
                            </p>
    
                            {application.step === 1 && ( // If application is in step 1
                          <div
                            className="github-link-container"
                            style={{ backgroundColor: "white" }}
                          >
                            <div className="github-content">
                              <label>
                                <b style={{ color: "black" }}>
                                  Link to GitHub repository
                                </b>
                              </label>
                              <input
                                type="text"
                                placeholder="https://github.com/..."
                                value={githubLink}
                                onChange={(e) => setGithubLink(e.target.value)}
                              />
                              {githubLinkError && (
                                <p className="error-message">
                                  {githubLinkError}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                          </div>
                        </div>
                      </div>
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
                          <b>Step: {" "}</b>{" "}
                            {
                              (application.step === 1)
                                ? "Pre-Adviser"
                                :  (application.step === 2)
                                  ? "Adviser"
                                  : "Clearance Officer"
                            }
                        </p>
                        <div
                          className="github-list"
                          style={{
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? "#17A2B8"
                                : "white",
                          }}
                        >
                          <div className="github-list-content">
                            <p>
                              <b style={{ fontSize: "14px" }}>GitHub Links:</b>
                            </p>
                            <ul style={{ marginLeft: "0" }}>
                              {application.studentSubmission.map(
                                (submission, index) => (
                                  <li
                                    key={index}
                                    style={{
                                      listStyle: "none",
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",
                                      justifyContent: "start",
                                    }}
                                  >
                                    <LinkIcon />
                                    <a
                                      href={submission.githubLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        color:
                                          theme.palette.mode === "dark"
                                            ? "white"
                                            : "black",
                                      }}
                                    >
                                      {submission.githubLink}
                                    </a>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p>No application submitted yet</p>
                    )}

                    {application.showRemarks &&
                      application.remarks &&
                      application.remarks.length > 0 && ( // If application has remarks
                        <div className="remarks-container">
                          <div className="logoAndLabel">
                            <CommentRoundedIcon />
                            <h5 style={{ paddingLeft: "3px" }}>Remarks:</h5>
                          </div>
                          <div className="remarks-chat">
                            {application.remarks.map((remark, remarkIndex) => (
                              <div
                                className={`remark-message ${remark.userType}`}
                                key={remarkIndex}
                                style={{
                                  backgroundColor:
                                    theme.palette.mode === "dark"
                                      ? "#f5f4f7"
                                      : "white",
                                }}
                              >
                                <div className="remark-info">
                                  <p style={{ color: "black" }}>
                                    <b>Commenter:</b> <b>{remark.commenter}</b>
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
                                <p
                                  className="remark-content"
                                  style={{ color: "black" }}
                                >
                                  {remark.remark}
                                </p>
                              </div>
                            ))}
                          </div>
                          {application.enableRemarks &&
                          application.step == 3 && (
                            <div className="add-remark">
                              <form
                                className="add-remark-content"
                                onSubmit={(e) => {
                                  handleFormSubmit(e)
                                  postRemark(application)
                                }}
                              >
                                <textarea
                                  id="remark"
                                  className="remark-textarea"
                                  placeholder="Add a remark"
                                  value={remarkContent}
                                  onChange={handleTextareaChange}
                                ></textarea>
                                <button type="submit">Submit</button>
                              </form>
                            </div>
                          )}
                        </div>
                      )}

                    {application.isReturned && 
                    application.step !== 3 &&
                    (
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
                          onClick={async () => {
                            try {
                              await submitApplication(application);
                              postRemark(application);
                            } catch (error) {
                              console.error(
                                "Error submitting application:",
                                error
                              );
                            }
                          }}
                          disabled={!adviserName}
                        >
                          Resubmit Application
                        </button>
                      </>
                    )}
                  </div>

                  <div className="app-card-btns">
                    {application.status === "cleared" && (
                      <button
                        className="common-btn print-app"
                        onClick={handlePrintPDF}
                      >
                        Print as PDF
                      </button>
                    )}

                    {application.status !== "cleared" && (
                      <button
                        className="common-btn close-app"
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
                    )}

                    {application.status === "open" &&
                      application.studentSubmission.length === 0 && (
                        <button
                          className="common-btn submit-app"
                          onClick={() => submitApplication(application)}
                          disabled={!adviserName}
                        >
                          Submit Application
                        </button>
                      )}

                    <button
                      className="common-btn view-remarks"
                      style={{
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? colors.blueAccent[500]
                            : "#f5f47",
                      }}
                      onClick={() => viewRemarks(application._id)}
                    >
                      {application.showRemarks
                        ? "Hide Remarks"
                        : "View Remarks"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>  
          </div>
        ) : (
          <div
            className="application-list"
            style={{
              backgroundColor:
                theme.palette.mode === "dark" ? colors.primary[200] : "white",
            }}
          >
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
