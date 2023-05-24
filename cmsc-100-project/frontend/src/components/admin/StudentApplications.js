import { useEffect, useState } from 'react';

export default function StudentApplications() {
    const [userData, setUserData] = useState({})
    const [pendingAccounts, setPendingAccounts] = useState([])
    const [sort, setSort] = useState("fullName")
    
    // get admin data from DB
    useEffect(() => {
        fetch("http://localhost:3001/getloggedinuserdata", {
            method: "POST",
            credentials: 'include'
        })
            .then(response => response.json())
            .then(body => setUserData(body))
        
        getPendingAccounts()

        // fetch("http://localhost:3001/createapplication", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "aplication/json"
        //     },
        //     body: JSON.stringify({name: "name"})
        // })
        //     .then(response => response.json())
        //     .then(body => console.log(body))

    }, [])

    const getPendingAccounts = function() {
        fetch(`http://localhost:3001/getpendingaccounts?sort=${sort}`)
            .then(response => response.json())
            .then(body => setPendingAccounts(body))
    }

    return(
        <div>
            {
                pendingAccounts.map(function(element, index) {
                    return (
                        <p key={index}>{element.fullName}</p>
                    )
                })
            }
        </div>
    )
}