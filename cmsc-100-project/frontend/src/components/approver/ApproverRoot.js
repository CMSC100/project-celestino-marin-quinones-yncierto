import Cookies from "universal-cookie";
import { useNavigate, Outlet, Link } from "react-router-dom";
import "./Approver.css";

export default function ApproverRoot() {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    // Clear the authentication token (if applicable)
    // Example: If you are using cookies, use the following code:
    const cookies = new Cookies();
    cookies.remove("authToken");

    // Navigate to the homepage
    navigate("/");
  };

  return (
    <div className="appnav-container">
      {/* <div className='topnav-header'>
                <nav className='top-nav'>
                    <div className='logo-type'>
                        <img src= {require("./logo.png")} className='app-logo' alt=""/>
                        <div className='text'><p className='usertype'>ADVISER</p></div>
                    </div>

                    <button onClick={handleLogout} >Logout</button>
                </nav>
                <div className='main-content-app'>
                    <Outlet />
                </div>
            </div> */}

      <div className="main-content-app">
        <Outlet />
      </div>
    </div>
  );
}
