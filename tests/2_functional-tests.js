const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const e = require('express');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  suite('POST Request Tests', function() {
    this.timeout(600000);
    test('Create an issue - Complete Fields', function (done) {
        chai
            .request(server)
            .post('/api/issues/projects')
            .set('content-type', 'application/json')
            .send({
                issue_title: 'Issue #1',
                issue_text: 'Fix error in sending data',
                created_by: 'alex',
                assigned_to: 'andre',
                status_text: 'ongoing'   
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                issueID = res.body._id;
                assert.equal(res.body.issue_title, 'Issue #1');
                assert.equal(res.body.issue_text, 'Fix error in sending data');
                assert.equal(res.body.created_by, 'alex');
                assert.equal(res.body.assigned_to, 'andre');
                assert.equal(res.body.status_text, 'ongoing');
                setTimeout(done, 300000);
            });
    }); //Test #1

    //Create an issue with only required fields: POST request to /api/issues/{project}
    test('Create an issue with only required fields', function(done) {
        chai
            .request(server)
            .post('/api/issues/projects')
            .set('content-type', 'application/json')
            .send({
                issue_title: 'Issue #2',
                issue_text: 'Fix error in receiving data',
                created_by: 'alex'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                issueID = res.body._id;
                assert.equal(res.body.issue_title, 'Issue #2');
                assert.equal(res.body.issue_text, 'Fix error in receiving data');
                assert.equal(res.body.created_by, 'alex');
                setTimeout(done, 200000);
            });
    }); //Test #2

    //Create an issue with missing required fields: POST request to /api/issues/{project}
    test('Create an issue with missing required fields', function(done) {
        chai
            .request(server)
            .post('/api/issues/projects')
            .set('content-type', 'application/json')
            .send({
                issue_title: 'Issue #2',
                issue_text: 'Fix error in receiving data'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'required field(s) missing');
                setTimeout(done, 100000);
            });
    }); //Test #3
  }); //POST Request Tests

  suite('GET Request Tests', function() {
    this.timeout(500000);
    //View issues on a project: GET request to /api/issues/{project}
    test('View Issue', function(done) {
        chai
            .request(server)
            .get('/api/issues/test-data')
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.length, 1);
                setTimeout(done, 5000);
            });
        }); //Test #1

    //View issues on a project with one filter: GET request to /api/issues/{project}
    test('View Issue: 1 Filter', function(done) {
        chai
            .request(server)
            .get('/api/issues/test-data')
            .query({ id: '6328021b3451be0411a196cb' })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body[0], {
                    issue_title: 'test1',
                    issue_text: 'test1 desc',
                    created_on: '2022-09-19T05:46:03.539Z',
                    updated_on: '2022-09-19T05:46:03.539Z',
                    created_by: 'alex',
                    assigned_to: '',
                    open: true,
                    status_text: '',
                    _id: '6328021b3451be0411a196cb'
                });
                setTimeout(done, 200000);
            });
        }); //Test #2

    //View issues on a project with multiple filters: GET request to /api/issues/{project}
    test('View Issue: Multiple Filters', function(done) {
        chai
            .request(server)
            .get('/api/issues/test-data')
            .query({ issue_title: 'test1', issue_text: 'test1 desc'  })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body[0], {
                    issue_title: 'test1',
                    issue_text: 'test1 desc',
                    created_on: '2022-09-19T05:46:03.539Z',
                    updated_on: '2022-09-19T05:46:03.539Z',
                    created_by: 'alex',
                    assigned_to: '',
                    open: true,
                    status_text: '',
                    _id: '6328021b3451be0411a196cb'
                });
                setTimeout(done, 200000);
            });
        }); //Test #3
    }); //GET Request Tests

suite('PUT Request Tests', function() {
    //Update one field on an issue: PUT request to /api/issues/{project}
    this.timeout(500000);
    test('Update Issue: 1 Field', function(done) {
        chai
            .request(server)
            .put('/api/issues/apitest')
            .send({
                _id: '63228dce6bae97102fdcdbca',
                issue_title: 'testagain'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.result, 'successfully updated');
                assert.equal(res.body._id, '63228dce6bae97102fdcdbca');
                setTimeout(done, 200000);
            });
    });
    //Update multiple fields on an issue: PUT request to /api/issues/{project}
    test('Update Issue: Multiple Fields', function(done) {
        chai
            .request(server)
            .put('/api/issues/apitest')
            .send({
                _id: '63228dce6bae97102fdcdbca',
                issue_title: 'another test',
                issue_text: 'test nanaman',
                created_by: 'aleks'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.result, 'successfully updated');
                assert.equal(res.body._id, '63228dce6bae97102fdcdbca');
                setTimeout(done, 200000);
            });
    });
    //Update an issue with missing _id: PUT request to /api/issues/{project}
    test('Update with missing _id', function(done) {
        chai
            .request(server)
            .put('/api/issues/apitest')
            .send({
                issue_title: 'another test 2'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'missing _id');
                setTimeout(done, 100000);
            });
    });
    //Update an issue with no fields to update: PUT request to /api/issues/{project}
    test('Update an issue with no fields', function(done) {
        chai
            .request(server)
            .put('/api/issues/apitest')
            .send({
                _id: '63228dce6bae97102fdcdbca'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'no update field(s) sent');
                assert.equal(res.body._id, '63228dce6bae97102fdcdbca');
                setTimeout(done, 100000);
            });
    });
    //Update an issue with an invalid _id: PUT request to /api/issues/{project}
    test('Update an issue with invalid _id', function(done) {
        chai
            .request(server)
            .put('/api/issues/apitest')
            .send({
                _id: '63228dce6bae97102fdcdbc5423',
                issue_title: 'change request'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'could not update');
                assert.equal(res.body._id, '63228dce6bae97102fdcdbc5423');
                setTimeout(done, 100000);
            });
    });
});

    suite('DELETE Request Tests', function() {
        this.timeout('300000')
        //Delete an issue: DELETE request to /api/issues/{project}
        test('Delete 1 Issue', function(done) {
            chai
                .request(server)
                .post('/api/issues/apitest')
                .send({
                    issue_title: 'Another Delete Test',
                    issue_text: 'test to delete',
                    created_by: 'alex'
                })
                .end(function (err,res) {
                    var deleteId = res.body._id;
                    chai.request(server)
                        .delete('/api/issues/apitest')
                        .send({ 
                            _id: deleteId
                        })
                        .end(function (err, res) {
                            assert.equal(res.status, 200);
                            assert.equal(res.body.result, 'successfully deleted');
                            assert.equal(res.body._id, deleteId);
                        });
                    setTimeout(done, 100000);
                });
        });
        //Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
        test('Delete an issue with invalid _id', function(done) {
            chai
                .request(server)
                .delete('/api/issues/apitest')
                .send({
                    _id: '63228dce6bae97102fdcdbc5423sd34'
                })
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'could not delete');
                    assert.equal(res.body._id, '63228dce6bae97102fdcdbc5423sd34');
                    setTimeout(done, 100000);
                });
        });
        //Delete an issue with missing _id: DELETE request to /api/issues/{project}
        test('Delete an issue with missing _id', function(done) {
            chai
                .request(server)
                .delete('/api/issues/apitest')
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.error, 'missing _id');
                    setTimeout(done, 100000);
                });
        });
    }); //Delete Request Tests
}); //Functional Tests
