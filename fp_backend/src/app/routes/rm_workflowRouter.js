var err_msg = require('../../error/err')
var fs = require('fs');
var express = require('express'),
    bodyParser = require('body-parser');

// var regForms = require('../models/regForms');
// var RAModelPortf = require('../models/RAModelPortf')
// var coInfoModel = require('../models/co_info')
// var fundInfoModel = require('../models/fund_info')
// var modelPortf = require('../models/model_portf')
// var countryCollection = require('../models/country')
// var userCollection = require('../models/user')

var mongoose = require('mongoose');

var nev = require('../signup/email');
//  var nev = require('email-verification')(mongoose)
var config = require('../../config/config');
var documentCollection = require('../models/upload_doc');

var rm_workflowRouter = express.Router();
rm_workflowRouter.use(bodyParser.json());

//email stuff
rm_workflowRouter.use(bodyParser.urlencoded());
rm_workflowRouter.get('/', function (req, res) {
    res.sendFile('index.html', {
        root: __dirname
    });
});



var UserModel = require('../models/user');

rm_workflowRouter.route('/sendEmail/createTemp')
    .post(function (req, res) {

        var email = req.body.email;
        console.log('req.body', JSON.stringify(req.body, null, 2))
        // register button was clicked
        if (req.body.type === 'register') {
            var pw = req.body.password;

            var newUser = new UserModel({
                email: email,
                password: pw

            });

            nev.createTempUser(newUser, function (err, existingPersistentUser, newTempUser) {
                if (err) {
                     console.log("error",err)
                    return res.status(450).json({
                        
                        error: err_msg.ERR_SIGNUP_CREATE_TEMP_USER_FAILED
                    });
                } else if (existingPersistentUser) { // user already exists in persistent collection
                   console.log("existing")
                    return res.status(450).json({
                        error: err_msg.ERR_SIGNUP_USER_ACCOUNT_EXIST
                    });
                } else if (newTempUser) { // new user created
                    console.log("new",newTempUser)
                    var URL = newTempUser[nev.options.URLFieldName];

                    nev.sendVerificationEmail(email, URL, function (err, info) {
                        console.log("sending", email)
                        if (err) {
                            //console.log("new user , but email failed",err)
                            return res.status(450).json({
                                error: err_msg.ERR_SIGNUP_SEND_EMAIL_FAILED
                            });
                        } else {

                            res.status(200).json({
                                user_title: 'Sign Up Account',
                                user_msg: 'An email has been sent to you. Please check it to verify your account.',
                                info: info
                            });
                        }
                    });

                    // user already exists in temporary collection!
                } else {
                    console.log("already signed up")
                     
                    res.status(450).json({
                        error: err_msg.ERR_SIGNUP_USER_ALREADY_SIGNUP
                    });
                }
            });

            // resend verification button was clicked
        } else {
            nev.resendVerificationEmail(email, function (err, userFound) {
                if (err) {
                    return res.status(450).json({
                        error: err_msg.ERR_SIGNUP_RESEND_EMAIL_FAILED
                    });
                }
                if (userFound) {
                    res.status(200).json({
                        user_title: 'Resend Verification Code',
                        user_msg: 'An email has been sent to you. Please check it to verify your account.'
                    });
                } else {
                    res.status(450).json({
                        error: err_msg.ERR_SIGNUP_RESEND_USER_NOT_FOUND
                    });
                }
            });
        }
    });


rm_workflowRouter.route('/sendEmail/verify/:url_token')
    .get(function (req, res) {
        var url = req.params.url_token;

        nev.confirmTempUser(url, function (err, user) {
            if (user) {
                nev.sendConfirmationEmail(user.email, function (err, info) {
                    if (err) {
                        return res.status(450).json({
                            error: err_msg.ERR_SIGNUP_VERIFY_SEND_EMAIL_FAILED
                        });
                    }
        //             console.log("success, sending confirm email")
        //              $auth.signup(user)
       
        //   $auth.setToken(response)
                    
                    res.redirect(301, config.REDIRECT_PATH_SUCCESS_EMAIL_VERIFICATION)
                    //  res.send({ token: createJWT(user) });
                    
                });
            } else {
                return res.status(450).json({
                    error: err_msg.ERR_SIGNUP_VERIFY_FAILED
                });
            }


        });
    });

rm_workflowRouter.route('/regForm/search/:rmId/:Name')
    .get(function (req, res, next) {
        regForms.findOne({
            rm_id: req.params.rmId,
            name: req.params.Name
        }, function (err, regform) {
            if (err) return next(err);
            res.json(regform);
        });
    })

rm_workflowRouter.route('/regForm/')
    .post(function (req, res, next) {
        console.log('req.body', JSON.stringify(req.body, null, 2))
        regForms.create(req.body, function (err, regform) {
            if (err) {
                if (err.name == "ValidationError") {
                    for (field in err.errors) {
                        console.log("rm_workflowRouter - post - ValidationError in - " + field);
                    }
                }
                return next(err);
            }
            var id = regform.id;

            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Added the regFrom with id: ' + id);
        });
    })

rm_workflowRouter.route('/regForm/:formId')
    .get(function (req, res, next) {
        regForms.findById(req.params.formId, function (err, regform) {
            if (err) return next(err);
            res.json(regform);
        });
    })
    .put(function (req, res, next) {
        regForms.findByIdAndUpdate(req.params.formId, {
                $set: req.body
            }, {
                new: true
            },
            function (err, regform) {
                if (err) return next(err);
                res.json(regform);
            });
    })
    .delete(function (req, res, next) {
        regForms.findByIdAndRemove(req.params.formId, function (err, resp) {
            if (err) return next(err);
            res.json(resp);
        });
    });


