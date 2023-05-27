import React from "react";
import './Modal.css'

export default function StudentProfile ({setProfileModal, userData}) {

  return(
    <div className="profile-bg">
      <div className="profile-container">
        <div className='image-text'>
          <span className='image'>
              <img src= {require("./aprub.png")} alt=""/>
          </span>

          <div className='text header-text'>
              {/* dapat dito yung fullname ng nag log in*/}
              <span className='name'>{userData.fullName}</span>
              {/* dito yung type ng user */}
              <span className='usertype'>{userData.userType}</span>
          </div>
        </div>
        <div>
          {/* student number, email, adviser, application id(?) */}
        </div>
        <button onClick={() => { setProfileModal(false); }} id="cancelBtn"> Close </button>
      </div>

    </div>
  )
}