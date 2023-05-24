import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
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
    }
});

mongoose.model("Application", ApplicationSchema);