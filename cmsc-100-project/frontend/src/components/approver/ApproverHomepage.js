import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

export default function ApproverHomepage() {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  // fetch user data based on credentials and set userData state
  useEffect(() => {
    fetch("http://localhost:3001/getloggedinuserdata", {
      method: "POST",
      credentials: "include"
    })
      .then((response) => response.json())
      .then((body) => setUserData(body));
  }, []);

  // handle logout
  const handleLogout = () => {
    // Perform logout logic, e.g., clearing cookies, local storage, etc.
    // Then navigate to the login page
    const cookies = new Cookies();
        cookies.remove('authToken');
    
        // Navigate to the homepage
        navigate('/');
    
  };

  return (
    <div>
      <div className="header">
        <h2>Welcome, {userData.name}</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className="content">
        <h3>Sample Data:</h3>
        <pre>{JSON.stringify(userData, null, 2)}</pre>
      </div>
    </div>
  );
}
