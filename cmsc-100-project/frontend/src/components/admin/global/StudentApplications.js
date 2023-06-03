import { useEffect, useState } from "react";

export default function StudentApplications() {
  const [userData, setUserData] = useState({});
  const [pendingAccounts, setPendingAccounts] = useState([]);
  const [sort, setSort] = useState("fullName");
  const [showDisplay, setShowDisplay] = useState("pending accounts");
  const [students, setStudents] = useState([]);
  const [studentIDAssign, setStudentIDAssign] = useState(0);
  const [advisers, setAdvisers] = useState([]);

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

  const rejectAccount = function (docRef) {
    fetch("http://localhost:3001/rejectaccount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ docRef: docRef }),
    })
      .then((response) => response.json())
      .then((body) => {
        if (body["deleted"]) {
          getPendingAccounts();
          alert("User account has been rejected.");
        } else {
          alert("Failed to reject user account.");
        }
      });
  };

  const changeActiveButton = (e) => {
    let names = document.getElementsByName(e.target.name);
    names.forEach((element) => {
      element.classList.remove("active");
    });
    e.target.classList.add("active");
  };

  const getStudents = function () {
    fetch(`http://localhost:3001/getstudents?sort=${sort}`)
      .then((response) => response.json())
      .then((body) => setStudents(body));
  };

  const getAdvisers = function () {
    fetch("http://localhost:3001/getadvisers")
      .then((response) => response.json())
      .then((body) => setAdvisers(body));
  };

  const assignAdviser = function (adviserIDAssign) {
    // Check if the student already has an adviser
    const student = students.find((student) => student._id === studentIDAssign);
    if (student.adviser) {
      alert("The student already has an adviser.");
      return;
    }

    fetch("http://localhost:3001/assignadviser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentIDAssign, adviserIDAssign }),
    })
      .then((response) => response.json())
      .then((body) => {
        if (body["success"]) {
          alert("Adviser successfully assigned to student.");
        } else {
          alert("Failed adviser assignment.");
        }
      });
  };

  return (
    <div>
      <button
        type="button"
        name="display-buttons"
        className="active"
        onClick={(e) => {
          changeActiveButton(e);
          changeDisplay("pending accounts");
        }}
      >
        View Pending Accounts
      </button>

      <button
        type="button"
        name="display-buttons"
        onClick={(e) => {
          changeActiveButton(e);
          changeDisplay("students");
        }}
      >
        View Students
      </button>
      {showDisplay === "pending accounts" && (
        <div>
          Sort By:
          <button
            type="button"
            name="sort-buttons"
            className="active"
            onClick={(e) => {
              changeActiveButton(e);
              changeSort("fullName");
            }}
          >
            Full Name
          </button>
          <button
            type="button"
            name="sort-buttons"
            onClick={(e) => {
              changeActiveButton(e);
              changeSort("studentNumber");
            }}
          >
            Student Number
          </button>
          <div style={{ display: "flex", flexDirection: "column", rowGap: 20 }}>
            {pendingAccounts.map(function (element, index) {
              return (
                <div key={index} style={{ backgroundColor: "gainsboro" }}>
                  <span>
                    {element.fullName} {element.studentNumber} {element.email}
                  </span>

                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        approveAccount(element._id);
                      }}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        rejectAccount(element._id);
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {showDisplay === "students" && (
        <div style={{ display: "flex", columnGap: 10 }}>
          <div style={{ display: "flex", flexDirection: "column", rowGap: 20 }}>
            {students.map(function (element, index) {
              return (
                <div key={index} style={{ backgroundColor: "lightgray" }}>
                  <span>
                    {element.fullName} {element.studentNumber} {element.email}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      document.getElementById("modal").style.display = "block";
                      setStudentIDAssign(element._id);
                    }}
                  >
                    Assign Adviser
                  </button>
                </div>
              );
            })}
          </div>
          <div
            id="modal"
            style={{
              display: "none",
              position: "abosolue",
              width: 500,
              height: 500,
              flexDirection: "column",
              rowGap: 10,
            }}
          >
            <div>
              {advisers.map((element, index) => {
                return (
                  <div style={{ backgroundColor: "lightgray" }} key={index}>
                    {element.fullName}
                    <button
                      type="button"
                      onClick={() => assignAdviser(element._id)}
                    >
                      Assign
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
