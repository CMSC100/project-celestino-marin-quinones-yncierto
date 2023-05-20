import React from "react";
import './Modal.css'

export default function PdfModal ({ setpdfModal }) {
  return (
    <div className="pdfmodalBackground">
      <div className="pdfmodalContainer">
        <div className="pdf-file">
          <h1>PDF to print</h1>
        </div>
        <div className="footer"><button onClick={() => { setpdfModal(false); }} id="cancelBtn"> Cancel </button>
          <button>Print</button>
        </div>
      </div>
    </div>
  )
}