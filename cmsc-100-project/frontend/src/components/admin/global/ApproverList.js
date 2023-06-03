import { useState, useEffect } from "react";
import "./ApproverList.css";

export default function Admin(props) {
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

  // sort list of approver accounts
  const sortApproverList = function (e) {
    let sortButtons = document.getElementsByName("sortButton");
    sortButtons.forEach(function (element) {
      // add "active" class to clicked button, and remove for other buttons
      if (e.target.value === element.value) element.classList.add("active");
      else element.classList.remove("active");
    });
    console.log(e.target.value);
    setSort(e.target.value); // set sort to new value
  };

  const uploadCSV = (e) => {
    const formData = new FormData();
    formData.append("csv-file", e.target.files[0]);

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

  return (
    <>
      <h3>Upload CSV File</h3>
      {/* <form encType="multipart/form-data" onSubmit={uploadCSV}>  */}
      <input
        name="csv-file"
        type="file"
        accept="text/csv"
        onChange={uploadCSV}
      />
      <br />
      {/* <button type='submit'>Submit CSV</button> */}
      {/* </form> */}
      <span>Sort Approver List:</span>
      <button
        type="button"
        name="sortButton"
        id="sortAscButton"
        className="active"
        onClick={sortApproverList}
        value={1}
      >
        Ascending
      </button>
      <button
        type="button"
        name="sortButton"
        id="sortDescButton"
        onClick={sortApproverList}
        value={-1}
      >
        Descending
      </button>
      <br />

      <label htmlFor="searchName">Search for Approver: </label>
      <input
        type="text"
        id="searchName"
        name="searchName"
        placeholder="Enter name of approver"
        onChange={handleSearchNameChange}
        value={searchName}
      />
      <button type="button" id="clearSearch" onClick={clearSearch}>
        Display All Approver
      </button>

      <ul>
        {approverAccounts.map((element, index) => {
          return (
            <li key={index}>
              <p>
                {element.firstName} {element.middleName} {element.lastName}
              </p>
              <button
                type="button"
                onClick={function () {
                  getApproverDetails(element._id);
                }}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={function () {
                  deleteApprover(element._id);
                }}
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>

      {isEditing && (
        <form onSubmit={editApprover}>
          <div className="container-form">
            <label htmlFor="fname">
              <b>First Name</b>
            </label>
            <input
              id="s-fname"
              type="text"
              placeholder="Enter first name"
              value={editingApprover.firstName}
              name="fname"
              onChange={handleEditChange}
              required
            />

            <label htmlFor="mname">
              <b>Middle Name</b>
            </label>
            <input
              id="s-mname"
              type="text"
              placeholder="Enter middle name"
              value={editingApprover.middleName}
              name="mname"
              onChange={handleEditChange}
              required
            />

            <label htmlFor="lname">
              <b>Last Name</b>
            </label>
            <input
              id="s-lname"
              type="text"
              placeholder="Enter last name"
              value={editingApprover.lastName}
              name="lname"
              onChange={handleEditChange}
              required
            />
            {/* <label htmlFor="email"><b>Email</b></label>
                        <input id="s-email" type="text" placeholder="Enter Email" defaultValue={approverDetails.email} name="email" required />

                        <label htmlFor="psw"><b>Password</b></label>
                        <input id="s-password" type="password" placeholder="Enter Password" defaultValue={approverDetails.password} name="psw" required /> */}

            <div className="signup-back-btn">
              <button className="signup-back-btn" type="submit">
                Edit
              </button>
              <button
                type="reset"
                className="cancelbtn"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <form onSubmit={signUp} id="create-form">
        <div className="container-form">
          <label htmlFor="fname">
            <b>First Name</b>
          </label>
          <input
            id="s-fname"
            type="text"
            placeholder="Enter first name"
            name="fname"
            required
          />

          <label htmlFor="mname">
            <b>Middle Name</b>
          </label>
          <input
            id="s-mname"
            type="text"
            placeholder="Enter middle name"
            name="mname"
            required
          />

          <label htmlFor="lname">
            <b>Last Name</b>
          </label>
          <input
            id="s-lname"
            type="text"
            placeholder="Enter last name"
            name="lname"
            required
          />

          <label htmlFor="email">
            <b>Email</b>
          </label>
          <input
            id="s-email"
            type="text"
            placeholder="Enter Email"
            name="email"
            required
          />

          <label htmlFor="psw">
            <b>Password</b>
          </label>
          <input
            id="s-password"
            type="password"
            placeholder="Enter Password"
            name="psw"
            required
          />

          <div className="signup-back-btn">
            <button className="signup-back-btn" type="submit">
              Submit
            </button>
            <button type="reset" className="cancelbtn">
              Reset
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
