const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    projectName: {
        type: String,
        required: true,
    },
    projectCode: {
        type: String,
        required: true,
        unique:true,
    },
    sessions: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        require: true,
    },
    majorName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'major',
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher',
    },
    startDate: {
        type: Date,
        default: Date.now
      },
    endDate: {
        type: Date,
        default: Date.now,
        validate: {
            validator: function (value) {
            return value >= this.startDate;
            },
            message: 'Time end must greater than or equal time start'
        }
    },
    students: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'student',
        },
        
    }],
    submissions: [{
        filePath: {
            type: String,
            default: "",
        },
        submissionDate: {
            type: Date,
            default: Date.now,
        },
    }]

}, { timestamps: true });

module.exports = mongoose.model("project", projectSchema);