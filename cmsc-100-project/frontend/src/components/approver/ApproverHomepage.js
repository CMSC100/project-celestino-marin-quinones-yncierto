import { useEffect, useState } from "react"

export default function ApproverHomepage() {
    const [userData, setUserData] = useState({})

    // fetch user data based from credentials and set userData state
    useEffect(() => {
        fetch("http://localhost:3001/getloggedinuserdata", {
            method: "POST",
            credentials: "include"
        })
            .then(response => response.json())
            .then(body => setUserData(body))
    }, [])

    return(
        <div>
            Display Sample Data:
            {JSON.stringify(userData)}
        </div>
    )
}