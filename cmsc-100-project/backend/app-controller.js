import mongoose from "mongoose";

const Application = mongoose.model("Application", {
    status: { type: String, required: true },
    step: { type: Number, required: true },
    remarks: { type: Array },
    studentSubmission: {type: Array },
    studentID: {type: mongoose.Schema.ObjectId}
})

const createApplication = async (req, res) => {
    console.log(req.body.name)
    let commenter = "random id"
    let status = "Open"
    let step = 1
    let github = "www.github.com"
    let studentID = "646dc796a6f98e63e66f1699"
    let remarks = [
        {
            remark: "lmao",
            date: new Date().toLocaleDateString(),
            commenter: commenter,
            stepGiven: step
        }
    ]
    let studentSubmission = [
        {
            remarkLink: github,
            date: new Date().toLocaleDateString(),
            stepGiven: step
        }
    ]
    const newApplication = new Application({
        status: status,
        step: step,
        remarks: remarks,
        studentSubmission: new mongoose.Types.ObjectId(studentID),
        studentID: studentID
    })

    const result = await newApplication.save();

    if (result._id) res.send({success: true})
    else res.send({success: false})
}

export { createApplication }