import React from "react";
import { Page, Text, View, Document, StyleSheet, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import './Modal.css'

export default function PdfModal ({ setpdfModal }) {
  let applicationDetails = {
    studName: "Sean Joseph C. Marin",
    studNo: "2021-07177",
    acadAdviserName: "Reginald Recario",
    clearanceOfficer: "Katherine Tan",
    currDate: `${new Date().toLocaleDateString()}`
  }

  return (
    <div className="pdfmodalBackground">
      <div className="pdfmodalContainer">
        <PDFViewer className="pdf-file" showToolbar={false}>
          <PDFReactPDF applicationDetails={applicationDetails}/>
        </PDFViewer>
        <div className="footer">
          <button onClick={() => { setpdfModal(false); }} id="cancelBtn"> 
            Cancel 
          </button>
          <PDFDownloadLink document={<PDFReactPDF applicationDetails={applicationDetails}/>} fileName="example.pdf">
              {({ blob, url, loading, error }) =>
                loading
                  ? "" 
                  : <button type="button">Button</button>
              }
            </PDFDownloadLink>
        </div>
      </div>
    </div>
  )
}

function PDFReactPDF(props) {
  let { studName, studNo, acadAdviserName, clearanceOfficer, currDate } = props.applicationDetails
  const styles = StyleSheet.create({
    document: {
      flexDirection: 'column',
      alignContent: "flex-start",
      justifyContent: "center",
      alignItems: "flex-start",
    },
    page: {
      flexDirection: 'column',
      backgroundColor: '#E4E4E4',
      alignItems: "center",
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1
    },
    title: {
      fontSize: 22
    },
    subtitle: {
      fontSize: 16
    },
    text: {
      fontSize: 14
    },
  });

  return(
    <Document style={styles.document}>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.title}>University of the Philippines</Text>
        </View>
        <View>
          <Text style={styles.subtitle}>College of Arts and Sciences</Text>
          <Text style={styles.subtitle}>Institute of Computer Science</Text>
        </View>
        <View>
          <Text style={styles.text}>{currDate}</Text>
        </View>
        <View>
          <Text style={styles.text}>This document certifies that {studName}, {studNo} has satisfied the clearance requirements of the institute.</Text>
        </View>
        <View>
          <Text style={styles.text}>Verified:</Text>
        </View>
        <View>
          <Text style={styles.text}>Academic Adviser: {acadAdviserName}</Text>
          <Text style={styles.text}>Clearance Officer: {clearanceOfficer}</Text>
        </View>
      </Page>
    </Document>
  )
}