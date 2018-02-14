import { valid } from 'joi';
var route = require('./src/pathMatch')({});
//'use strict'
//const AWS = require('aws-sdk');
//var MongoClient = require('mongodb').MongoClient;
var people = require('./src/people')
var listings = require('./src/listings')
var mongo_uri;
var cachedDb = null;
var Boom = require('boom')
var Joi = require('joi')
var validateJWT = require('./src/validateJWT')
const tokenValidationJoi = require('./src/joiTokenValidator')
var rootPath = '/sis'
var DEBUG_SIS = true
exports.handler = (event, context, callback) => {
    //console.log("",{event, context})
    //the following line is critical for performance reasons to allow re-use of database connections across calls to this Lambda function and avoid closing the database connection. The first call to this lambda function takes about 5 seconds to complete, while subsequent, close calls will only take a few hundred milliseconds.
    context.callbackWaitsForEmptyEventLoop = false;
    /*var uri = process.env.MONGO_URI;
    if (mongo_uri === null) {
        mongo_uri = uri
    }*/
    processEvent(event, context, callback);
};
var lamdaResponse = require('./src/lambdaResponse')

var routes = {
    "GET":[
        {
            path:"/people/:id", 
            handler:people.getById,
            validator: {
                params: {
                    id: Joi.string().hex().min(8).required()
                }
            }
        },
        {
            path:"/people/:id", 
            handler:people.getByIdPublic,
            validator: {
                params: {
                    id: Joi.number().min(8).required()
                },
                headers:{
                    "x-api-key": tokenValidationJoi.token().jwt()
                }
            }
        },
        {
            path:"/listings/:id", 
            handler:listings.getById
        }
    ],
    "PUT":[
        {
            path:"/people/:id",
            handler:people.update
        },{
            path:"/listings/:id",
            handler:listings.update
        }
    ],
    "POST":[
        {
            path:"/people", 
            handler:people.add
        },
        {
            path:"/listings", 
            handler:listings.add
        }
    ]
}
function processEvent(event, context, callback) {
    event.path = event.path.split(rootPath)[1]
    if(event.path.substr(-1) === "/"){
        event.path = event.path.substr(0, event.path.length-1)
    }
    if(routes[event.httpMethod]){
        var handler;
        var validator;
        var params;
        var valid
        for(var a in routes[event.httpMethod]){
            /*if(routes[event.httpMethod][a].path === event.path){
                if(routes[event.httpMethod][a].handler && typeof routes[event.httpMethod][a].handler === 'function'){
                    handler = routes[event.httpMethod][a].handler
                }
                if(routes[event.httpMethod][a].validator && typeof routes[event.httpMethod][a].validator === 'object'){
                    validator = routes[event.httpMethod][a].validator
                }
                
                break
            }*/
            //console.log('route')
            var match = route(routes[event.httpMethod][a].path);
            //console.log('match')
            params = match(event.path);
            //console.log('params',event.path)
            //console.log('routes[event.httpMethod][a].path',routes[event.httpMethod][a].path)
            if (params !== false) {
                handler = routes[event.httpMethod][a].handler
                event.params = params
                if(typeof event.body === 'string'){
                    event.body = JSON.parse(event.body)
                }
                
                validator = routes[event.httpMethod][a].validator
                valid = Joi.validate(event, validator, {allowUnknown: true})
                console.log('params-', valid)
                if(!valid.error){
                    break;
                }
            }else{
                //console.log('notmatched >',routes[event.httpMethod][a].path)
            }
        }
        if(valid.error){
            if(DEBUG_SIS){
                callback(null, lamdaResponse(valid))
            }else{
                callback(null, lamdaResponse(Boom.badRequest("Validation Error")))
            }
        }else{
            if(handler){
                handler(valid.value, context, callback)
            }else{
                callback(null, lamdaResponse(Boom.notFound()))
            }
        }
        
    }else{
        callback(null, lamdaResponse(Boom.notFound()))
    }
    //console.log('Calling MongoDB Atlas from AWS Lambda with event: ' + JSON.stringify(event));
    

    /*var jsonContents = JSON.parse(JSON.stringify(event));

    

    //date conversion for grades array
    if (jsonContents.grades != null) {
        for (var i = 0, len = jsonContents.grades.length; i < len; i++) {
            //use the following line if you want to preserve the original dates
            //jsonContents.grades[i].date = new Date(jsonContents.grades[i].date);

            //the following line assigns the current date so we can more easily differentiate between similar records
            jsonContents.grades[i].date = new Date();
        }
    }

    try {
        //testing if the database connection exists and is connected to Atlas so we can try to re-use it
        if (cachedDb && cachedDb.serverConfig.isConnected()) {
            createDoc(cachedDb, jsonContents, callback);
        }
        else {
            //some performance penalty might be incurred when running that database connection initialization code
            console.log(`=> connecting to database ${atlas_connection_uri}`);
            MongoClient.connect(atlas_connection_uri, function (err, db) {
                if (err) {
                    console.log(`the error is ${err}.`, err)
                    process.exit(1)
                }
                cachedDb = db;
                return createDoc(db, jsonContents, callback);
            });            
        }
    }
    catch (err) {
        console.error('an error occurred', err);
    }*/
}

function createDoc(db, json, callback) {
    db.collection('restaurants').insertOne(json, function (err, result) {
        if (err != null) {
            console.error("an error occurred in createDoc", err);
            callback(null, JSON.stringify(err));
        }
        else {
            var message = `Kudos! You just created an entry into the restaurants collection with id: ${result.insertedId}`;
            //console.log(message);
            callback(null, message);
        }
        //we don't want to close the connection since we set context.callbackWaitsForEmptyEventLoop to false (see above)
        //this will let our function re-use the connection on the next called (if it can re-use the same Lambda container)
        //db.close();
    });
};