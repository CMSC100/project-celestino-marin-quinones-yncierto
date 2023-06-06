import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { IconButton, Typography, useTheme } from '@mui/material';
import { Link, useNavigate } from "react-router-dom";
import { tokens } from "../../../theme.js";
import '../../admin/global/Sidebar/SideBar.css';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import '../../../theme.js';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ApprovalRoundedIcon from '@mui/icons-material/ApprovalRounded';
import Person3Icon from '@mui/icons-material/Person3';
import LogoutIcon from '@mui/icons-material/Logout';
// import StudentProfile from '../../modal/StudentProfile';

export default function StudentSideBar({setProfileModalOpen, setTriggerFetchApp, triggerFetchApp}) {
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
    const [userData, setUserData] = useState(true);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    useEffect(() => {
        // Function to fetch user data
        const fetchUserData = async () => {
        try {
            const response = await fetch('http://localhost:3001/getloggedinuserdata', {
            method: 'POST',
            credentials: 'include',
            });

            if (response.ok) {
            const data = await response.json();
            setUserData(data);
            } else {
            console.error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error occurred while fetching user data:', error);
        }
        };

        fetchUserData();
    }, []);

    const handleCollapse = function() {
        setIsCollapsed(!isCollapsed);
    }

    const openProfileModal = () => {
        setProfileModalOpen(true);
    };

    const handleOpenApplicationClick = () => {
        handleOpenApplication();
    }

    const handleOpenApplication = async () => {

        try {
            
            // Send a POST request to create the application
          const response = await fetch('http://localhost:3001/createapplication', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                studentID: userData._id,
                adviserID: userData.adviser
            })
          });
      
          // Check the response from the server
          if (response.ok) {
            // Application created successfully
            const application = await response.json();
            if (application.hasOpen) {
                alert("You already have an open application.")
            } else {
                setTriggerFetchApp(!triggerFetchApp);
                console.log('Application created:', application);
                setShowSuccessMessage(true);
                setTimeout(() => {
                    setShowSuccessMessage(false);
                }, 1000); 
            }
          } else {
            // Failed to create the application
            const error = await response.json();
            alert("Failed to create an application!")
            console.error('Failed to create application:', error);
          }
        } catch (e) {
            console.log(e);
        }
    }

    const handleProfile = () => {
        setProfileModalOpen(true);
    }
    
    const handleDashboard = () => {
        setProfileModalOpen(false);
    }

    const wholeClass = `whole ${isCollapsed ? 'collapsed' : 'expanded'}`;

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

                                    <IconButton className="navButton" style={{width: '40px'}} type="button" id='student-button' onClick={handleDashboard}>
                                        <HomeRoundedIcon className="cardIcon" />
                                    </IconButton>
                                
                            </div>
                            <div className="indivCards">
                                
                                    <IconButton className="navButton" style={{width: '40px'}} type="button" id='approver-button' onClick={handleOpenApplicationClick}>
                                        <ApprovalRoundedIcon className="cardIcon" />
                                    </IconButton>
                               
                            </div>
                            <div className="indivCards">
                                
                                    <IconButton className="navButton" style={{width: '40px'}} type="button" id='approver-button' onClick={openProfileModal}>
                                        <Person3Icon className="cardIcon" />
                                    </IconButton>
                                
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
                                
                                    <IconButton className="navButton" style={{width: '40px'}} type="button" id='student-button' onClick={handleDashboard}>
                                        <HomeRoundedIcon className="cardIcon" style={{ color: 'black' }}/>
                                    </IconButton>
                                
                            </div>
                            <div className="indivCards">
                                
                                    <IconButton className="navButton" style={{width: '40px'}} type="button" id='approver-button' onClick={handleOpenApplicationClick}>
                                        <ApprovalRoundedIcon className="cardIcon" style={{ color: 'black' }}/>
                                    </IconButton>
                                
                            </div>
                            <div className="indivCards">
                                
                                    <IconButton className="navButton" style={{width: '40px'}} type="button" id='approver-button' onClick={openProfileModal}>
                                        <Person3Icon className="cardIcon" style={{ color: 'black' }}/>
                                    </IconButton>
                                
                            </div>
                            <div className="indivCards" >
                                <IconButton className="navButton" style={{width: '40px'}} type='button' onClick={handleLogout}>
                                    <LogoutOutlinedIcon className="cardIcon" style={{ color: 'black' }}/>
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
                            <img alt='Aprub Logo' src={require("../../logo.png")} width="100px"></img>
                        ) : (<img alt='Aprub Logo' src={require("../../logo-white.png")} width="100px"></img>)}
                        <IconButton className="menuButton" onClick={handleCollapse}>
                            <MenuOutlinedIcon />
                        </IconButton>
                    </div>
                    <div className="sidebarOptions">
                        <div className="dashboardBtn">
                            <div className="indivCards">
                                
                                    <IconButton className="navButton" type="button" id='student-button' onClick={handleDashboard}>
                                        <HomeRoundedIcon className="cardIcon" />
                                        <h1 className="buttonLabel">Dashboard</h1>
                                    </IconButton>
                                
                            </div>
                            <div className="indivCards">
                                
                                    <IconButton className="navButton" type="button" id='approver-button' onClick={handleOpenApplicationClick}>
                                        <ApprovalRoundedIcon className="cardIcon" />
                                        <h1 className="buttonLabel">Open an Application</h1>
                                    </IconButton>
                                
                            </div>
                            <div className="indivCards" >
                                <IconButton className="navButton" type='button' onClick={openProfileModal}>
                                    <Person3Icon className="cardIcon" />
                                    <h1 className="buttonLabel">Profile</h1>
                                </IconButton>
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
                            <img alt='Aprub Logo' src={require("../../logo.png")} width="100px"></img>
                        ) : (<img alt='Aprub Logo' src={require("../../logo-white.png")} width="100px"></img>)}
                        <IconButton className="menuButton" onClick={handleCollapse}>
                            <MenuOutlinedIcon style={{ color: 'black' }}/>
                        </IconButton>
                    </div>
                    <div className="sidebarOptions">
                        <div className="dashboardBtn">
                            <div className="indivCards">
                                
                                    <IconButton className="navButton" type="button" id='student-button' onClick={handleDashboard}>
                                        <HomeRoundedIcon style={{ color: 'black' }} className="cardIcon" />
                                        <h1 style={{ color: 'black' }}className="buttonLabel">Dashboard</h1>
                                    </IconButton>
                                
                            </div>
                            <div className="indivCards">
                                
                                    <IconButton className="navButton" type="button" id='approver-button' onClick={handleOpenApplicationClick}>
                                        <ApprovalRoundedIcon style={{ color: 'black' }} className="cardIcon" />
                                        <h1 style={{ color: 'black' }} className="buttonLabel">Open an Application</h1>
                                    </IconButton>
                                
                            </div>
                            <div className="indivCards" >
                                <IconButton className="navButton" type='button' onClick={openProfileModal}>
                                    <Person3Icon style={{ color: 'black' }} className="cardIcon" />
                                    <h1 style={{ color: 'black' }} className="buttonLabel">Profile</h1>
                                </IconButton>
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