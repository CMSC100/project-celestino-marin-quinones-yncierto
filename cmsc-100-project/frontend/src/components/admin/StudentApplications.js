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
    }, [])

    return(
        <div>
            Sample Display (user data):
            <br/>
            {JSON.stringify(userData)}
        </div>
    )
}