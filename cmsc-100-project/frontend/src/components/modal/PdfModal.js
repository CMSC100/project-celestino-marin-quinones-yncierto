import React from "react";
import { Page, Text, View, Document, StyleSheet, PDFViewer, PDFDownloadLink, Line, Svg, Font} from '@react-pdf/renderer';
import { printPlugin } from '@react-pdf-viewer/print';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import { Button, Spinner, Viewer } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/print/lib/styles/index.css';
import './Modal.css'

export default function PdfModal ({ setpdfModal }) {
  let fName = "Juan"
  let mName = "Santos"
  let lName = "Dela Cruz"
  let applicationDetails = {
    studName: `${fName} ${mName} ${lName}`,
    studNo: "2021-07177",
    acadAdviserName: "Reginald Recario",
    clearanceOfficer: "Katherine Tan",
    currDate: `${new Date().toLocaleDateString()}`
  }

  const customProgressBar = (numLoadedPages, numPages) => (
    <div>
      <div>
        Preparing pages...
      </div>
      <div>
        <Spinner />
      </div>
      <Button onClick={() => {}}>Cancel</Button>
    </div>
  )

  // const printPluginInstance = printPlugin()
  // const { PrintButton } = printPluginInstance

  return (
    <div className="pdfmodalBackground">
      <div className="pdfmodalContainer">
        {pdfViewer(applicationDetails)}
        {/* <PrintButton />
        <Viewer fileUrl="./sample.pdf" plugins={[printPluginInstance]}/> */}
        <div className="footer">
          <button onClick={() => { setpdfModal(false); }} id="cancelBtn"> 
            Cancel 
          </button>
          {pdfDownload(applicationDetails, lName)}
          {/* <button type="button" onClick={
            print
          }>Print</button> */}
        </div>
      </div>
    </div>
  )
}

function pdfViewer(applicationDetails) {
  return (
    <PDFViewer className="pdf-file">
      <PDFReactPDF applicationDetails={applicationDetails}/>
    </PDFViewer>
  )
}

function pdfDownload(applicationDetails, lName) {
  <PDFDownloadLink document={<PDFReactPDF applicationDetails={applicationDetails}/>} fileName={`ApplicationClearance_${lName}.pdf`}>
    {({ blob, url, loading, error }) =>
      loading
        ? "" 
        : <button type="button">Download</button>
    }
  </PDFDownloadLink>
}

function PDFReactPDF(props) {
  Font.register({family: "Times-Roman", src: "source"})
  let { studName, studNo, acadAdviserName, clearanceOfficer, currDate } = props.applicationDetails
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