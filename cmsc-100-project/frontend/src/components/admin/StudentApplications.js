import { useEffect, useState } from 'react';

export default function StudentApplications() {
    const [userData, setUserData] = useState({})
    const [pendingAccounts, setPendingAccounts] = useState([])
    const [sort, setSort] = useState("fullName")
    const [showDisplay, setShowDisplay]  = useState("pending accounts")
    
    // get admin data from DB
    useEffect(() => {
        fetch("http://localhost:3001/getloggedinuserdata", {
            method: "POST",
            credentials: 'include'
        })
            .then(response => response.json())
            .then(body => setUserData(body))
    }, [])

    useEffect(() => {
        getPendingAccounts()
    }, [sort])

    const getPendingAccounts = function() {
        fetch(`http://localhost:3001/getpendingaccounts?sort=${sort}`)
            .then(response => response.json())
            .then(body => setPendingAccounts(body))
    }

    const changeDisplay = function(value) {
        if (value === "pending accounts") {
            changeSort("fullName")
        }
        setShowDisplay(value)
    }

    const changeSort = function(value) {
        setSort(value)
    }

    const approveAccount = function(docRef) {
        fetch("http://localhost:3001/approveaccount", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({docRef: docRef})
        })
            .then(response => response.json())
            .then(body => {
                if (body["success"]) {
                    getPendingAccounts()
                    alert("User account has been approved.")
                } else {
                    alert("Failed to approve user account.")
                }
            })
    }

    const rejectAccount = function(docRef) {
        fetch("http://localhost:3001/rejectaccount", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({docRef: docRef})
        })
            .then(response => response.json())
            .then(body => {
                if (body["deleted"]) {
                    getPendingAccounts()
                    alert("User account has been rejected.")
                } else {
                    alert("Failed to reject user account.")
                }
            })
    }

    return(
        <div>
            <button type="button" onClick={() => {changeDisplay("pending accounts")}}>View Pending Accounts</button>
            <button type="button" onClick={() => {changeDisplay("students")}}>View Students</button>
            {
                showDisplay === "pending accounts" &&
                    <div>
                        Sort By:
                        <button type="button" onClick={() => {changeSort("fullName")}}>Full Name</button>
                        <button type="button" onClick={() => {changeSort("studentNumber")}}>Student Number</button>
                        <div style={{display: "flex", flexDirection: "column", rowGap: 20}}>
                            {pendingAccounts.map(function(element, index) {
                                return (
                                    <div key={index} style={{backgroundColor: "gainsboro"}}>
                                        <span>{element.fullName} {element.studentNumber} {element.email}</span>
                                        <div>
                                            <button type='button' onClick={() => {approveAccount(element._id)}}>Approve</button>
                                            <button type='button' onClick={() => {rejectAccount(element._id)}}>Reject</button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
            }
            {
                showDisplay === "students" &&
                    <div>
                        
                    </div>
            }
        </div>
    )
}