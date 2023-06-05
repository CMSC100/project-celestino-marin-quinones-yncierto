import { useState } from "react";
import Cookies from "universal-cookie";
import { IconButton, Typography, useTheme } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import { tokens } from "../../../../theme";
import './SideBar.css';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import SchoolIcon from '@mui/icons-material/School';
import '../../../../theme.js'

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
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [selected, setSelected] = useState("Dashboard");

    const handleCollapse = function() {
        setIsCollapsed(!isCollapsed);
    }

    const wholeClass = `whole ${isCollapsed ? 'collapsed' : 'expanded'}`;

    const handleStudentAccount = (e) => {
        document.getElementById("student-button").classList.add("active")
        document.getElementById("approver-button").classList.remove("active")
    }

    const handleApproverAccount = (e) => {
        document.getElementById("approver-button").classList.add("active")
        document.getElementById("student-button").classList.remove("active")
    }

    if (isCollapsed) {
        if (theme.palette.mode === 'dark') {
            return <div className= {wholeClass} style={{ backgroundColor: colors.primary[600]}}>
                <div className="sideBar" style={{width: '10px'}}>
                    <div className="logoAndMenuBtn" style={{height: '50px', width: '40px'}}>
                        <IconButton className="menuButton" onClick={handleCollapse}>
                            <MenuOutlinedIcon/>
                        </IconButton>
                    </div>
                    <div className="sidebarOptions">
                        <div className="dashboardBtn">
                            <div className="indivCards">
                                <Link to="/admin/manage-student-apps">
                                    <IconButton className="navButton" style={{width: '40px'}} type="button" id='student-button' onClick={handleStudentAccount}>
                                        <SchoolIcon className="cardIcon" />
                                    </IconButton>
                                </Link>
                            </div>
                            <div className="indivCards">
                                <Link to="/admin/manage-approvers">
                                    <IconButton className="navButton" style={{width: '40px'}} type="button" id='approver-button' onClick={handleApproverAccount}>
                                        <HowToRegIcon className="cardIcon" />
                                    </IconButton>
                                </Link>
                            </div>
                            <div className="indivCards" >
                                <IconButton className="navButton" style={{width: '40px'}} type='button' onClick={handleLogout}>
                                    <LogoutOutlinedIcon className="cardIcon" />
                                </IconButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        } else {
            return <div className={wholeClass} style={{ backgroundColor: 'white' }}>
                <div className="sideBar" style={{width: '10px'}}>
                    <div className="logoAndMenuBtn" style={{height: '50px', width: '40px'}}>
                        <IconButton className="menuButton" onClick={handleCollapse}>
                            <MenuOutlinedIcon style={{color: 'black'}}/>
                        </IconButton>
                    </div>
                    <div className="sidebarOptions">
                        <div className="dashboardBtn">
                            <div className="indivCards">
                                <Link to="/admin/manage-student-apps">
                                    <IconButton className="navButton" style={{width: '40px'}} type="button" id='student-button' onClick={handleStudentAccount}>
                                        <SchoolIcon style={{ color: 'black' }} className="cardIcon" />
                                    </IconButton>
                                </Link>
                            </div>
                            <div className="indivCards">
                                <Link to="/admin/manage-approvers">
                                    <IconButton className="navButton" style={{width: '40px'}} type="button" id='approver-button' onClick={handleApproverAccount}>
                                        <HowToRegIcon style={{ color: 'black' }} className="cardIcon" />
                                    </IconButton>
                                </Link>
                            </div>
                            <div className="indivCards" >
                                <IconButton className="navButton" style={{width: '40px'}} type='button' onClick={handleLogout}>
                                    <LogoutOutlinedIcon style={{ color: 'black' }} className="cardIcon" />
                                </IconButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
    } else {
        if (theme.palette.mode === 'dark') {
            return <div className={wholeClass} style={{ backgroundColor: colors.primary[600] }}>
                <div className="sideBar">
                    <div className="logoAndMenuBtn">
                        {theme.palette.mode === "light" ? (
                            <img alt='Aprub Logo' src={require("../../../logo.png")} width="100px"></img>
                        ) : (<img alt='Aprub Logo' src={require("../../../logo-white.png")} width="100px"></img>)}
                        <IconButton className="menuButton" onClick={handleCollapse}>
                            <MenuOutlinedIcon />
                        </IconButton>
                    </div>
                    <div className="sidebarOptions">
                        <div className="dashboardBtn">
                            <div className="indivCards">
                                <Link to="/admin/manage-student-apps">
                                    <IconButton className="navButton" type="button" id='student-button' onClick={handleStudentAccount}>
                                        <SchoolIcon className="cardIcon" />
                                        <h1 className="buttonLabel">Student Account Applications</h1>
                                    </IconButton>
                                </Link>
                            </div>
                            <div className="indivCards">
                                <Link to="/admin/manage-approvers">
                                    <IconButton className="navButton" type="button" id='approver-button' onClick={handleApproverAccount}>
                                        <HowToRegIcon className="cardIcon" />
                                        <h1 className="buttonLabel">Manage Approver Accounts</h1>
                                    </IconButton>
                                </Link>
                            </div>
                            <div className="indivCards" >
                                <IconButton className="navButton" type='button' onClick={handleLogout}>
                                    <LogoutOutlinedIcon className="cardIcon" />
                                    <h1 className="buttonLabel">Log out</h1>
                                </IconButton>
                            </div>
                    
                        </div>
                    </div>
                </div>
            </div>
        } else {
            return <div className={wholeClass} style={{ backgroundColor: "white" }}>
                <div className="sideBar">
                    <div className="logoAndMenuBtn">
                        {theme.palette.mode === "light" ? (
                            <img alt='Aprub Logo' src={require("../../../logo.png")} width="100px"></img>
                        ) : (<img alt='Aprub Logo' src={require("../../../logo-white.png")} width="100px"></img>)}
                        <IconButton className="menuButton" onClick={handleCollapse}>
                            <MenuOutlinedIcon style={{ color: 'black' }}/>
                        </IconButton>
                    </div>
                    <div className="sidebarOptions">
                        <div className="dashboardBtn">
                            <div className="indivCards">
                                <Link to="/admin/manage-student-apps">
                                    <IconButton className="navButton" type="button" id='student-button' onClick={handleStudentAccount}>
                                        <SchoolIcon style={{ color: 'black' }} className="cardIcon" />
                                        <h1 style={{ color: 'black' }}className="buttonLabel">Student Account Applications</h1>
                                    </IconButton>
                                </Link>
                            </div>
                            <div className="indivCards">
                                <Link to="/admin/manage-approvers">
                                    <IconButton className="navButton" type="button" id='approver-button' onClick={handleApproverAccount}>
                                        <HowToRegIcon style={{ color: 'black' }} className="cardIcon" />
                                        <h1 style={{ color: 'black' }} className="buttonLabel">Manage Approver Accounts</h1>
                                    </IconButton>
                                </Link>
                            </div>
                            <div className="indivCards" >
                                <IconButton className="navButton" type='button' onClick={handleLogout}>
                                    <LogoutOutlinedIcon style={{ color: 'black' }} className="cardIcon" />
                                    <h1 style={{ color: 'black' }} className="buttonLabel">Log out</h1>
                                </IconButton>
                            </div>
                    
                        </div>
                    </div>
                </div>
            </div>
        }
    }
}

export default SideBar;