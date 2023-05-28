import mongoose from "mongoose";

const Application = mongoose.model("Application");

const createApplication = async (req, res) => {
  const {studentID, adviserID} = req.body;
    try {
      let checkForOpen = await Application.find({studentID, status:"open"})

      if (checkForOpen.length >= 1) {
        res.send({hasOpen: true})
        return;
      }
      
      const newApplication = new Application({
          status: "open",
          step: 1,
          remarks: [],
          studentSubmission: [],
          studentID: studentID,
          adviserID: adviserID
      });
      const savedApplication = await newApplication.save();
      res.status(200).json(savedApplication);
        
    } catch (error) {
        res.status(500).json(error);
    }
}

const getApplications = async (req, res) => {
  const { studentID, adviserID, search } = req.query;
  console.log(studentID)
  try {
    var applications;
    if (studentID) applications = await Application.find({ studentID });
    else if (adviserID && search == "") {
      applications = await Application.find(
        {$and: [
          {adviserID}, 
          {$or: [{status: "pending"}, {status: "cleared"}]}
        ]}
      )
      }
    // } else {
    //   applications = await Application.find(
    //     {$and: [
    //       {adviserID}, 
    //       {$or: [{status: "pending"}, {status: "cleared"}]}, 
    //       {$or: [{fullName: `${search}`}, {studentNumber: `${search}`}]}
    //     ]}
    //   )
    // }
    console.log(applications)
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

const submitApplication = async (req, res) => {
  const { appID, githubLink } = req.body;
  try {
    const application = await Application.findById(appID);

    if (!application) {
      res.status(404).json({ error: "Application not found" });
      return;
    }

    application.studentSubmission.push({
      githubLink,
      createdAt: new Date(),
      remarks: [],
    });

    const savedApplication = await application.save();
    res.status(200).json(savedApplication);
  } catch (error) {
    res.status(500).json(error);
  }
};


export { createApplication, getApplications, closeApplication, submitApplication }