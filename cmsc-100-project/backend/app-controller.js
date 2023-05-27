import mongoose from "mongoose";

const Application = mongoose.model("Application");

const createApplication = async (req, res) => {
  const {studentID} = req.body;
    try {
      let checkForOpen = await Application.find({studentID, status:"open"})

      if (checkForOpen.length >= 1) {
        res.send({hasOpen: true})
        return;
      }
      
      const newApplication = new Application({
          status: "open",
          step: 0,
          remarks: [],
          studentSubmission: [],
          studentID: req.body.studentID
      });
      const savedApplication = await newApplication.save();
      res.status(200).json(savedApplication);
        
    } catch (error) {
        res.status(500).json(error);
    }
}

const getApplications = async (req, res) => {
  const { studentID } = req.query;
  try {
      const applications = await Application.find({ studentID });
      res.status(200).json(applications);
    } catch (error) {
      res.status(500).json(error);
    }
  };
  
const closeApplication = async (req, res) => {
  const {appID} = req.body;
  try {
    const update = await Application.updateOne({_id: appID}, {$set: {status: "closed"}})
    if (update["acknowledged"] && update["modifiedCount"] != 0) res.status(200).json({close: true})
    else res.status(500).json({close: false})
  } catch (error) {
    res.status(500).json(error)
  }
}


export { createApplication, getApplications, closeApplication }