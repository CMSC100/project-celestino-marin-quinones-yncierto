import React, {useState, useEffect} from "react";
import { Page, Text, View, Document, StyleSheet, PDFViewer, Line, Svg, Font} from '@react-pdf/renderer';
import './Modal.css'

export default function PdfModal ({ setpdfModal }) {

  const [userData, setUserData] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  const fetchUserData = async () => {
    try {
      // Fetch user data
      const response = await fetch("http://localhost:3001/getloggedinuserdata", {
        method: "POST",
        credentials: "include",
      });
  
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        return true
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    const initialFetch = async() => {
      let result = await fetchUserData();
      if (result) {
        setDataLoaded(true)
      }
    }

    initialFetch()
  }, [])

  // view pdf
const pdfViewer = (applicationDetails) => {
  return (
    <PDFViewer className="pdf-file">
      <PDFReactPDF applicationDetails={applicationDetails}/>
    </PDFViewer>
  )
}

const PDFReactPDF = (props) => {
  Font.register({family: "Times-Roman", src: "source"}) // register font
  // get details from props
  let { studName, studNo, acadAdviserName, clearanceOfficer, currDate } = props.applicationDetails
  // stylesheet
  const styles = StyleSheet.create({
    document: {
      flexDirection: 'column',
      alignContent: "flex-start",
      justifyContent: "center",
      alignItems: "flex-start",
      fontFamily: "Times-Roman"
    },
    page: {
      flexDirection: 'column',
      paddingTop: "1in",
      paddingBottom: "1in",
      paddingLeft: "1in",
      paddingRight: "1in",
      width: "100%",
      rowGap: 30
    },
    header: {
     flexDirection: "column",
     alignItems: "center",
     rowGap: 10
    },
    title: {
      fontSize: 24
    },
    subtitle: {
      fontSize: 18
    },
    text: {
      fontSize: 16
    },
    horizontalLine: {
      borderWidth: 0.5,
      borderColor: "black",
      margin: 10
    }
  });

  return(
    <Document style={styles.document}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>University of the Philippines</Text>
          </View>
          <View style={{alignItems: "center", rowGap: 5}}>
            <Text style={styles.subtitle}>College of Arts and Sciences</Text>
            <Text style={styles.subtitle}>Institute of Computer Science</Text>
          </View>
        </View>
        <Svg height="1" width="100%">
          <Line
            x1="0"
            y1="0"
            x2="500"
            y2="0"
            strokeWidth={1}
            stroke="black"
          />
        </Svg>
        <View>
          <Text style={styles.text}>{currDate}</Text>
        </View>
        <View>
          <Text style={styles.text}>This document certifies that {studName}, {studNo}, has satisfied the clearance requirements of the institute.</Text>
        </View>
        <View style={{rowGap: 15}}>
          <View>
            <Text style={styles.text}>Verified:</Text>
          </View>
          <View style={{rowGap: 5}}>
            <Text style={styles.text}>Academic Adviser: {acadAdviserName}</Text>
            <Text style={styles.text}>Clearance Officer: {clearanceOfficer}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

// Check if user data is loaded
if (!dataLoaded) {
  return null;
}

// Extract user data
const { fullName, studentID, adviser } = userData;
const nameParts = fullName ? fullName.split(" ") : [];
const fName = nameParts[0] || "";
const mName = nameParts[1] || "";
const lName = nameParts.slice(2).join(" ") || "";

// Prepare application details
const applicationDetails = {
  studName: `${fName} ${mName} ${lName}`,
  studNo: studentID,
  acadAdviserName: adviser || "",
  clearanceOfficer: "Katherine Tan",
  currDate: new Date().toLocaleDateString()
};

return (
  <div className="pdfmodalBackground">
    <div className="pdfmodalContainer">
      {pdfViewer(applicationDetails)}
      <div className="footer">
        <button onClick={() => { setpdfModal(false); }} id="cancelBtn">
          Cancel
        </button>
      </div>
    </div>
  </div>
);
}