rm_workflowRouter.route('/ra_model_portf/:sp_Id/:portf_Id')
    .get(function (req, res, next) {
        RAModelPortf.findOne({
            sp_id: req.params.sp_Id,
            portf_id: req.params.portf_Id
        }, function (err, raMPortf) {
            if (err) return next(err);
            res.json(raMPortf);
        });
    })

//return sort according to risklevel
rm_workflowRouter.route('/model_portf/:universe_Id')
    .get(function (req, res, next) {
        modelPortf.find({
                universe_id: req.params.universe_Id
            },
            null, {
                sort: {
                    risk_level: 1
                }
            }).lean().
        populate('aa.securities.fund_info aa.securities.co_info').
        exec(function (err, mPortfs) {
            if (err) return next(err);
            res.json(mPortfs);
        })
    })


rm_workflowRouter.route('/model_portf/:universe_Id/:risk_Level')
    .get(function (req, res, next) {
        modelPortf.findOne({
            universe_id: req.params.universe_Id,
            risk_level: req.params.risk_Level
        }).lean().
        populate('aa.securities.fund_info aa.securities.co_info').
        exec(function (err, mPortf) {
            if (err) return next(err);
            res.json(mPortf);
        })
    })

rm_workflowRouter.route('/countryCollection/')
    .get(function (req, res, next) {
        countryCollection.find({},
            function (err, country) {
                if (err) return next(err);
                res.json(country);
            });
    })




//USER MANAGEMENT======== DONTTTT TOUCH MINE CODES!!!!!!!!!!!!
rm_workflowRouter.route('/user/')
    .get(function (req, res, next) {
        regForms.find({},
            function (err, user) {
                if (err) return next(err);
                res.json(user);
            });
    })
    .post(function (req, res, next) {
        console.log('req.body', JSON.stringify(req.body, null, 2))
        regForms.create(req.body, function (err, regForms) {
            if (err) {
                if (err.name == "ValidationError") {
                    for (field in err.errors) {
                        console.log("rm_workflowRouter - post - ValidationError in - " + field);
                    }
                }
                return next(err);
            }
            var id = regForms.id;

            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Added the regFrom with id: ' + id);
        });
    })

rm_workflowRouter.route('/user/:_id')
    .delete(function (req, res, next) {
        regForms.findByIdAndRemove({
            _id: req.params._id
        }, function (err, regForms) {
            if (err) return next(err);
            res.json(regForms);
        });
    })
    .put(function (req, res, next) {
        regForms.findByIdAndUpdate({
            _id: req.params._id
        }, {
            $set: req.body
        }, {
            new: true
        }, function (err, regForms) {
            if (err) return next(err);
            res.json(regForms);
        });
    })
    .get(function (req, res, next) {
        regForms.findById({
            _id: req.params._id
        }, function (err, regForms) {
            if (err) return next(err);
            res.json(regForms);
        });
    })


rm_workflowRouter.route('/user/search/all/:searchString')
    .get(function (req, res, next) {
        regForms.find({
            $or: [{
                name: {
                    $regex: new RegExp(req.params.searchString, "i")
                }
            }, {
                email: {
                    $regex: new RegExp(req.params.searchString, "i")
                }
            }, {
                nric: {
                    $regex: new RegExp(req.params.searchString, "i")
                }
            }, {
                contactNo: {
                    $regex: new RegExp(req.params.searchString, "i")
                }
            }, {
                aSalary: {
                    $regex: new RegExp(req.params.searchString, "i")
                }
            }, {
                'nationality.name': { // bloody hell
                    $regex: new RegExp(req.params.searchString, "i")
                }
            }, {
                status: {
                    $regex: new RegExp(req.params.searchString, "i")
                }
            }]
        }, function (err, regForms) {
            if (err) return next(err);
            res.json(regForms);
        }).limit(1000);
    })



rm_workflowRouter.route('/upload_doc/')
    .post(function (req, res, next) {
        var uuid = guid();
        var doc = {
            user_id: '',
            doc_type: '',
            doc_filename: ''
        }

        var fstream;
        //console.log('req', req)
        var pipe = req.pipe(req.busboy);

        req.busboy.on('field', function (fieldname, value) {
            console.log('field', fieldname, value)
            if (fieldname == 'DOCTYPE') {
                doc.doc_type = value
            } else if (fieldname == "DOCUSERID") {
                doc.user_id = value
            }
        })

        req.busboy.on('file', function (fieldname, file, filename) {

            var uploadedfilename = uuid + '.' + filename.split('.').pop()
            doc.doc_filename = uploadedfilename
            console.log("Uploading: " + doc.doc_filename);
            fstream = fs.createWriteStream(config.DOC_UPLOAD_PATH + uploadedfilename);
            file.pipe(fstream);
            fstream.on('close', function () {
                //todo: Status for file write success
            }).on('error', function (error) {
                console.log('Error: GO DIE STUPID ERROR', error.message);
                next(error);
            });
            //TODO: handle error  and return error status code 


        });


        req.busboy.on('finish', function () {
            //insert db
            documentCollection.create(doc, function () {
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('File Upload Success! ');
            });
        })

    })

rm_workflowRouter.route('/upload_doc/:user_id')
    .get(function (req, res, next) {
        documentCollection.find({
            user_id: req.params.user_id
        }, function (err, documentCollection) {
            if (err) return next(err);
            res.json(documentCollection);
        });
    })





function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}



module.exports = rm_workflowRouter;