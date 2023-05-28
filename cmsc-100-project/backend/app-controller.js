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
      ])
    }

    // applications = await Application.find({ $where: function() {
    //   console.log(this.adviserID == new mongoose.Types.ObjectId(adviserID))
    //   return (
    //     this.adviserID == new mongoose.Types.ObjectId(adviserID) &&
    //     (this.status == "pending") || (this.status == "cleared") &&
    //     ((search != "" 
    //       ? User.find({$and: [
    //         {_id: application.studentID},
    //         {
    //           $or: [
    //             {fullName: {$regex: new RegExp(`${search}`, "gi")}},
    //             {studentNumber: {$regex: new RegExp(`${search}`, "gi")}},
    //           ]
    //         }
    //       ]})
    //       : true
    //     ))
        
    //   )
    // }})
      
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