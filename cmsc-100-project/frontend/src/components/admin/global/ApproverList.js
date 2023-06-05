import { useState, useEffect, useContext } from 'react';
import { useTheme, IconButton } from '@mui/material';
import { tokens, ColorModeContext } from '../../../theme';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import UploadRoundedIcon from '@mui/icons-material/UploadRounded';
import './ApproverList.css'

export default function Admin(props) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  // for setting default value of edit text fields
  const [approverDetails, setApproverDetails] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    // email: "",
    // password: "",
  });
  // for getting all approver accounts
  const [approverAccounts, setApproverAccounts] = useState([]);
  // store boolean for editing status
  const [isEditing, setIsEditing] = useState(false);
  // details that editing text fields can change
  const [editingApprover, setEditingApprover] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    // email: "",
    // password: "",
  });
  // get approverID of which approver to delete/edit
  const [approverID, setApproverID] = useState("");
  // store string for searching name
  const [searchName, setSearchName] = useState("");
  // store int (1 or -1) for sorting
  const [sort, setSort] = useState(1);
  const sbtn = document.getElementById('sbtn');
  
  // reload approver accounts when searching or sort is changed
  useEffect(
    function () {
      getApproverAccounts();
    },
    [searchName, sort]
  );

  // change editable approver details map
  useEffect(
    function () {
      setEditingApprover(approverDetails);
    },
    [approverDetails]
  );
  
  // function for creating an approver
  const signUp = function (e) {
    e.preventDefault();
    // send new data to api
    fetch("http://localhost:3001/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: document.getElementById("s-fname").value,
        middleName: document.getElementById("s-mname").value,
        lastName: document.getElementById("s-lname").value,
        email: document.getElementById("s-email").value,
        password: document.getElementById("s-password").value,
        userType: "adviser",
      }),
    })
      .then((response) => response.json())
      .then(function (body) {
        console.log(body);
        if (body["success"]) {
          // reload approver list and display proper alert
          document.getElementById("create-form").reset();
          getApproverAccounts();
          alert("Adviser account created.");
        } else if (body["emailExists"]) {
          console.log("lmao2");
          alert("Email already exists.");
        } else {
          alert("Failed to create adviser account");
        }
      });
  };

  // edit approver details
  const editApprover = function (e) {
    e.preventDefault();
    // send edited value to api
    fetch("http://localhost:3001/editapprover", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docRef: approverID,
        firstName: document.getElementById("s-fname").value,
        middleName: document.getElementById("s-mname").value,
        lastName: document.getElementById("s-lname").value,
      }),
    })
      .then((response) => response.json())
      .then(function (body) {
        // reload approver list
        getApproverAccounts();
        if (body["edited"] === "edited") {
          alert("Approver account edited.");
          setIsEditing(false); // remove edit form
        } else if (body["edited"] === "no fields changed")
          alert("No fields were edited.");
        else alert("Failed to edit approver account.");
      });
  };
  // function for handling changes in text fields for editing
  const handleEditChange = function (e) {
    let newDetails = { ...editingApprover };
    if (e.target.name === "fname") newDetails.firstName = e.target.value;
    else if (e.target.name === "mname") newDetails.middleName = e.target.value;
    else if (e.target.name === "lname") newDetails.lastName = e.target.value;
    setEditingApprover(newDetails);
  };

  // load all approver accounts based on user search and sort
  const getApproverAccounts = function () {
    fetch(
      `http://localhost:3001/getapproveraccounts?searchName=${searchName}&sort=${sort}`
    )
      .then((response) => response.json())
      .then(function (body) {
        setApproverAccounts(body);
      });
  };

  // get specific approver details for editing
  const getApproverDetails = function (approverID) {
    fetch(`http://localhost:3001/getapproverdetails?docRef=${approverID}`)
      .then((response) => response.json())
      .then(function (body) {
        console.log(body);
        setApproverDetails({
          firstName: body.firstName,
          middleName: body.middleName,
          lastName: body.lastName,
          // email: body[0].email,
          // password: ""
        });
      });

    setIsEditing(true);
    setApproverID(approverID);
  };

  // delete approver account
  const deleteApprover = function (approverID) {
    console.log("proceed");
    fetch("http://localhost:3001/deleteapprover", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docRef: approverID,
      }),
    })
      .then((response) => response.json())
      .then(function (body) {
        getApproverAccounts();
        if (body["deleted"]) alert("Successfully deleted approver account.");
        else alert("Failed to delete approver account");
      });
  };

  // handling change in the value of search input field
  const handleSearchNameChange = function (e) {
    setSearchName(e.target.value);
  };

  // clear search field
  const clearSearch = function () {
    setSearchName("");
    document.getElementById("clearSearch").value = "";
  };

  // // sort list of approver accounts
  // const sortApproverList = function (e) {
  //   let sortButtons = document.getElementsByName("sortButton");
  //   sortButtons.forEach(function (element) {
  //     // add "active" class to clicked button, and remove for other buttons
  //     if (e.target.value === element.value) element.classList.add("active");
  //     else element.classList.remove("active");
  //   });
  //   console.log(e.target.value);
  //   setSort(e.target.value); // set sort to new value
  // };

  const uploadCSV = (file) => {
    const formData = new FormData();
    formData.append("csv-file", file);

    fetch("http://localhost:3001/uploadcsv", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((body) => {
        if (body["success"])
          alert("Successfully mapped students to their advisers.");
        else alert("Failed mapping of students.");
      });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDragEnter = (e) => {
    e.preventDefault();
    // Add a visual cue to indicate the drop zone
    e.currentTarget.classList.add("drag-over");
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    // Remove the visual cue when leaving the drop zone
    e.currentTarget.classList.remove("drag-over");
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
  
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target.result;
      
      uploadCSV(file);
    };
    reader.readAsText(file);
  };

  // sort list of approver accounts
  const sortApproverList = function(e) {
      console.log(e.target.value)
      setSort(e.target.value) // set sort to new value
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

  return (
    <div className='approverContent'>
        <div className='titleAndTable'>
            <div className='titleAndLightSwitch'>
                <span className='contentTitle'>Manage Approver Accounts</span>
                <IconButton onClick={colorMode.toggleColorMode}>
                        {theme.palette.mode === "light" ? (
                            <LightModeIcon/>
                        ) : (<DarkModeIcon/>)}
                </IconButton>
            </div>
            
            <div className='tableAndEditForm'>
                <div className='approverListContainer' style={{ backgroundColor: theme.palette.mode === 'dark' ? colors.primary[400] : 'white'}}>
                    <div className='sortAndSearch'>
                        <div className='sortApprover'>
                            <span className='sortLbl'>Sort Approver List:</span>
                            <div className='sortBtns' style={{ backgroundColor: theme.palette.mode === 'dark' ? colors.gray[300] : colors.gray[900] }}>
                                <div id='sbtn' style={{ backgroundColor: '#f5f4f7' }}></div>
                                <button type="button" style={{ color: 'black' }} name="sortButton" id="sortAscButton" className='active' onClick={(e) => { sortApproverList(e); leftClickSort() }} value={1}>Ascending</button>
                                <button type='button' style={{ color: 'black' }} name="sortButton" id='sortDescButton' onClick={(e) => { sortApproverList(e); rightClickSort() }} value={-1}>Descending</button>
                            </div>
                            <br/>
                        </div>
                        <div className='searchBar'>
                            <input type='text' id="searchName" name="searchName" placeholder="&#61442;" onChange={handleSearchNameChange} value={searchName}/>
                        </div>
                    </div>
                    
                    <div className='approverList'>
                        <div className='rowHeadersApprover' style={{backgroundColor: theme.palette.mode === 'dark' ? colors.primary[500] : colors.gray[900]}}>
                                <span className='indivHeaderApprover'>FULL NAME</span>
                                <span className='indivHeaderApprover'>EMAIL</span>
                        </div>

                        <div className='tableRowsApprover' style={{ backgroundColor: theme.palette.mode === 'dark' ? colors.primary[100]: '#f5f4f7'}}>
                            {approverAccounts.map((element, index) => {
                                return (
                                    <div className='rows'>
                                            <div className='column' id='fname'>
                                                <span style={{color: 'black'}}>{element.fullName} </span>
                                            </div>
                                            <div className='column' id='email'>
                                                <span style={{color: 'black'}}>{element.email} </span>
                                                {/* <div className='approveReject'>
                                                    <IconButton id='approve' style={{ backgroundColor: "transparent" }} type='button' onClick={() => {approveAccount(element._id)}}><CheckCircleIcon style={{width: '35px', height: '35px'}}/></IconButton>
                                                    <IconButton id='reject' style={{ backgroundColor: "transparent" }} type='button' onClick={() => {rejectAccount(element._id)}}><CancelIcon style={{width: '35px', height: '35px'}}/></IconButton>
                                                </div> */}
                                                <div>
                                                    <button type='button' onClick={function() {
                                                        getApproverDetails(element._id)
                                                        }}>Edit
                                                    </button>
                                                    <button type='button' onClick={function() {
                                                        deleteApprover(element._id)
                                                        }}>Delete
                                                    </button>
                                                </div>
                                            </div>
                                        {/* <p>{element.firstName} {element.middleName} {element.lastName}</p> */}
                                        
                                    </div> 
                                )
                            })}
                        </div>
                        <div className='clearSearchContainer'>
                            <button type='button' id='clearSearch' onClick={clearSearch}>Display All Approver</button>
                        </div>
                        
                    </div>
                        
                </div>

                {isEditing &&
                <form className='edit-form' style={{ backgroundColor: theme.palette.mode === 'dark' ? colors.primary[400] : 'white'}} onSubmit={editApprover}>
                    <div className="container-form">
                        <span style={{fontSize: '20px', fontWeight: 'bold'}}>Edit { editingApprover.firstName }'s Details</span>
                        <label className="inputLabel" style={{color: theme.palette.mode === 'dark' ? 'white' : 'black', fontSize: '13px'}} htmlFor="fname"><b>First Name</b></label>
                        <input id="s-fname" type="text" placeholder="Enter first name" value={editingApprover.firstName} name="fname" onChange={handleEditChange} required />

                        <label className="inputLabel" style={{color: theme.palette.mode === 'dark' ? 'white' : 'black', fontSize: '13px'}} htmlFor="mname"><b>Middle Name</b></label>
                        <input id="s-mname" type="text" placeholder="Enter middle name" value={editingApprover.middleName} name="mname" onChange={handleEditChange} required />

                        <label className="inputLabel" style={{color: theme.palette.mode === 'dark' ? 'white' : 'black', fontSize: '13px'}} htmlFor="lname"><b>Last Name</b></label>
                        <input id="s-lname" type="text" placeholder="Enter last name" value={editingApprover.lastName} name="lname" onChange={handleEditChange} required />
                        {/* <label htmlFor="email"><b>Email</b></label>
                        <input id="s-email" type="text" placeholder="Enter Email" defaultValue={approverDetails.email} name="email" required />

                        <label htmlFor="psw"><b>Password</b></label>
                        <input id="s-password" type="password" placeholder="Enter Password" defaultValue={approverDetails.password} name="psw" required /> */}

                        <div className="edit-cancel">
                            <button className="signup-back-btn" type="submit">Edit</button>
                            <button type="reset" className="cancelbtn" onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </div>
                </form>
                }
            </div>
        </div>
        
      <div className='bottom'>
        <div className='add-approver-container' style={{ backgroundColor: theme.palette.mode === 'dark' ? colors.primary[400] : 'white'}}>
            <form onSubmit={signUp} id="create-form">
                <span style={{fontSize: '20px', fontWeight: 'bold'}}>Add New Approver</span>
                    <div className="bottom-container-form">
                        <div className='formCols'>
                            <div className='firstCol'>
                                <label style={{color: theme.palette.mode === 'dark' ? 'white' : 'black', fontSize: '13px'}} htmlFor="fname"><b>First Name</b></label>
                                <input className='field' id="s-fname" type="text" placeholder="Enter first name" name="fname" required />

                                <label style={{color: theme.palette.mode === 'dark' ? 'white' : 'black', fontSize: '13px'}} htmlFor="mname"><b>Middle Name</b></label>
                                <input className='field' id="s-mname" type="text" placeholder="Enter middle name" name="mname" required />
                            </div>

                            <div className='secondCol'>
                                <label style={{color: theme.palette.mode === 'dark' ? 'white' : 'black', fontSize: '13px'}} htmlFor="lname"><b>Last Name</b></label>
                                <input className='field' id="s-lname" type="text" placeholder="Enter last name" name="lname" required />

                                <label style={{color: theme.palette.mode === 'dark' ? 'white' : 'black', fontSize: '13px'}} htmlFor="email"><b>Email</b></label>
                                <input className='field' id="s-email" type="text" placeholder="Enter Email" name="email" required />
                            </div>

                            <div className='thirdCol'>
                                <label style={{color: theme.palette.mode === 'dark' ? 'white' : 'black', fontSize: '13px'}} htmlFor="psw"><b>Password</b></label>
                                <input className='field' id="s-password" type="password" placeholder="Enter Password" name="psw" required />
                            </div>
                        </div>

                        <div className="submit-cancel">
                            <button className="signup-back-btn" type="submit">Submit</button>
                            <button type="reset" className="resetbtn">Reset</button>
                        </div>
                    </div>
                </form>
        </div>
        <div className='csv-container' style={{ backgroundColor: theme.palette.mode === 'dark' ? colors.primary[400] : 'white' }}>
          <div className='csv-content'>
            <h3>Upload CSV File</h3>
            <p style={{wordWrap: 'break-word'}}>Upload a CSV file to automatically map students to their adviser. The CSV file must contain the student number and the name of the adviser.</p>
            <p>Follow this format:</p>
            <br />
            <form onClick={() => document.querySelector(".input-field").click()} onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} style={{cursor: 'pointer'}}>
              <div className='graphics'>
                <UploadRoundedIcon style={{ width: '40px', height: '40px', alignSelf: 'center' }} />
                <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Click to upload</span>
                <p>or Drag and Drop to upload your CSV file</p>
              </div>
              
              {/* <form encType="multipart/form-data" onSubmit={uploadCSV}>  */}
              <input
                className='input-field'
                name="csv-file"
                type="file"
                accept="text/csv"
                onChange={handleFile}
                hidden
              />
            </form>
          </div>
        </div>
      </div>
          
        </div>
  )
}
