'use strict';

const issueModel = require('../models').Issue;
const projectModel = require('../models').Project;

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let projectName = req.params.project;
      
      const {
        _id,
        open,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text
      } = req.query;

      projectModel.aggregate([
        { $match: { name: projectName } },
        { $unwind: "$issues" },
        _id != undefined
          ? { $match: { "issues._id": ObjectId(_id) } }
          : { $match: {} },
        open != undefined
          ? { $match: { "issues.open": open } }
          : { $match: {} },
        issue_title != undefined
          ? { $match: { "issues.issue_title": issue_title } }
          : { $match: {} },
        issue_text != undefined
          ? { $match: { "issues.issue_text": issue_text } }
          : { $match: {} },
        created_by != undefined
          ? { $match: { "issues.created_by": created_by } }
          : { $match: {} },
        assigned_to != undefined
          ? { $match: { "issues.assigned_to": assigned_to } }
          : { $match: {} },
        status_text != undefined
          ? { $match: { "issues.status_text": status_text } }
          : { $match: {} }
      ]).exec((err, data) => {
        if(!data) {
          res.json([]);
        } else {
          let mappedData = data.map((item) => item.issues);
          res.json(mappedData);
          // res.json(data);
        }
      });
    })
    
    .post(function (req, res){
      let project = req.params.project;

      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text
      } = req.body;

      if(!issue_title || !issue_text || !created_by) {
        res.json({ error: 'required field(s) missing' });
        return;
      }

      const newIssue = new issueModel({
        issue_title: issue_title || "",
        issue_text: issue_text || "",
        created_on: new Date(),
        updated_on: new Date(),
        created_by: created_by || "",
        assigned_to: assigned_to || "",
        open: true,
        status_text: status_text || ""
      });

      projectModel.findOne({ name: project }, (err, projectData) => {
        if(!projectData) {
          const newProject = new projectModel({ name: project });
          newProject.issues.push(newIssue);
          newProject.save((err, data) => {
            if(err || !data) {
              res.send('There was an error saving the issue');
            } else {
              res.json(newIssue);
            }
          });
        } else {
          projectData.issues.push(newIssue);
          projectData.save((err, data) => {
            if(err || !data) {
              res.send('There was an error saving the new issue');
            } else {
              res.json(newIssue);
            }
          });
        }
      });
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
