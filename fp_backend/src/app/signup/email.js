
  var  mongoose = require('mongoose');
var    nev = require('email-verification')(mongoose);
  var  bcrypt = require('bcryptjs');


// our persistent user model
var UserModel = require('../models/user');

// sync version of hashing function
// var myHasher = function(password, tempUserData, insertTempUser, callback) {
//     var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
//     return insertTempUser(hash, tempUserData, callback);
// };

// async version of hashing function
var myHasher = function(password, tempUserData, insertTempUser, callback) {
 
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {  
            console.log("hash",hash)
            return insertTempUser(hash, tempUserData, callback);
        });
    });
};

//  var _tempUserModel=require('./models/tempUserModel');

// NEV configuration =====================
nev.configure({
    persistentUserModel: UserModel,
      tempUserModel: null,
    expirationTime: 600, // 10 minutes

    verificationURL: 'http://localhost:3443/api/rm_workflow/sendEmail/verify/${URL}',
    transportOptions: {
        service: 'Gmail',
        auth: {
            user: 'rickithadi@gmail.com',
            pass: 'Fuckyoumicrosoft98'
        }
    },

    verifyMailOptions: {
        from: 'Do Not Reply <user@gmail.com>',
        subject: 'Confirm your account',
        html: '<p>Please verify your account by clicking <a href="${URL}">this link</a>. If you are unable to do so, copy and ' +
                'paste the following link into your browser:</p><p>${URL}</p>',
        text: 'Please verify your account by clicking the following link, or by copying and pasting it into your browser: ${URL}'
    },
    
    shouldSendConfirmation: false,
    confirmMailOptions: {
        from: 'Do Not Reply <user@gmail.com>',
        subject: 'Successfully verified!',
        html: '<p>Your account has been successfully verified.</p>',
        text: 'Your account has been successfully verified.'
    },

    hashingFunction: myHasher,
    passwordFieldName: 'password',
}, function(err, options) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('configured: ' + (typeof options === 'object'));
});

nev.generateTempUserModel(UserModel, function(err, _tempUserModel) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('generated temp user model: ' + (typeof _tempUserModel === 'function'));
});

module.exports = nev