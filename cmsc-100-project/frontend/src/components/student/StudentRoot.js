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
    const [applications, setApplications] = useState([])
    

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
                <StudentSideBar setProfileModalOpen={setProfileModalOpen} setTriggerFetchApp={setTriggerFetchApp} triggerFetchApp={triggerFetchApp} />
                <Outlet context={[triggerFetchApp, setTriggerFetchApp]} />
            </div>
            {profileModalOpen && (
                <StudentProfile
                setProfileModalOpen={setProfileModalOpen}
                userData={userData}
                />
            )}
            </div>
        </ThemeProvider>
        </ColorModeContext.Provider>
    );
}
