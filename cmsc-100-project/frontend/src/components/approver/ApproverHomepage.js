import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

export default function ApproverHomepage() {
  const [userData, setUserData] = useState({});
  const [applications, setApplications] = useState([])
  const [search, setSearch] = useState("")
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
    await fetch(`http://localhost:3001/getapplications?adviserID=${adviserID}&search=${search}`)
      .then(response => response.json())
      .then(body => setApplications(body))
  }

  useEffect(() => {
    const initialFetch = async () => {
      let adviserID = await fetchUserData()
      fetchApplications(adviserID)
    }

    initialFetch()
  }, []);

  useEffect(() => {
    if (userData._id) fetchApplications(userData._id)
  }, [search])

  const handleSearch = (e) => {
    console.log(e.target.value)
    setSearch(e.target.value)
  }

  return (
    <div>
      <h3>Student Applications</h3>
      {/* <input type="text" onChange={handleSearch} placeholder="Search for Name or Student No."/> */}
      <div style={{display: "flex", flexDirection: "column", rowGap: 10}}>
        {
          applications.map((application, index) => {
            return (
              <div key={index} style={{backgroundColor: "lightgray"}}>
                {JSON.stringify(application, null, 2)}
                <button type="button">Approve</button>
                <button type="button">Return with Remarks</button>
              </div>
            )
          })
        }
      </div>
    </div>
  );
}
