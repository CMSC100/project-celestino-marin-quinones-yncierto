import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

export default function ApproverHomepage() {
  const [userData, setUserData] = useState({});
  const [applications, setApplications] = useState([])
  const [search, setSearch] = useState("")
  const [triggerRebuild, setTriggerRebuild] = useState(false)
  const [filter, setFilter] = useState("")
  const [filterValue, setFilterValue] = useState("")
  const [filterElement, setFilterElement] = useState(<></>)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [advisers, setAdvisers] = useState([])
  const [sort, setSort] = useState("date")
  const navigate = useNavigate();

  // fetch user data based on credentials and set userData state
  const fetchUserData = async () => {
    return fetch(`http://localhost:3001/getloggedinuserdata`, {
      method: "POST",
      credentials: "include"
    })
      .then(response => response.json())
      .then(body => {
        setUserData(body)
        return body._id
      })
  }

  const fetchApplications = async (adviserID) => {
    console.log(sort)
    await fetch(`http://localhost:3001/getapplications?adviserID=${adviserID}&search=${search}&filter=${filter}&filterValue=${filterValue}&sort=${sort}`)
      .then(response => response.json())
      .then(body => setApplications(body))
  }

   useEffect(() => {
    const initialFetch = async () => {
      let adviserID = await fetchUserData()
      
      if (adviserID) {
        fetchApplications(adviserID)
        setDataLoaded(true)
      }
    }

    initialFetch()

  }, []);

  useEffect(() => {
    if (userData._id) fetchApplications(userData._id)
  }, [search, triggerRebuild, sort])

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
      body: JSON.stringify({appID: appID})
    })
      .then(response => response.json())
      .then(body => {
        setTriggerRebuild(!triggerRebuild)
        alert(JSON.stringify(body))
      })
  }

  // const displayFilterSelection = (filterBy) => {
  //   setFilter(filterBy)

  //   const onSubmit = (e) => {
  //     e.preventDefault()
  //     console.log(filter, filterValue)

  //     fetchApplications(userData._id)
  //   }

  //   let filterButton = (
  //       <button type="submit">Filter</button>
  //   )

  //   if (filterBy == "createdAt") {
  //     setFilterElement(
  //       <form onSubmit={onSubmit}>
  //         <p>Enter date:</p>
  //         <input type="date" onChange={(e) => {setFilterValue(e.target.value)}} required/>
  //         {filterButton}
  //       </form>
  //     )
  //   } else if (filterBy == "adviser") {
  //     // setFilterElement(
  //     //   <form onSubmit={onSubmit}>
  //     //     <p>Choose Adviser</p>
  //     //     <input type="date" onChange={(e) => setFilterValue(e.target.value)} required/>
  //     //     {filterButton}
  //     //   </form>
  //     // )
  //   } else if (filterBy == "step") {
  //     setFilterElement(
  //       <div>
  //         {filterButton}
  //       </div>
  //     )
  //   } else {
  //     setFilterElement(
  //       <div>
  //         {filterButton}
  //       </div>
  //     )
  //   }
  // }

  if (dataLoaded) {
    return (
      <div>
        <h3>Student Applications</h3>
        <input type="text" onChange={handleSearch} placeholder="Search for Name or Student No."/>

        {/* <h4>Filter applications by:</h4>
        <div style={{display: "flex", flexDirection: "row", columnGap: 10}}>
          <div style={{display: "flex", flexDirection: "column", rowGap: 5}}>
            <button type="button" onClick={() => {displayFilterSelection("createdAt")}}>Date</button>
            {<button type="button" onClick={() => {displayFilterSelection("adviser")}}>Adviser</button>}
            <button type="button" onClick={() => {displayFilterSelection("step")}}>Step</button>
            <button type="button" onClick={() => {displayFilterSelection("status")}}>Status</button>
          </div>
          {filterElement}
        </div> */}

        <div style={{display: "flex", columnGap: 5, alignItems: "center"}}>
          <h4>Sort by:</h4>
          <button type="button" onClick={() => setSort("date")}>Date (Descending)</button>
          <button type="button" onClick={() => setSort("nameA")}>Name (Ascending)</button>
          <button type="button" onClick={() => setSort("nameD")}>Name (Descending)</button>
        </div>
        
        <div style={{display: "flex", flexDirection: "column", rowGap: 10}}>
          {
            applications.map((application, index) => {
              return (
                <div key={index} style={{backgroundColor: "lightgray"}}>
                  {JSON.stringify(application, null, 2)}
                  <button type="button" onClick={() => approveApplication(application._id)}>Approve</button>
                  <button type="button">Return with Remarks</button>
                </div>
              )
            })
          }
        </div>
      </div>
    );
  } else {
    return (<></>)
  }
}
