import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
    status: { type: String, required: true },
    step: {type: Number, required: true},
    remarks: [{
        remark: {type: String, required: true},
        date: {type: Date, default: Date.now},
        commenter: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required : true},
    }],
    studentSubmission: {
        githubLink: {type: String},
        remarks: [{
            remark: {type: String, required: true},
            date: {type: Date, default: Date.now},
            stepGiven: {type: Number}
        }]
    },
    studentID: { type: mongoose.Schema.Types.ObjectId }
});

mongoose.model("Application", ApplicationSchema);