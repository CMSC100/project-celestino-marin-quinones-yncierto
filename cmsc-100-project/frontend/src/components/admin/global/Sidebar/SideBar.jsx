import { useState } from "react";
import Cookies from "universal-cookie";
import { Box, Icon, IconButton, Typography, useTheme } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import { tokens } from "../../../../theme";
import './SideBar.css';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import StudentApplications from "../StudentApplications";

const SideBar = () => {
    const navigate = useNavigate();
    const handleLogout = (e) => {
        // Clear the authentication token (if applicable)
        // Example: If you are using cookies, use the following code:
        const cookies = new Cookies();
        cookies.remove('authToken');
        // Navigate to the homepage
        navigate('/');
    }   

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selected, setSelected] = useState("Dashboard");
    
    const NavigationButtons = [
        { name: "Dashboard", icon: <DashboardIcon/> },
        { name: "Manage Accounts", icon: <HowToRegIcon /> },
        { name: "Log out", icon: <LogoutOutlinedIcon/>}
    ]

    return <div>
        <div className="sideBar">
            <div className="logoAndMenuBtn">
                {theme.palette.mode === "light" ? (
                    <img alt='Aprub Logo' src= {require("../../../logo.png")} width="100px"></img>
                ) : (<img alt='Aprub Logo' src= {require("../../../logo-white.png")} width="100px"></img>)}
                <IconButton className="menuButton">
                    <MenuOutlinedIcon/>
                </IconButton>
            </div>
            <div className="sidebarOptions">
                <div className="dashboardBtn">
                    <div className="indivCards">
                        <IconButton className="navButton">
                            <DashboardIcon className="cardIcon"/>
                            <Typography>Dashboard</Typography>
                        </IconButton>
                    </div>
                    <div className="indivCards">
                        <Link to="/admin/manage-student-apps">
                            <IconButton className="navButton" type="button" id='student-button' onClick={() => {
                                // document.getElementById("student-button").classList.add("active")
                                // document.getElementById("approver-button").classList.remove("active")
                            }}>
                            <HowToRegIcon className="cardIcon"/>
                            <Typography>Student Account Applications</Typography>
                            </IconButton> 
                        </Link>
                    </div>
                    <div className="indivCards">
                        <IconButton className="navButton">
                            <HowToRegIcon className="cardIcon"/>
                            <Typography>Manage Approver Accounts</Typography>
                        </IconButton> 
                    </div>
                    <div className="indivCards" >
                        <IconButton className="navButton" type='button'onClick={handleLogout}>
                            <LogoutOutlinedIcon className="cardIcon"/>
                            <Typography>Log out</Typography>
                        </IconButton>
                       
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
}

export default SideBar;