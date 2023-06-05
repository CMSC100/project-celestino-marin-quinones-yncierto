import { useEffect, useState, useContext } from 'react';
import './StudentApplications.css';
import '../../../theme'
import { tokens, ColorModeContext } from '../../../theme';
import { useTheme, IconButton } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export default function StudentApplications() {
    const [userData, setUserData] = useState({})
    const [pendingAccounts, setPendingAccounts] = useState([])
    const [sort, setSort] = useState("fullName")
    const [showDisplay, setShowDisplay] = useState("pending accounts")
    const [students, setStudents] = useState([])
    const [studentIDAssign, setStudentIDAssign] = useState(0)
    const [advisers, setAdvisers] = useState([])
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const btn = document.getElementById('btn');
    const sbtn = document.getElementById('sbtn');

    // get admin data from DB
    useEffect(() => {
        fetch("http://localhost:3001/getloggedinuserdata", {
            method: "POST",
            credentials: 'include'
        })
            .then(response => response.json())
            .then(body => setUserData(body))
        getAdvisers()
    }, [])

    // get admin data from DB
    useEffect(() => {
        fetch("http://localhost:3001/getloggedinuserdata", {
            method: "POST",
            credentials: "include",
        })
            .then((response) => response.json())
            .then((body) => setUserData(body));
        getAdvisers();
    }, []);

    useEffect(() => {
        getPendingAccounts();
        getStudents();
    }, [sort]);

    const leftClick = function () {
        btn.style.left = '0';
    }

    const rightClick = function () {
        btn.style.left = '200px';
    }

    const leftClickSort = function () {
        if (sbtn && sbtn.style) {
            sbtn.style.left = '0';
        }
    }

    const rightClickSort = function () {
        if (sbtn && sbtn.style) {
            sbtn.style.left = '125px';
        }
    }

    const getPendingAccounts = function () {
        fetch(`http://localhost:3001/getpendingaccounts?sort=${sort}`)
            .then((response) => response.json())
            .then((body) => setPendingAccounts(body));
    };

    const changeDisplay = function (value) {
        changeSort("fullName");
        setShowDisplay(value);
    };

    const changeSort = function (value) {
        setSort(value);
    };

    const rejectAccount = function (docRef) {
        fetch("http://localhost:3001/rejectaccount", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ docRef: docRef })
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

    // const changeActiveButton = (e) => {
    //     let names = document.getElementsByName(e.target.name)
    //     names.forEach((element) => {
    //         element.classList.remove("active")
    //     })
    //     e.target.classList.add("active")
    // }

    const getStudents = function () {
        fetch(`http://localhost:3001/getstudents?sort=${sort}`)
            .then(response => response.json())
            .then(body => setStudents(body))
    }

    const getAdvisers = function () {
        fetch("http://localhost:3001/getadvisers")
            .then(response => response.json())
            .then(body => setAdvisers(body))
    }

    const assignAdviser = function (adviserIDAssign) {
        // Check if the student already has an adviser
        const student = students.find(student => student._id === studentIDAssign);
        if (student.adviser) {
            alert("The student already has an adviser.");
            return;
        }
    }

    const approveAccount = function (docRef) {
        fetch("http://localhost:3001/approveaccount", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ docRef: docRef }),
        })
            .then((response) => response.json())
            .then((body) => {
                if (body["success"]) {
                    getPendingAccounts();
                    getStudents();
                    alert("User account has been approved.");
                } else {
                    alert("Failed to approve user account.");
                }
            });
    };

    return (
        <div className='contentFeed'>
            <div className='header'>
                <div className='titleAndToggle'>
                    <span className='contentTitle'>Manage Student Account Applications</span>
                    <div className='toggleBtns' style={{ backgroundColor: theme.palette.mode === 'dark' ? colors.primary[400] : colors.primary[800] }}>
                        <div id='btn' style={{ backgroundColor: '#2a2d64' }}></div>
                        <button type="button" className='toggleButton' onClick={(e) => {
                            // changeActiveButton(e)
                            changeDisplay("pending accounts")
                            leftClick();
                        }}><span style={{ color: !theme.palette.primary[100] }}>View Pending Accounts</span></button>
                        <button type="button" className='toggleButton' onClick={(e) => {
                            // changeActiveButton(e)
                            changeDisplay("students")
                            rightClick();
                        }}><span style={{ color: !theme.palette.primary[100] }}>View Students</span></button>
                    </div>
                </div>
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === "light" ? (
                        <LightModeIcon />
                    ) : (<DarkModeIcon />)}
                </IconButton>
            </div>
            {
                showDisplay === "pending accounts" &&
                <div className='pendingContent' style={{ backgroundColor: theme.palette.mode === 'dark' ? colors.primary[400] : 'white' }}>
                    <div className='sort'>
                        <span className='iconLabel'>Sort By</span>
                        <div className='sortBtns' style={{ backgroundColor: theme.palette.mode === 'dark' ? colors.gray[300] : colors.gray[900] }}>
                            <div id='sbtn' style={{ backgroundColor: '#f5f4f7' }}></div>
                            <button type="button" className='sortButton' onClick={(e) => {
                                leftClickSort();
                                changeSort('fullName');
                            }}><span style={{ color: 'black' }}>Full name</span></button>
                            <button type="button" className='sortButton' onClick={(e) => {
                                rightClickSort();
                                changeSort("studentNumber");
                            }}><span style={{ color: 'black' }}>Student number</span></button>
                        </div>
                    </div>
                    

                    <div className="pendingList">
                        <div className='rowHeaders' style={{ backgroundColor: theme.palette.mode === 'dark' ? colors.primary[500] : colors.gray[900] }}>
                            <span className='indivHeader'>FULL NAME</span>
                            <span className='indivHeader'>STUDENT NUMBER</span>
                            <span className='indivHeader'>EMAIL</span>
                        </div>

                        <div className='tableRows' style={{ backgroundColor: theme.palette.mode === 'dark' ? colors.primary[100] : '#f5f4f7' }}>
                            {pendingAccounts.map(function (element, index) {
                                return (
                                    <div className='rows'>
                                        <div className='column' id='fname'>
                                            <span style={{ color: 'black' }}>{element.fullName} </span>
                                        </div>
                                        <div className='column' id='studno'>
                                            <span style={{ color: 'black' }}>{element.studentNumber} </span>
                                        </div>
                                        <div className='column' id='email'>
                                            <span style={{ color: 'black' }}>{element.email} </span>
                                            <div className='approveReject'>
                                                <IconButton id='approve' style={{ backgroundColor: "transparent" }} type='button' onClick={() => { approveAccount(element._id) }}><CheckCircleIcon style={{ width: '35px', height: '35px' }} /></IconButton>
                                                <IconButton id='reject' style={{ backgroundColor: "transparent" }} type='button' onClick={() => { rejectAccount(element._id) }}><CancelIcon style={{ width: '35px', height: '35px' }} /></IconButton>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            }
            {
                showDisplay === "students" &&
                <div className='outer-container'>
                    <div className='studentListContent' style={{ backgroundColor: theme.palette.mode === 'dark' ? colors.primary[400] : 'white' }}>
                        <div className='sort'>
                            <span className='iconLabel'>Sort By</span>
                            <div className='sortBtns' style={{ backgroundColor: theme.palette.mode === 'dark' ? colors.gray[300] : colors.gray[900] }}>
                                <div id='sbtn' style={{ backgroundColor: '#f5f4f7' }}></div>
                                <button type="button" className='sortButton' onClick={(e) => {
                                    leftClickSort();
                                    changeSort('fullName');
                                }}><span style={{ color: 'black' }}>Full name</span></button>
                                <button type="button" className='sortButton' onClick={(e) => {
                                    rightClickSort();
                                    changeSort("studentNumber");
                                }}><span style={{ color: 'black' }}>Student number</span></button>
                            </div>
                        </div>
                        
                        <div className='studentList'>
                            <div className='rowHeaders' style={{ backgroundColor: theme.palette.mode === 'dark' ? colors.primary[500] : colors.gray[900] }}>
                                <span className='indivHeader'>FULL NAME</span>
                                <span className='indivHeader'>STUDENT NUMBER</span>
                                <span className='indivHeader'>EMAIL</span>
                            </div>
                            <div className='tableRows' style={{ backgroundColor: theme.palette.mode === 'dark' ? colors.primary[100] : '#f5f4f7' }}>
                                {students.map(function (element, index) {
                                    return (
                                        <div className='rows'>
                                            <div className='column' id='fname'>
                                                <span style={{ color: 'black' }}>{element.fullName} </span>
                                            </div>
                                            <div className='column' id='studno'>
                                                <span style={{ color: 'black' }}>{element.studentNumber} </span>
                                            </div>
                                            <div className='column' id='email'>
                                                <span style={{ color: 'black' }}>{element.email} </span>
                                                <button type='button' style={{ backgroundColor: theme.palette.mode === 'dark' ? colors.blueAccent[700] : colors.greenAccent[400] }} onClick={() => {
                                                    document.getElementById("modal").style.display = "block"
                                                    setStudentIDAssign(element._id)
                                                }}>Assign Adviser
                                                </button>
                                            </div>
                                            {/* <span>{element.fullName} {element.studentNumber} {element.email}</span> */}
                                            
                                        </div>

                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div id='modal'>
                        <div className='assign-container' style={{ backgroundColor: theme.palette.mode === 'dark' ? colors.primary[400] : 'white' }}>
                            <div className='modal-rows'>
                                {
                                    advisers.map((element, index) => {
                                        return (
                                            <div key={index} className='modal-row'>
                                                <span style={{ fontSize: '13px', color: theme.palette.mode === 'dark' ? 'white' : 'black' }}>{element.fullName}</span>
                                                <button type="button" onClick={() => assignAdviser(element._id)}>Assign</button>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className='cancelBtn'>
                                <button type='button' onClick={() => {
                                    document.getElementById("modal").style.display = "none"
                                }}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}
