import Cookies from 'universal-cookie';
import { useNavigate, Outlet, Link } from 'react-router-dom';

export default function ApproverRoot() {

    const navigate = useNavigate()

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
            <Outlet />
        </div>
    )
}