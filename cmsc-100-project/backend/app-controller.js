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
  const { studentID, adviserID, search, filter, filterValue, sort } = req.query;
  console.log()
  let sortBy = (sort === "date") ? {createdAt: -1} : (sort === "nameA") ? {"studentData.0.fullName": 1} : {"studentData.0.fullName": -1}
  try {
    var applications;
    if (studentID) applications = await Application.find({ studentID });
    else {
      applications = await Application.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "studentID",
            foreignField: "_id",
            as: "studentData"
          }
        },
        {
          $match: {
            $and: [
              {step: {$ne: 1}},
              {adviserID: new mongoose.Types.ObjectId(adviserID)},
              {
                $or: [
                  {"studentData.0.fullName": {$regex: new RegExp(`${search}`, "gi")}},
                  {"studentData.0.studentNumber": {$regex: new RegExp(`${search}`, "gi")}}
                ]
              }
            ]

          }
        }
      ]).collation({locale: "en"}).sort(sortBy)
    }
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
  const { appID, githubLink, status } = req.body;
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

    application.status = status;

    const savedApplication = await application.save();
    res.status(200).json(savedApplication);
  } catch (error) {
    res.status(500).json(error);
  }
};

const approveApplication = async(req, res) => {
  const {appID} = req.body
  let update = await Application.updateOne({_id: appID}, {$set: {step: "3"}})

  if (update["acknowledged"] && update["modifiedCount"] != 0) res.send({updated: true})
  else res.send({updated: false})
}


export { createApplication, getApplications, closeApplication, submitApplication, approveApplication }