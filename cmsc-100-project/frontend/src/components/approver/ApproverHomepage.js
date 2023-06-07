import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { MdDateRange } from "react-icons/md";
import { IoIosPodium } from "react-icons/io";
import { MdPendingActions } from "react-icons/md";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";
import { Icon, IconButton, Typography, useTheme } from '@mui/material';
import { tokens, ColorModeContext } from "../../theme";
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
import FormatListNumberedRoundedIcon from '@mui/icons-material/FormatListNumberedRounded';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import "./Approver.css";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

export default function ApproverHomepage() {
  const [userData, setUserData] = useState({}); // current user data
  const [applications, setApplications] = useState([]); // applications
  const [search, setSearch] = useState(""); // for search input
  const [triggerRebuild, setTriggerRebuild] = useState(false); // for triggering rebuild
  const [filter, setFilter] = useState(""); // filter mode
  const [filterValue, setFilterValue] = useState(""); // filter value
  const [currentActiveFilter, setCurrentActiveFilter] = useState(""); // for button styling purposes
  const [dataLoaded, setDataLoaded] = useState(false); // for checking if user data has laoded
  const [advisers, setAdvisers] = useState([]); // get all advisers for filtering
  const [sort, setSort] = useState({ date: -1 }); // hold value for sorting
  const [remarks, setRemarks] = useState(""); // for storing the remarks
  const [showRemarks, setShowRemarks] = useState(false); // for toggling the remarks input field visibility
  const [returnUserID, setReturnUserID] = useState(""); // hold the ID of the user who made the remarks
  const [isCollapsed, setIsCollapsed] = useState(true);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  const [sideBar, setSideBar] = useState(false);
  const showSidebar = () => setSideBar(!sideBar);

  const handleLogout = (e) => {
    // Clear the authentication token (if applicable)
    // Example: If you are using cookies, use the following code:
    const cookies = new Cookies();
    cookies.remove("authToken");

    // Navigate to the homepage
    navigate("/");
  };

  const returnApplication = (appID) => {
    fetch("http://localhost:3001/returnapplication", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appID: appID,
        remarks: remarks,
        returnUserID: userData._id,
        userType: userData.userType
      }), // Pass userData._id as returnUserID
    })
      .then((response) => response.json())
      .then((body) => {
        setTriggerRebuild(!triggerRebuild);
        setShowRemarks(false); // Hide the remarks input field
        setRemarks(""); // Clear the remarks
        setReturnUserID(""); // Clear the user ID
      });
  };

  useEffect(() => {
    // fetch once page loads
    const initialFetch = async () => {
      fetchUserData(); // get user data

      if (dataLoaded) {
        fetchApplications(); // once user data loads, get applications
        fetchAdvisers(); // get all advisers
      }
    };

    initialFetch();
  }, [dataLoaded]);

  useEffect(() => {
    if (userData._id) fetchApplications(); // fetch applications whenever search, triggerRebuild, sort, and filterValue values change
  }, [search, triggerRebuild, sort, filterValue]);

  useEffect(() => {
    if (currentActiveFilter != "") changeActiveFilter(currentActiveFilter); // for button styling
  }, [currentActiveFilter]);

  // fetch user data based on credentials and set userData state
  const fetchUserData = () => {
    fetch(`http://localhost:3001/getloggedinuserdata`, {
      method: "POST",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((body) => {
        setUserData(body);
        setDataLoaded(true);
      });
  };

  const fetchApplications = () => {
    fetch(`http://localhost:3001/getapplicationsapprover`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        adviserID: userData._id,
        search: search,
        filter: filter,
        filterValue: filterValue,
        sort: sort,
        userType: userData.userType,
      }),
    })
      .then((response) => response.json())
      .then((body) => setApplications(body));
  };

  const handleSearch = (e) => {
    console.log(e.target.value);
    setSearch(e.target.value);
  };

  const approveApplication = (appID) => {
    fetch("http://localhost:3001/approveapplication", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ appID: appID, approverType: userData.userType }),
    })
      .then((response) => response.json())
      .then((body) => {
        setTriggerRebuild(!triggerRebuild);
      });
  };

  const fetchAdvisers = () => {
    fetch(
      `http://localhost:3001/getapproveraccounts?searchName=${""}&sort=${1}`
    )
      .then((response) => response.json())
      .then((body) => setAdvisers(body));
  };

  const changeSort = (sort, event) => {
    // change sort mode
    setSort(sort);
    changeSortButton(event);
  };

  const clearSearch = () => {
    // clear search
    document.getElementById("search-text").value = "";
    setSearch("");
  };

  const handleCollapse = function() {
    setIsCollapsed(!isCollapsed);
}

  const changeSortButton = (event) => {
    // change css of sort buttons
    const buttons = document.getElementsByName(event.target.name);
    console.log(buttons[0].name);
    for (let i in buttons) {
      if (buttons[i] == event.target) buttons[i].classList.add("active");
      else if (buttons[i].classList?.contains("active"))
        buttons[i].classList.remove("active");
    }
  };

  const changeFilter = (filterBy) => {
    // change filter mode
    setFilter(filterBy);
  };

  const changeActiveFilter = (index) => {
    // change css of filter buttons
    // uses value attached to div and compare to passed index variable to determine active button
    const filterButtons = document.getElementsByName("filter-buttons");
    for (let i in filterButtons) {
      console.log(filterButtons[i].classList?.contains("active-filter"));
      if (index == filterButtons[i].value)
        filterButtons[i].classList.add("active-filter");
      else if (filterButtons[i].classList?.contains("active-filter"))
        filterButtons[i].classList.remove("active-filter");
    }
  };

  const clearFilter = () => {
    // clear filters
    setFilter("");
    setFilterValue("");
    const filterButtons = document.getElementsByName("filter-buttons");
    for (let i in filterButtons) {
      filterButtons[i].classList?.remove("active-filter");
    }
  };

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

  const appnavClass = `app-nav ${isCollapsed ? 'collapsed' : 'expanded'}`;

  if (dataLoaded) {
    return (
      <div className="sidebar-and-content" style={{width: '100%', height: '100%', margin: 0, marginRight: 0}}>
        {isCollapsed ? 
          <div className={appnavClass} style={{width: '140px', padding: '50px', backgroundColor: theme.palette.mode === 'dark' ? colors.primary[600] : 'white'}}>
            <header className="app-header" style={{justifyContent: "center", paddingBottom: '48px'}}>
              
                <IconButton className="menuButton" onClick={handleCollapse} style={{color: theme.palette.mode === 'dark' ? 'white' : 'black'}}>
                  <MenuOutlinedIcon/>
                </IconButton>
              
            </header>

            <div className="filter-bar">
              <div className="filters" style={{justifyContent: 'center'}}>
                
                

                {userData.userType === "officer" && (
                  <li className="adviser-btn" name="filter-buttons" value={0}>
                    
                      
                      <IconButton className="text adviser"
                      onClick={(e) => {
                        changeFilter("adviser", e);
                        handleCollapse();
                      }}
                      >
                        <BsFillPersonLinesFill className="menuButton" style={{color: theme.palette.mode === 'dark' ? 'white' : 'black', width: '40px', height: '40px'}}/>
                      </IconButton>
                    
                    {filter === "adviser" && filterButtons()}
                  </li>
                )}

                <li className="date-btn" value={1} name="filter-buttons">
                  
                    
                    <IconButton
                      className=" text date"
                    onClick={(e) => {
                      changeFilter("createdAt", e)
                      handleCollapse()
                    }}
                    ><DateRangeRoundedIcon className="menuButton" style={{color: theme.palette.mode === 'dark' ? 'white' : 'black', width: '40px', height: '40px'}}/>
                    </IconButton>
                  
                  {filter == "createdAt" && filterButtons()}
                </li>

                <li className="step-btn" value={2} name="filter-buttons">
                  
                    
                    <IconButton
                      className=" text step"
                    onClick={(e) => {
                      changeFilter("step", e)
                      handleCollapse()
                    }}
                    ><FormatListNumberedRoundedIcon className="menuButton" style={{color: theme.palette.mode === 'dark' ? 'white' : 'black', width: '40px', height: '40px'}}/>
                    </IconButton>
                  
                  {filter === "step" && filterButtons()}
                </li>

                <li className="status-btn" value={3} name="filter-buttons">
                  
                    <IconButton
                      className=" text status"
                    onClick={(e) => {
                      changeFilter("status", e)
                      handleCollapse();
                    }}
                    ><MdPendingActions className="menuButton" style={{color: theme.palette.mode === 'dark' ? 'white' : 'black', width: '40px', height: '40px'}}/>
                    </IconButton>
                  
                  {filter === "status" && filterButtons()}
                </li>
              </div>

              
              <div className="bottom-content">
                
                  
                    
                    <IconButton className="text logout" onClick={handleLogout}>
                    <LogoutOutlinedIcon className="menuButton" style={{color: theme.palette.mode === 'dark' ? 'white' : 'black', width: '40px', height: '40px'}}/>
                    </IconButton>
                 
                
              </div>
            </div>
          </div>
         : 
          <div className={appnavClass} style={{backgroundColor: theme.palette.mode === 'dark' ? colors.primary[600] : 'white', padding: "50px", width: '400px'}}>
            <header className="app-header">
              <div className="app-image-text">
                <span className="image">
                  <img src={theme.palette.mode==='dark' ? require("../logo-white.png") : require('../logo.png')} style={{width: '100px',}} className="app-logo" alt="" />
                </span>
                <IconButton className="menuButton" onClick={handleCollapse} style={{color: theme.palette.mode === 'dark' ? 'white' : 'black'}}>
                  <MenuOutlinedIcon/>
                </IconButton>
              </div>
            </header>

            <div className="filter-bar">
              <div className="filters">
                
                <span className="filter-title" style={{fontSize: '16px', fontWeight: 'bold'}}>Filters: </span>

                {userData.userType === "officer" && (
                  <li className="adviser-btn" name="filter-buttons" value={0}>
                    <div className="nav-button">
                      
                      <button className="nav-button"
                      onClick={(e) => changeFilter("adviser", e)} style={{display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', paddingTop: 0, paddingBottom: 0}}
                      ><span style={{ color: theme.palette.mode === 'dark' ? 'white' : 'black', fontSize: '16px', fontWeight: 'bold' }}>Adviser</span>
                        <BsFillPersonLinesFill className="icon" style={{color: theme.palette.mode === 'dark' ? 'white' : 'black', width: '25px', height: '25px'}}/>
                      </button>
                    </div>
                    {filter === "adviser" && filterButtons()}
                  </li>
                )}

                <li className="date-btn" value={1} name="filter-buttons">
                  <div className="nav-button">
                    
                    <button
                      className="nav-button"
                      onClick={(e) => changeFilter("createdAt", e)}
                      style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }}
                    >
                      <span style={{ color: theme.palette.mode === 'dark' ? 'white' : 'black', fontSize: '16px', fontWeight: 'bold'  }}>Date</span>
                      <DateRangeRoundedIcon className="icon" style={{color: theme.palette.mode === 'dark' ? 'white' : 'black', width: '25px', height: '25px'}}/>
                    </button>
                  </div>
                  {filter === "createdAt" && filterButtons()}
                </li>

                <li className="step-btn" value={2} name="filter-buttons">
                  <div name="filter-buttons">
                    
                    <button
                      className="nav-button"
                      onClick={(e) => changeFilter("step", e)}
                      style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }}
                    >
                      <span style={{ color: theme.palette.mode === 'dark' ? 'white' : 'black', fontSize: '16px', fontWeight: 'bold'  }}>Step</span>
                      <FormatListNumberedRoundedIcon className="icon" style={{color: theme.palette.mode === 'dark' ? 'white' : 'black', width: '25px', height: '25px'}}/>
                    </button>
                  </div>
                  {filter === "step" && filterButtons()}
                </li>

                <li className="status-btn" value={3} name="filter-buttons">
                  <div name="filter-buttons">
                    <button
                      className="nav-button"
                      onClick={(e) => changeFilter("status", e)}
                      style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }}
                    >
                      <span style={{ color: theme.palette.mode === 'dark' ? 'white' : 'black', fontSize: '16px', fontWeight: 'bold'  }}>Status</span>
                      <PendingActionsIcon className="icon" style={{color: theme.palette.mode === 'dark' ? 'white' : 'black', width: '25px', height: '25px'}}/>
                    </button>
                  </div>
                  {filter === "status" && filterButtons()}
                </li>

                <div className="filter-buttons" style={{display: 'flex', justifyContent: 'center', width: '100%', paddingTop: '5px'}}>
                  <button
                    onClick={() => {
                      clearFilter();
                    }}
                  >
                    Clear filter
                  </button>
                </div>
              </div>

              
              <div className="bottom-content" style={{display:'flex', justifyContent: 'start'}}>
                <li className="">
                  <div>
                    
                    <button className="nav-button" onClick={handleLogout} style={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center' }}>
                      <span style={{ color: theme.palette.mode === 'dark' ? 'white' : 'black',fontSize: '16px', fontWeight: 'bold' }}>Log out</span>
                      <BiLogOut className="icon" style={{color: theme.palette.mode === 'dark' ? 'white' : 'black', width: '25px', height: '25px'}}/>
                    </button>
                  </div>
                </li>
              </div>
            </div>
          </div>
        }

        <div className="approver-body">
          <div className="approverbody-content">
            <div className="greet-and-switch">
              <h1 className="app-greeting">
                Hello, {userData.fullName}! 
              </h1>

              <IconButton onClick={colorMode.toggleColorMode}>
                {theme.palette.mode === "light" ? (
                    <LightModeIcon />
                ) : (<DarkModeIcon />)}
              </IconButton>
            </div>
            

            <div className="search-list" style={{ backgroundColor: theme.palette.mode === 'dark' ? colors.primary[400] : 'white'}}>
              <h3 className="app-title">Student Applications</h3>
              <div className="search-bar">
                <input
                  type="text"
                  id="search-text"
                  onChange={handleSearch}
                  placeholder="Search for Name or Student No."
                />
                <button type="button" className="search-btn" onClick={clearSearch}>
                  Clear Search
                </button>
              </div>

              <div style={{ display: "flex", columnGap: 5, alignItems: "center" }}>
                <h4>Sort by:</h4>
                <button
                  type="button"
                  name="sort-buttons"
                  className="active"
                  onClick={(e) => changeSort({ date: -1 }, e)}
                >
                  Date (Descending)
                </button>
                <button
                  type="button"
                  name="sort-buttons"
                  onClick={(e) => changeSort({ "studentData.0.fullName": 1 }, e)}
                >
                  Name (Ascending)
                </button>
                <button
                  type="button"
                  name="sort-buttons"
                  onClick={(e) => changeSort({ "studentData.0.fullName": -1 }, e)}
                >
                  Name (Descending)
                </button>
              </div>
              <br/>
              <div style={{ display: "flex", flexDirection: "column", rowGap: 10 }}>
                {applications.map((application, index) => {
                  return (
                    <div className="officer-student-list"
                      key={index}
                      style={{backgroundColor: theme.palette.mode === 'dark' ? colors.primary[500] : colors.gray[900], overflow: 'auto', maxHeight: '500px',}}
                      >
                      <div>
                        <b>Name:</b> {application["studentData"][0]["fullName"]}{" "}
                        <br />
                        <b>Student Number:</b>{" "}
                        {application["studentData"][0]["studentNumber"]}
                        <br />
                        <b>Adviser:</b> {application["adviserData"][0]["fullName"]}{" "}
                        <br />
                        <b>Status:</b> {application.status} <br />
                        <b>Step:</b> {application.step} <br />

                        <div name={`app-${index}`} style={{display: "none"}} className="submit-remark">
                          <input
                            type="text"
                            placeholder="Enter remarks"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setReturnUserID(userData._id);
                              returnApplication(application._id);
                              document.getElementsByName(`app-${index}`)[0].style.display = "none";
                            }}
                          >
                            Submit Remarks
                          </button>
                        </div>
                      </div>

                      <div className="student-list-buttons">
                        <div className="divider"></div>
                        {((userData.userType === "adviser" &&
                          application.step === 2) ||
                          (userData.userType === "officer" &&
                            application.step === 3)) && application.status !== "cleared" && (
                          <div style={{ marginTop: 10 }}>
                            <button
                              type="button"
                              onClick={() => {
                                approveApplication(application._id)
                                document.getElementsByName(`app-${index}`)[0].style.display = "none";
                              }}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                document.getElementsByName(`app-${index}`)[0].style.display = "flex";
                              }}
                            >
                              Return with Remarks
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}
