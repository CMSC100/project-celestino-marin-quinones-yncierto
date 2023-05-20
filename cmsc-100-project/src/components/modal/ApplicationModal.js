import React from "react";
import './Modal.css'

export default function ApplicationModal ({ setOpenModal }) {
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <label for="repo" ><b>Link to GitHub repository</b></label>
        <input type="text" placeholder="https://github.com/..." name="repo" required />
        <div className="footer"><button onClick={() => { setOpenModal(false); }} id="cancelBtn"> Cancel </button>
          <button>Submit</button>
        </div>
      </div>
    </div>
  )
}