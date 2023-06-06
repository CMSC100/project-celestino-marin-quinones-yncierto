import Cookies from "universal-cookie";
import { useNavigate, Outlet } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import ApplicationModal from "../modal/ApplicationModal";
import PdfModal from "../modal/PdfModal";
import { ColorModeContext, useMode, tokens } from "../../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import "../../theme.js";
import { IconButton, useTheme } from "@mui/material";
import StudentSideBar from "./Sidebar/StudentSideBar";
import "./StudentRoot.css";
import StudentProfile from "../modal/StudentProfile";

export default function StudentRoot() {
  const [theme, colorMode] = useMode();
  const theme2 = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [pdfModalOpen, setpdfModalOpen] = useState(false);
  const [userData, setUserData] = useState(true);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [triggerFetchApp, setTriggerFetchApp] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleCollapse = function () {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    // Function to fetch user data
    const fetchUserData = async () => {
      try {
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
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error occurred while fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = (e) => {
    // Clear the authentication token (if applicable)
    // Example: If you are using cookies, use the following code:
    const cookies = new Cookies();
    cookies.remove("authToken");

    // Navigate to the homepage
    navigate("/");
  };

  const handleOpenApplication = async () => {
    try {
      // Send a POST request to create the application
      const response = await fetch("http://localhost:3001/createapplication", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentID: userData._id,
          adviserID: userData.adviser,
        }),
      });

      // Check the response from the server
      if (response.ok) {
        // Application created successfully
        const application = await response.json();
        if (application.hasOpen) {
          alert("You already have an open application.");
        } else {
          setTriggerFetchApp(!triggerFetchApp);
          console.log("Application created:", application);
          setShowSuccessMessage(true);
          setTimeout(() => {
            setShowSuccessMessage(false);
          }, 1000);
        }
      } else {
        // Failed to create the application
        const error = await response.json();
        alert("Failed to create an application!");
        console.error("Failed to create application:", error);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handlePrintPDF = () => {
    setpdfModalOpen(true);
  };

  const handleProfile = () => {
    setProfileModalOpen(true);
  };

  const handleDashboard = () => {
    setProfileModalOpen(false);
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className={`body ${showSuccessMessage ? "overlay-visible" : ""}`}>
          <div
            className="main-content"
            style={{
              backgroundColor:
                theme.palette.mode === "dark" ? colors.primary[500] : "#f5f4f7",
            }}
          >
            <StudentSideBar setProfileModalOpen={setProfileModalOpen} />
            <Outlet context={[triggerFetchApp, setTriggerFetchApp]} />
          </div>
          {profileModalOpen && (
            <StudentProfile
              setProfileModalOpen={setProfileModalOpen}
              userData={userData}
            />
          )}
          {showSuccessMessage && (
            <div className="popup">
              <div className="popup-content">
                Successfully opened an application!
              </div>
            </div>
          )}
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
