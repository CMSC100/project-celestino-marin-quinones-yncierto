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

export default function ApproverSideBar({setTriggerFetchApp, triggerFetchApp}) {
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
    const [filter, setFilter] = useState(""); //
    const [filterValue, setFilterValue] = useState("");
    const [currentActiveFilter, setCurrentActiveFilter] = useState(""); 

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

    const wholeClass = `whole ${isCollapsed ? 'collapsed' : 'expanded'}`;

    const filterButtons = () => {
        let element; // the JS element to be displayed
        let tempFilterValue; // temporary variable for filter value
        let currentActiveFilter; // hold index of current active filter button
    
        const onSubmit = (e) => {
          // upon form submission, change filter value and current active filter value
          e.preventDefault();
          setFilterValue(tempFilterValue);
          setCurrentActiveFilter(currentActiveFilter);
        };
    
        const filterButton = (index) => {
          // general button for applying filter
          return (
            <div className="apply-buttons">
              <button type="submit" onClick={(e) => (currentActiveFilter = index)}>
                Apply filter
              </button>
            </div>
          );
        };
    
        if (filter === "adviser") {
          // when filter is an adviser
          element = (
            <div className="adviser-list">
              {advisers.map((adviser, index) => {
                return (
                  <div key={index} className="text-button">
                    <p>{adviser.fullName}</p>
                    <button className="apply-buttons"
                      value={0}
                      type="button"
                      onClick={(e) => {
                        setFilterValue(adviser._id);
                        currentActiveFilter = index;
                      }}
                    >
                      Apply Filter
                    </button>
                  </div>
                );
              })}
            </div>
          );
        } else if (filter == "createdAt") {
          // when filter is date
          element = (
            <form onSubmit={onSubmit}>
              <input
                type="date"
                onChange={(e) => {
                  tempFilterValue = e.target.value;
                }}
                required
              />
              {filterButton(1)}
            </form>
          );
        } else if (filter == "step") {
          // when filter is step
          element = (
            <form onSubmit={onSubmit}>
              <input
                type="number"
                min={2}
                max={3}
                placeholder="2 or 3"
                onChange={(e) => {
                  tempFilterValue = e.target.value;
                }}
                required
              />
              {filterButton(2)}
            </form>
          );
        } else if (filter === "status") {
          // when filter is status
          element = (
            <form onSubmit={onSubmit} className="status">
              <div className="pending">
                <div>
                  <input
                    type="radio"
                    id="pending-radio"
                    name="filter-radio"
                    onClick={(e) => {
                      tempFilterValue = "pending";
                    }}
                    required
                  />
                </div>
    
                <div className="pending-text">
                  <label htmlFor="pending-radio">Pending</label>
                </div>
              </div>
              <br />
              <div className="cleared">
                <div>
                  <input
                    type="radio"
                    id="cleared-radio"
                    name="filter-radio"
                    onClick={(e) => {
                      tempFilterValue = "cleared";
                    }}
                  />
                </div>
    
                <div className="cleared-text">
                  <label htmlFor="cleared-radio">Cleared</label>
                </div>
              </div>
    
              {filterButton(3)}
            </form>
          );
        }
        return element;
      };

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