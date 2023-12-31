const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    studentID: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        enum: ["Male", "Female"],
        default: "Male"
    },
    phone: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        required: true
    },
    majorName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'major',
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },
    role: {
        type: String,
        default: "Student"
    },
    examResult: [
        {
            projectName: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'project',
            },
            marksObtained: {
                type: Number,
                default: 0
            }
        }
    ],
    attendance: [{
        date: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['Present', 'Absent'],
            required: true
        },
        projectName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'project',
            required: true
        }
    }]
});

module.exports = mongoose.model("student", studentSchema);