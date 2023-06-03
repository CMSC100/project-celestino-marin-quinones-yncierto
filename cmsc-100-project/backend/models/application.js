import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
    status: { type: String, required: true },
    step: {type: Number, required: true},
    remarks: [{
        remark: {type: String, required: true},
        date: {type: Date, default: Date.now},
        commenter: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required : true},
    }],
    studentSubmission: [{
        githubLink: {type: String},
        createdAt: { type: Date, default: Date.now },
    }],
    studentID: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required : true},
    adviserID: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required : true},
    createdAt: { type: Date, default: Date.now },
    isReturned: { type: Boolean, default: false },
});

mongoose.model("Application", ApplicationSchema);