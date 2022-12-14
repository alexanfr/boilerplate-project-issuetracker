const mongoose = require('mongoose');
const { Schema } = mongoose;

const issueSchema = new Schema ({
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_on: Date,
    updated_on: Date,
    created_by: { type: String, required: true },
    assigned_to: { type: String, required: false },
    open: Boolean,
    status_text: { type: String, required: false }
});

const Issue = mongoose.model('Issue', issueSchema);

const projectSchema = new Schema ({
    name: { type: String, required: true },
    issues: [issueSchema]
});

const Project = mongoose.model('Project', projectSchema);

exports.Issue = Issue;
exports.Project = Project;
