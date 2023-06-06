import { IconButton, Typography, useTheme } from '@mui/material';
import { tokens } from "../../theme"
import '../../theme.js'
import React, { useEffect, useState } from "react";
import "./Modal.css";

export default function StudentProfile({ setProfileModalOpen, userData }) {
  const [adviserName, setAdviserName] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    fetch(`http://localhost:3001/getapproverdetails?docRef=${userData.adviser}`)
      .then((response) => response.json())
      .then((body) => setAdviserName(body.fullName));
  }, []);

  return (
    <div className="profile-bg">
      <div className="profile-container" style={{backgroundColor: theme.palette.mode === 'dark' ? colors.primary[500] : '#f5f4f7'}}>
        <div className="image-text">
          <span className="image">
            <img src={theme.palette.mode==='dark' ? require('../logo-white.png') : require('../logo.png')} alt="" />
          </span>

          <div className="text header-text">
            {/* dapat dito yung fullname ng nag log in*/}
            <span className="name">{userData.fullName}</span>
            {/* dito yung type ng user */}
            <span className="usertype" style={{color: theme.palette.mode==='dark'? 'white' : 'black'}}>{userData.userType}</span>
          </div>
        </div>
        <div className="profile-info">
          {/* student number, email, adviser, application id(?) */}
          <p>
            <strong>Student number: </strong>
            {userData.studentNumber}
          </p>
          <p>
            <strong>Email: </strong>
            {userData.email}
          </p>
          <p>
            <strong>Adviser: </strong>{" "}
            {adviserName ? adviserName : "No adviser assigned."}
          </p>
          <p>
            <strong>Application ID: </strong>
            {userData._id}
          </p>
        </div>
        <button
          onClick={() => {
            setProfileModalOpen(false);
          }}
          id="cancelBtn"
        >
          {" "}
          Close{" "}
        </button>
      </div>
    </div>
  );
}
