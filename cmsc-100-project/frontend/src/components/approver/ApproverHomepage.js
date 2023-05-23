import { useEffect, useState } from "react"
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';

export default function ApproverHomepage() {
    const [userData, setUserData] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        fetch("http://localhost:3001/getloggedinuserdata", {
            method: "POST",
            credentials: "include"
        })
            .then(response => response.json())
            .then(body => setUserData(body))
    }, [])

    const handleLogout = (e) => {
        // Clear the authentication token (if applicable)
        // Example: If you are using cookies, use the following code:
        const cookies = new Cookies();
        cookies.remove('authToken');
    
        // Navigate to the homepage
        navigate('/');
    }

    return(
        <div>
            <button type="button" onClick={handleLogout}>Logout</button>
            APPROVER
            <br/>
            Display Sample Data:
            {JSON.stringify(userData)}
        </div>
    )
}