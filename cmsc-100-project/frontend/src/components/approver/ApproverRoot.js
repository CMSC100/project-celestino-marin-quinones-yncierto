import Cookies from "universal-cookie";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { useState } from "react";
import "./Approver.css";
import { ColorModeContext, useMode, tokens } from '../../theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { IconButton, useTheme } from "@mui/material";
import '../../theme'

export default function ApproverRoot() {
  const [theme, colorMode] = useMode();
  const navigate = useNavigate();
  const colors = tokens(theme.palette.mode);
  const [triggerFetchApp, setTriggerFetchApp] = useState(false);

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
      <div className="appnav-container">
      {/* <div className='topnav-header'>
                <nav className='top-nav'>
                    <div className='logo-type'>
                        <img src= {require("./logo.png")} className='app-logo' alt=""/>
                        <div className='text'><p className='usertype'>ADVISER</p></div>
                    </div>

                    <button onClick={handleLogout} >Logout</button>
                </nav>
                <div className='main-content-app'>
                    <Outlet />
                </div>
            </div> */}
        <div className="main-content-app">
          <Outlet />
        </div>
      </div>
    </ColorModeContext.Provider>
    
  );
}
