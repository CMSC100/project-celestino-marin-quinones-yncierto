import { useState, useEffect } from 'react';
import './ApproverList.css'

export default function Admin(props) {
    // for setting default value of edit text fields
    const [approverDetails, setApproverDetails] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        // email: "",
        // password: "",
    })
    // for getting all approver accounts
    const [approverAccounts, setApproverAccounts] = useState([])
    // store 
    const [isEditing, setIsEditing] = useState(false)
    const [editingApprover, setEditingApprover] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        // email: "",
        // password: "",
    })
    const [approverID, setApproverID] = useState("")
    const [searchName, setSearchName] = useState("")
    const [filter, setFilter] = useState(1)

    useEffect(function() {
        getApproverAccounts(searchName, filter)
    }, [searchName, filter])

    useEffect(function() {
        setEditingApprover(approverDetails)
    }, [approverDetails])

    const createApprover = function(e) {
        e.preventDefault()
        fetch("http://localhost:3001/createapprover", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName: document.getElementById("s-fname").value,
                middleName: document.getElementById("s-mname").value,
                lastName: document.getElementById("s-lname").value,
                email: document.getElementById("s-email").value,
                password: document.getElementById("s-password").value,
                userType: "approver"
            })
        })
            .then(response => response.json())
            .then(function(body) {
                if (body["success"]) {
                    getApproverAccounts(searchName, filter)
                    alert("Approver account created.")
                }
                else alert("Creation of approver account failed.")
            })
    }

    const editApprover = function(e) {
        e.preventDefault()
        fetch("http://localhost:3001/editapprover", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                docRef: approverID,
                firstName: document.getElementById("s-fname").value,
                middleName: document.getElementById("s-mname").value,
                lastName: document.getElementById("s-lname").value,
            })
        })
            .then(response => response.json())
            .then(function(body) {
                getApproverAccounts(searchName, filter)
                if (body["edited"] == "edited") {
                    alert("Approver account edited.")
                    setIsEditing(false)
                } else if (body["edited"] == "no fields changed") alert("No fields were edited.")
                else alert("Failed to edit approver account.")
            })
    }

    const handleEditChange = function(e) {
        let newDetails = {...editingApprover}
        if (e.target.name == "fname") newDetails.firstName = e.target.value
        else if (e.target.name == "mname") newDetails.middleName = e.target.value
        else if (e.target.name == "lname") newDetails.lastName = e.target.value
        setEditingApprover(newDetails)
    }

    const getApproverAccounts = function(searchName, filter) {
        fetch(`http://localhost:3001/getapproveraccounts?searchName=${searchName}&filter=${filter}`)
            .then(response => response.json())
            .then(function(body) {
                setApproverAccounts(body)
            })
    }

    const getApproverDetails = function(approverID) {
        fetch(`http://localhost:3001/getapproverdetails?docRef=${approverID}`)
            .then(response => response.json())
            .then(function(body) { console.log(body)
                setApproverDetails({
                firstName: body.firstName,
                middleName: body.middleName,
                lastName: body.lastName,
                // email: body[0].email,
                // password: ""
            })})

        setIsEditing(true)
        setApproverID(approverID)
    }

    const deleteApprover = function(approverID) {
        console.log("proceed")
        fetch("http://localhost:3001/deleteapprover", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                docRef: approverID,
            })
        })
            .then(response => response.json())
            .then(function(body) {
                getApproverAccounts(searchName, filter)
                if (body["deleted"]) alert("Successfully deleted approver account.")
                else alert("Failed to delete approver account")
            })
    }

    const handleSearchNameChange = function(e) {
        setSearchName(e.target.value)
    }
    
    const clearSearch = function() {
        setSearchName("")
        document.getElementById("clearSearch").value = ""
    }

    const filterApproverList = function(e) {
        let filterButtons = document.getElementsByName("filterButton")
        filterButtons.forEach(function(element, index) {
            if (e.target.value == element.value) element.classList.add("active")
            else element.classList.remove("active")
        })
        console.log(e.target.value)
        setFilter(e.target.value)
    }

    return (
        <>
            <span>Filter Approver List:</span>
            <button type="button" name="filterButton" id="filterAscButton" className='active' onClick={filterApproverList} value={1}>Ascending</button>
            <button type='button' name="filterButton" id='filterDescButton' onClick={filterApproverList} value={-1}>Descending</button>
            <br/>
            <label htmlFor="searchName">Search for Approver: </label>
            <input type='text' id="searchName" name="searchName" placeholder='Enter name of approver' onChange={handleSearchNameChange} value={searchName}/>
            <button type='button' id='clearSearch' onClick={clearSearch}>Display All Approver</button>
            <ul>
                {approverAccounts.map((element, index) => {
                    return (
                        <li key={index}>
                            <p>{element.firstName} {element.middleName} {element.lastName}</p>
                            <button type='button' onClick={function() {
                                getApproverDetails(element._id)
                            }}>
                                Edit
                            </button>
                            <button type='button' onClick={function() {
                                deleteApprover(element._id)
                            }}>
                                Delete
                            </button>
                        </li>
                    )
                })}
            </ul>
            {isEditing &&
                <form onSubmit={editApprover}>
                    <div className="container-form">
                        <label htmlFor="fname"><b>First Name</b></label>
                        <input id="s-fname" type="text" placeholder="Enter first name" value={editingApprover.firstName} name="fname" onChange={handleEditChange} required />

                        <label htmlFor="mname"><b>Middle Name</b></label>
                        <input id="s-mname" type="text" placeholder="Enter middle name" value={editingApprover.middleName} name="mname" onChange={handleEditChange} required />

                        <label htmlFor="lname"><b>Last Name</b></label>
                        <input id="s-lname" type="text" placeholder="Enter last name" value={editingApprover.lastName} name="lname" onChange={handleEditChange} required />
                        {/* <label htmlFor="email"><b>Email</b></label>
                        <input id="s-email" type="text" placeholder="Enter Email" defaultValue={approverDetails.email} name="email" required />

                        <label htmlFor="psw"><b>Password</b></label>
                        <input id="s-password" type="password" placeholder="Enter Password" defaultValue={approverDetails.password} name="psw" required /> */}

                        <div className="signup-back-btn">
                            <button className="signup-back-btn" type="submit">Edit</button>
                            <button type="reset" className="cancelbtn" onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </div>
                </form>
            }
            <form onSubmit={createApprover}>
                    <div className="container-form">
                        <label htmlFor="fname"><b>First Name</b></label>
                        <input id="s-fname" type="text" placeholder="Enter first name" name="fname" required />

                        <label htmlFor="mname"><b>Middle Name</b></label>
                        <input id="s-mname" type="text" placeholder="Enter middle name" name="mname" required />

                        <label htmlFor="lname"><b>Last Name</b></label>
                        <input id="s-lname" type="text" placeholder="Enter last name" name="lname" required />

                        <label htmlFor="email"><b>Email</b></label>
                        <input id="s-email" type="text" placeholder="Enter Email" name="email" required />

                        <label htmlFor="psw"><b>Password</b></label>
                        <input id="s-password" type="password" placeholder="Enter Password" name="psw" required />

                        <div className="signup-back-btn">
                            <button className="signup-back-btn" type="submit">Submit</button>
                            <button type="reset" className="cancelbtn">Cancel</button>
                        </div>
                    </div>
                </form>
        </>
    )
}