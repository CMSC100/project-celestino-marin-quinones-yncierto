import { useEffect, useState } from 'react';

export default function StudentApplications() {
    const [userData, setUserData] = useState({})
    
    // get admin data from DB
    useEffect(() => {
        fetch("http://localhost:3001/getloggedinuserdata", {
            method: "POST",
            credentials: 'include'
        })
            .then(response => response.json())
            .then(body => setUserData(body))

        fetch("http://localhost:3001/createapplication", {
            method: "POST",
            headers: {
                "Content-Type": "aplication/json"
            },
            body: JSON.stringify({name: "name"})
        })
            .then(response => response.json())
            .then(body => console.log(body))
    }, [])

    return(
        <div>
            Sample Display (user data):
            <br/>
            {JSON.stringify(userData)}
        </div>
    )
}