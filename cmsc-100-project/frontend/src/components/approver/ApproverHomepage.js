import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import { MdDateRange } from "react-icons/md";
import {IoIosPodium} from "react-icons/io"
import {MdPendingActions} from "react-icons/md"
import {BsFillPersonLinesFill} from "react-icons/bs"
import {BiLogOut} from "react-icons/bi"

import './Approver.css'

export default function ApproverHomepage() {
  const [userData, setUserData] = useState({}); // current user data
  const [applications, setApplications] = useState([]) // applications
  const [search, setSearch] = useState("") // for search input
  const [triggerRebuild, setTriggerRebuild] = useState(false) // for triggering rebuild
  const [filter, setFilter] = useState("") // filter mode
  const [filterValue, setFilterValue] = useState("") // filter value
  const [currentActiveFilter, setCurrentActiveFilter] = useState("") // for button styling purposes
  const [dataLoaded, setDataLoaded] = useState(false) // for checking if user data has laoded
  const [advisers, setAdvisers] = useState([]) // get all advisers for filtering
  const [sort, setSort] = useState({ date: -1 }) // hold value for sorting
  const [remarks, setRemarks] = useState(""); // for storing the remarks
  const [showRemarks, setShowRemarks] = useState(false); // for toggling the remarks input field visibility
  const [returnUserID, setReturnUserID] = useState(""); // hold the ID of the user who made the remarks

  const navigate = useNavigate();

  const [sideBar, setSideBar] = useState(false);
  const showSidebar = () => setSideBar(!sideBar);

  const handleLogout = (e) => {
    // Clear the authentication token (if applicable)
    // Example: If you are using cookies, use the following code:
    const cookies = new Cookies();
    cookies.remove('authToken');

    // Navigate to the homepage
    navigate('/');
  }

  const returnApplication = (appID) => {
    fetch("http://localhost:3001/returnapplication", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ appID: appID, remarks: remarks, returnUserID: userData._id }) // Pass userData._id as returnUserID
    })
      .then(response => response.json())
      .then(body => {
        setTriggerRebuild(!triggerRebuild);
        alert(JSON.stringify(body));
        setShowRemarks(false); // Hide the remarks input field
        setRemarks(""); // Clear the remarks
        setReturnUserID(""); // Clear the user ID
      });
  };
  
  

  useEffect(() => { // fetch once page loads
    const initialFetch = async () => {
      fetchUserData() // get user data

      if (dataLoaded) {
        fetchApplications() // once user data loads, get applications
        fetchAdvisers() // get all advisers
      }
    }

    initialFetch()

  }, [dataLoaded]);

  useEffect(() => {
    if (userData._id) fetchApplications() // fetch applications whenever search, triggerRebuild, sort, and filterValue values change
  }, [search, triggerRebuild, sort, filterValue])

  useEffect(() => {
    if (currentActiveFilter != "") changeActiveFilter(currentActiveFilter) // for button styling
  }, [currentActiveFilter])

  // fetch user data based on credentials and set userData state
  const fetchUserData = () => {
    fetch(`http://localhost:3001/getloggedinuserdata`, {
      method: "POST",
      credentials: "include"
    })
      .then(response => response.json())
      .then(body => {
        setUserData(body)
        setDataLoaded(true)
      })
  }

  const fetchApplications = () => {
    fetch(`http://localhost:3001/getapplicationsapprover`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        adviserID: userData._id,
        search: search,
        filter: filter,
        filterValue: filterValue,
        sort: sort,
        userType: userData.userType
      })
    })
      .then(response => response.json())
      .then(body => setApplications(body))
  }

  const handleSearch = (e) => {
    console.log(e.target.value)
    setSearch(e.target.value)
  }

  const approveApplication = (appID) => {
    fetch("http://localhost:3001/approveapplication", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ appID: appID, approverType: userData.userType })
    })
      .then(response => response.json())
      .then(body => {
        setTriggerRebuild(!triggerRebuild)
        alert(JSON.stringify(body))
      })
  }

  const fetchAdvisers = () => {
    fetch(`http://localhost:3001/getapproveraccounts?searchName=${""}&sort=${1}`)
      .then(response => response.json())
      .then(body => setAdvisers(body))
  }

  const changeSort = (sort, event) => { // change sort mode
    setSort(sort)
    changeSortButton(event)
  }

  const clearSearch = () => { // clear search
    document.getElementById("search-text").value = ""
    setSearch("")
  }

  const changeSortButton = (event) => { // change css of sort buttons
    const buttons = document.getElementsByName(event.target.name);
    console.log(buttons[0].name)
    for (let i in buttons) {
      if (buttons[i] == event.target) buttons[i].classList.add("active");
      else if (buttons[i].classList?.contains("active")) buttons[i].classList.remove("active");      
    }
  }

  const changeFilter = (filterBy) => { // change filter mode
    setFilter(filterBy)
  }

  const changeActiveFilter = (index) => { // change css of filter buttons
    // uses value attached to div and compare to passed index variable to determine active button
    const filterButtons = document.getElementsByName("filter-buttons");
    for (let i in filterButtons) {
      console.log(filterButtons[i].classList?.contains("active-filter"))
      if (index == filterButtons[i].value) filterButtons[i].classList.add("active-filter");
      else if (filterButtons[i].classList?.contains("active-filter")) filterButtons[i].classList.remove("active-filter");
    }
  }

  const clearFilter = () => { // clear filters
    setFilter("");
    setFilterValue("");
    const filterButtons = document.getElementsByName("filter-buttons");
    for (let i in filterButtons) {
      filterButtons[i].classList?.remove("active-filter");
    }
  }

  const filterButtons = () => {
    let element; // the JS element to be displayed
    let tempFilterValue; // temporary variable for filter value
    let currentActiveFilter; // hold index of current active filter button

    const onSubmit = (e) => { // upon form submission, change filter value and current active filter value
      e.preventDefault()
      setFilterValue(tempFilterValue) 
      setCurrentActiveFilter(currentActiveFilter)
    }

    const filterButton = (index) => { // general button for applying filter
      return (
        <div className="filter-buttons">
          <button type="submit" onClick={(e) => currentActiveFilter = index}>Apply filter</button>
        </div>
      )
    }

    if (filter == "adviser") { // when filter is an adviser
      element = (
        <div>
          {advisers.map((adviser, index) => {
            return (
              <div key={index}>
                <p>{adviser.fullName}</p>
                <button value={0} type="button" onClick={(e) => {
                  setFilterValue(adviser._id)
                  currentActiveFilter = index
                }}>Apply Filter</button>
              </div>
            )
          })}
        </div>
      )
    } else if (filter == "createdAt") { // when filter is date
      element = (
        <form onSubmit={onSubmit}>
          <input type="date" onChange={(e) => {tempFilterValue = e.target.value}} required />
          {filterButton(1)}
        </form>
      )
    } else if (filter == "step") { // when filter is step
      element = (
        <form onSubmit={onSubmit}>
          <input type="number" min={2} max={3} placeholder="2 or 3" onChange={(e) => {tempFilterValue = e.target.value}} required />
          {filterButton(2)}
        </form>
      )
    } else if (filter == "status") { // when filter is status
      element = (
        <form onSubmit={onSubmit} className="status">

          <div className="pending">
            <div>
              <input type="radio" id="pending-radio" name="filter-radio" onClick={(e) => {tempFilterValue = "pending"}} required />
            </div>

            <div className="pending-text">
              <label htmlFor="pending-radio">Pending</label>
            </div>
          </div>
          <br/>
          <div className="cleared">
            <div>
              <input type="radio" id="cleared-radio" name="filter-radio" onClick={(e) => {tempFilterValue = "cleared"}} />
            </div>

            <div className="cleared-text">
              <label htmlFor="cleared-radio">Cleared</label>
            </div>
          </div>

          {filterButton(3)}
        </form>
      )
    }
    return element
  } 

  if (dataLoaded) {
    return (
      <div>
        <nav className="app-nav">
          <header className="app-header">
            <div className="app-image-text">
              <span className="image">
                <img src= {require("./aprub.png")} className='app-logo' alt=""/>
              </span>
              <div className='text header-text'>
              <span className='name'>{userData.fullName}</span>
                <span className='usertype'>{userData.userType.toUpperCase()}</span>
              </div>
            </div>
          </header>

          <div className="filter-bar">
            <div className="filters">
              <p className="filter-title">Filters: </p>

              {
                userData.userType == "officer" &&
                <li className="appnav-btn" name="filter-buttons" value={0}>
                  <div className="active-filter">
                    <BsFillPersonLinesFill className="icon"/>
                    <button className=" text date">Adviser</button>
                  </div>
                </li>
              }

              <li className="date-btn" value={1} name="filter-buttons">
                <div>
                  <MdDateRange className="icon"/>
                  <button className=" text date" onClick={(e) => changeFilter("createdAt", e)}>Date</button>
                </div>
                {filter == "createdAt" && filterButtons()}
              </li>

              <li className="step-btn" value={2} name="filter-buttons">
                <div name="filter-buttons"> 
                  <IoIosPodium className="icon"/>
                  <button className=" text step" onClick={(e) => changeFilter("step", e)}>Step</button>
                </div>
                {filter == "step" && filterButtons()}
              </li>

              <li className="status-btn" value={3} name="filter-buttons">
                <div name="filter-buttons">
                  <MdPendingActions className="icon"/>
                  <button className=" text status" onClick={(e) => changeFilter("status", e)}>Status</button>
                </div>
                {filter == "status" && filterButtons()}
              </li>

              <div className="filter-buttons">
                <button onClick={() => {
                  clearFilter()
                }}>Clear filter</button>
              </div>
            </div>

            <div className='bottom-content'>
                <li className=''>
                    <div>
                        <BiLogOut className='icon'/>
                        <button className='text logout' onClick={handleLogout}>Logout</button>
                    </div>
                </li>
            </div>

          </div>
        </nav>

        <div className="approver-body">
          <h2 className="app-greeting">Hello, {userData.fullName}! ({userData.userType})</h2>
          <h3 className="app-title">Student Applications</h3>
          <div className="search-bar">
            <input type="text" id="search-text" onChange={handleSearch} placeholder="Search for Name or Student No." />
            <button type="button" className="search-btn"   onClick={clearSearch}>Clear Search</button>
          </div>

          <div style={{ display: "flex", columnGap: 5, alignItems: "center" }}>
          <h4>Sort by:</h4>
          <button type="button" name="sort-buttons" className="active" onClick={(e) => changeSort({ date: -1 }, e)}>Date (Descending)</button>
          <button type="button" name="sort-buttons" onClick={(e) => changeSort({ "studentData.0.fullName": 1 }, e)}>Name (Ascending)</button>
          <button type="button" name="sort-buttons" onClick={(e) => changeSort({ "studentData.0.fullName": -1 }, e)}>Name (Descending)</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", rowGap: 10 }}>
        {
          applications.map((application, index) => {
            return (
              <div key={index} style={{ backgroundColor: "lightgray", boxSizing: "border-box", padding: 20}}>
                <b>Name:</b> {application["studentData"][0]["fullName"]} <br />
                <b>Student Number:</b> {application["studentData"][0]["studentNumber"]}<br />
                <b>Adviser:</b> {application["adviserData"][0]["fullName"]} <br />
                <b>Status:</b> {application.status} <br/>
                <b>Step:</b> {application.step} <br />
                {
                  ((userData.userType === "adviser" && application.step === 2) ||
                    (userData.userType === "officer" && application.step === 3)) && (
                    <div style={{ marginTop: 10 }}>
                      <button type="button" onClick={() => approveApplication(application._id)}>Approve</button>
                      <button type="button" onClick={() => setShowRemarks(true)}>Return with Remarks</button>
                    </div>
                  )
                }
                {showRemarks && (
                  <div>
                    <textarea
                      placeholder="Enter remarks"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    ></textarea>
                    <button
                      type="button"
                      onClick={() => {
                        setReturnUserID(userData._id);
                        returnApplication(application._id);
                      }}
                    >
                      Submit Remarks
                    </button>
                  </div>
                )}
              </div>
            )
          })
        }

        </div>
        </div>

      </div>
    );
  } else {
    return (<></>)
  }
}


        {/* <h2 className="app-greeting">Hello, {userData.fullName}! ({userData.userType})</h2>
        <h3 className="app-title">Student Applications</h3>
        <div className="search-bar">
          <input type="text" id="search-text" onChange={handleSearch} placeholder="Search for Name or Student No." />
          <button type="button" className="search-btn"   onClick={clearSearch}>Clear Search</button>
        </div>

        <h4>Filter applications by:</h4>
        <div style={{ display: "flex", flexDirection: "column", rowGap: 10 }}>
          <div style={{ display: "flex", flexDirection: "column", rowGap: 5 }}>
            <div>
              <button type="button" onClick={() => { changeFilter("createdAt") }}>Date</button>
            </div>
            <div>
              {userData.userType == "officer" && <button type="button" onClick={() => { changeFilter("adviser") }}>Adviser</button>}
            </div>
            <div>
              <button type="button" onClick={() => { changeFilter("step") }}>Step</button>
            </div>
            <div>
              <button type="button" onClick={() => { changeFilter("status") }}>Status</button>
            </div>
            <div>
              <button type="button" onClick={() => { setFilter(""); setTriggerRebuild(!triggerRebuild)}}>Clear Filter</button>
            </div>
          </div>
          <FilterOptions filterBy={filter} advisers={advisers} setFilterValue={setFilterValue} fetchApplications={fetchApplications} userData={userData} setAdviserFilterValue={setAdviserFilterValue}/>
        </div>

        <div style={{ display: "flex", columnGap: 5, alignItems: "center" }}>
          <h4>Sort by:</h4>
          <button type="button" onClick={() => setSort({ date: -1 })}>Date (Descending)</button>
          <button type="button" onClick={() => setSort({ "studentData.0.fullName": 1 })}>Name (Ascending)</button>
          <button type="button" onClick={() => setSort({ "studentData.0.fullName": -1 })}>Name (Descending)</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", rowGap: 10 }}>
          {
            applications.map((application, index) => {
              return (
                <div key={index} style={{ backgroundColor: "lightgray" }}>
                  {application["studentData"][0]["fullName"]} <br />
                  {application["studentData"][0]["studentNumber"]}<br />
                  {application["adviserData"][0]["fullName"]} <br />
                  Status: {application.status} <br/>
                  Step {application.step} <br />
                  {
                    ((userData.userType == "adviser" && application.step == 2) ||
                    (userData.userType == "officer" && application.step == 3)) &&
                    <>
                      <button type="button" onClick={() => approveApplication(application._id)}>Approve</button>
                      <button type="button">Return with Remarks</button>
                    </>
                  }
                  
                </div>
              )
            })
          }
        </div> */}