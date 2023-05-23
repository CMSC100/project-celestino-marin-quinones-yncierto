import { useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from "react";
import ApplicationModal from "../modal/ApplicationModal";
import PdfModal from "../modal/PdfModal"
import Cookies from 'universal-cookie';

export default function StudentHomepage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [pdfmodalOpen, setpdfModalOpen] = useState(false)
  const [userData, setUserData] = useState({})

  // fetch user data based from credentials and set userData state
  useEffect(() => {
    fetch("http://localhost:3001/getloggedinuserdata", {
      method: "POST",
      credentials: "include"
    })
      .then(response => response.json())
      .then(body => setUserData(body))
  }, [])

  return (
    <div className="student-homepage">
      {modalOpen && <ApplicationModal setOpenModal={setModalOpen} />}
      {pdfmodalOpen && <PdfModal setpdfModal={setpdfModalOpen} />}

      <p>Lorem Ipsum</p>
      <h1>P is for Papa, it's a Papas Parteh!!!</h1>
      <h2>filler langzxc</h2>
      Sample User Data:
      {JSON.stringify(userData)}
    </div>
  )
}