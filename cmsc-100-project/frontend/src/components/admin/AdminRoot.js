import Cookies from "universal-cookie";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { useEffect } from "react";
import { ColorModeContext, useMode } from "../../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import "../../theme.js";
import TopBar from "./global/TopBar";
import SideBar from "./global/Sidebar/SideBar.jsx";
import StudentApplications from "./global/StudentApplications.js";
import "./AdminRoot.css";
import "../../index.css";

export default function AdminRoot() {
  const [theme, colorMode] = useMode();
  const navigate = useNavigate();
  const handleLogout = (e) => {
    // Clear the authentication token (if applicable)
    // Example: If you are using cookies, use the following code:
    const cookies = new Cookies();
    cookies.remove("authToken");

    // Navigate to the homepage
    navigate("/");
  };

  return (
    <div>
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
      <Link to="/admin/manage-student-apps">
        <button
          type="button"
          className="active"
          id="student-button"
          onClick={() => {
            document.getElementById("student-button").classList.add("active");
            document
              .getElementById("approver-button")
              .classList.remove("active");
          }}
        >
          Manage Student Applications
        </button>
      </Link>
      <Link to="/admin/manage-approvers">
        <button
          type="button"
          id="approver-button"
          onClick={() => {
            document.getElementById("approver-button").classList.add("active");
            document
              .getElementById("student-button")
              .classList.remove("active");
          }}
        >
          Manage Approvers
        </button>
      </Link>
      ADMIN
      <br />
      <Outlet />
    </div>

    // comment yung taas para sa pinush ni lawrence tapos uncomment tong baba

    // <ColorModeContext.Provider value={ colorMode }>
    //     <ThemeProvider theme={theme}>
    //         <CssBaseline />
    //         <div className='admin'>
    //             <SideBar/>
    //             <main className='content'>
    //                 <TopBar />
    //                 </main>
    //         </div>
    //     </ThemeProvider>
    // </ColorModeContext.Provider>
  );
}
