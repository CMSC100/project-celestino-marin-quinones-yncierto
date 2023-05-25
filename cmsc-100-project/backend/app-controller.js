import mongoose from "mongoose";

const Application = mongoose.model("Application");

const createApplication = async (req, res) => {
    try {
        const newApplication = new Application({
            status: "pending",
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
    try {
      const { studentID } = req.body;
      const applications = await Application.find({ studentID });
      res.status(200).json(applications);
    } catch (error) {
      res.status(500).json(error);
    }
  };
  


export { createApplication, getApplications }