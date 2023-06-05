import Cookies from 'universal-cookie';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { ColorModeContext, useMode } from '../../theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import '../../theme.js';
import { tokens } from '../../theme';
import TopBar from './global/TopBar';
import SideBar from './global/Sidebar/SideBar.jsx';
import './AdminRoot.css';
import '../../index.css'


export default function AdminRoot() {
    const colors = tokens(theme.palette.mode);
    const [theme, colorMode] = useMode();
    const navigate = useNavigate();

    return(
        <ColorModeContext.Provider value={ colorMode }>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className='admin'>
                    <SideBar/>
                    <Outlet/>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
    )
}

                    // <button type="button" onClick={handleLogout}>Logout</button>
                    // <Link to="/admin/manage-student-apps">
                    //     <button type="button" className='active' id='student-button' onClick={() => {
                    //         document.getElementById("student-button").classList.add("active")
                    //         document.getElementById("approver-button").classList.remove("active")
                    //     }}>Manage Student Applicati ons</button>
                    // </Link>
                    // <Link to="/admin/manage-approvers">
                    //     <button type="button" id='approver-button' onClick={() => {
                    //         document.getElementById("approver-button").classList.add("active")
                    //         document.getElementById("student-button").classList.remove("active")
                    //     }}>Manage Approvers</button>
                    // </Link>
