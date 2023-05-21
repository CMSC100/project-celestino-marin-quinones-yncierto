import { useState } from 'react';
import { useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function Admin(props) {
    const [approverDetails, setApproverDetails] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        // email: "",
        // password: "",
    })
    const [approverAccounts, setApproverAccounts] = useState([])
    const [editing, setEditing] = useState(false)
    const [approverID, setApproverID] = useState("")

    useEffect(() => {
        getApproverAccounts()
    }, [])

    const createApprover = (e) => {
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
                    getApproverAccounts()
                    alert("Approver account created.")
                }
                else alert("Creation of approver account failed.")
            })
    }

    const editApprover = (e) => {
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
                getApproverAccounts()
                if (body["edited"]) alert("Approver account edited.")
                else alert("Failed to edit approver account.")
            })
    }

    const getApproverAccounts = () => {
        fetch("http://localhost:3001/getapproveraccounts")
            .then(response => response.json())
            .then(function(body) {
                setApproverAccounts(body)
            })
    }

    const getApproverDetails = (approverID) => {
        fetch(`http://localhost:3001/getapproverdetails?docRef=${approverID}`)
            .then(response => response.json())
            .then(function(body) { console.log(body)
                setApproverDetails({
                firstName: body[0].firstName,
                middleName: body[0].middleName,
                lastName: body[0].lastName,
                // email: body[0].email,
                // password: ""
            })})

        setEditing(true)
        setApproverID(approverID)
    }

    const deleteApprover = (approverID) => {
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
                getApproverAccounts()
                if (body["deleted"]) alert("Successfully deleted approver account.")
                else alert("Failed to delete approver account")
            })
    }

    return (
        <>
            <ul>
                {approverAccounts.map((element, index) => {
                    return (
                        <li key={index}>
                            <p>{element.firstName}</p>
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
            {editing &&
                <form onSubmit={editApprover}>
                    <div className="container-form">
                        <label htmlFor="fname"><b>First Name</b></label>
                        <input id="s-fname" type="text" placeholder="Enter first name" defaultValue={approverDetails.firstName} name="fname" required />

                        <label htmlFor="mname"><b>Middle Name</b></label>
                        <input id="s-mname" type="text" placeholder="Enter middle name" defaultValue={approverDetails.middleName} name="mname" required />

                        <label htmlFor="lname"><b>Last Name</b></label>
                        <input id="s-lname" type="text" placeholder="Enter last name" defaultValue={approverDetails.lastName} name="lname" required />

                        {/* <label htmlFor="email"><b>Email</b></label>
                        <input id="s-email" type="text" placeholder="Enter Email" defaultValue={approverDetails.email} name="email" required />

                        <label htmlFor="psw"><b>Password</b></label>
                        <input id="s-password" type="password" placeholder="Enter Password" defaultValue={approverDetails.password} name="psw" required /> */}

                        <div className="signup-back-btn">
                            <button className="signup-back-btn" type="submit">Edit</button>
                            <button type="reset" className="cancelbtn">Cancel</button>
                        </div>
                    </div>
                </form>
            }
            <form onSubmit={createApprover}>
                    <div className="container-form">
                        <label htmlFor="fname"><b>First Name</b></label>
                        <input id="s-fname" type="text" placeholder="Enter first name" defaultValue={approverDetails.firstName} name="fname" required />

                        <label htmlFor="mname"><b>Middle Name</b></label>
                        <input id="s-mname" type="text" placeholder="Enter middle name" defaultValue={approverDetails.middleName} name="mname" required />

                        <label htmlFor="lname"><b>Last Name</b></label>
                        <input id="s-lname" type="text" placeholder="Enter last name" defaultValue={approverDetails.lastName} name="lname" required />

                        <label htmlFor="email"><b>Email</b></label>
                        <input id="s-email" type="text" placeholder="Enter Email" defaultValue={approverDetails.email} name="email" required />

                        <label htmlFor="psw"><b>Password</b></label>
                        <input id="s-password" type="password" placeholder="Enter Password" defaultValue={approverDetails.password} name="psw" required />

                        <div className="signup-back-btn">
                            <button className="signup-back-btn" type="submit">Submit</button>
                            <button type="reset" className="cancelbtn">Cancel</button>
                        </div>
                    </div>
                </form>
        </>
    )
}