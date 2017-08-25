// server.js

// BASE SETUP
// =============================================================================
var dotenv = require('dotenv').config()
var moment = require('moment');

var fs = require('fs');
// call the packages we need
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var async = require('async');
var morgan = require('morgan');
var config = require('./config/config');



// ======= Mongodb setup =======================================================
var mongoose = require('mongoose');
// Use native promises
mongoose.Promise = global.Promise;

var qi_py_hostname = config.qi_py_hostname;

mongoose.connect(config.mongodb_local_uri); // connect to our database

var db = mongoose.connection;
db.on('connecting', function() {
    logger.info('Mongodb connecting ...');
});
db.on('error', function(error) {
    logger.error('Error in MongoDb connection: ' + error);
    //mongoose.disconnect();
});
db.on('connected', function() {
    logger.info('Mongdb connected !');
});
db.on('reconnected', function() {
    logger.error('Mongodb reconnected !');
});


// =============================================================================
app.use(morgan('combined'));

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '5mb'
}));
app.use(bodyParser.json({
    limit: '5mb'
}));


// Force HTTPS on Heroku
if (app.get('env') === 'production') {
  app.use(function(req, res, next) {
    var protocol = req.get('x-forwarded-proto');
    protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
  });
}
//app.use(express.static(path.join(__dirname, '../../client')));



// START THE SERVER
// =============================================================================
//var port;
var https = require('https');

// Setup HTTPS
var options = {
    key: fs.readFileSync(__dirname + '/ssl/cloudflare/eigecat_co_cert_key.pem'),
    cert: fs.readFileSync(__dirname + '/ssl/cloudflare/eigecat_co_cert.pem')
};

var port = process.env.NODE_PORT || 3443

//var secureServer = https.createServer(options, app).listen(port);
app.listen(port);
console.log('listening on port ' + port);


var request = require('requestretry');
var PYRequest = require('requestretry').defaults({
    maxAttempts: 3,
    retryDelay: 5000,
    json: true,
    timeout: 10000000, // 2 mins
    pool: {
        maxSockets: 200
    }
});


// === logger setup ============================================================
var winston = require('winston');


var logger = new(winston.Logger)({
    transports: [
        new(winston.transports.Console)({
            name: 'info-console',
            level: 'error',
            handleExceptions: true
        }),
        new(require('winston-daily-rotate-file'))({
            name: 'log-file',            
            filename: config.LOG_PATH,
            level: 'debug',            
            handleExceptions: true
        })
    ]
});


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

var cors = require('cors')
app.use(cors())
app.options('*', cors())


/* Work Flow - RM assist  */
var rm_workflowRouter = require('./app/routes/rm_workflowRouter');

var authRouter = require('./app/auth/authRouter');

app.use('/', authRouter);

var busboy = require('connect-busboy');
app.use(busboy()); 

app.use('/api/rm_workflow', rm_workflowRouter);
app.use('/api/authRouter', authRouter);
app.use(express.static(__dirname + '/public'));



