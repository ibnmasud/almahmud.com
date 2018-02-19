import { valid } from 'joi';
var route = require('./src/pathMatch')({});
var CONFIG = require('./config/config');
const querystring = require('querystring');

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
var DEBUG_SIS = false
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
            handler:people.getByIdPublic,
            validator: {
                params: {
                    id: Joi.number().min(8).required()
                },
                headers:{
                    "x-api-key": tokenValidationJoi.token().jwt()
                }
            }
        },{
            path:"/people/:id", 
            handler:people.getById,
            validator: {
                params: {
                    id: Joi.string().hex().min(8).required()
                },
                headers:{
                    "x-api-key": tokenValidationJoi.token().jwt()
                }
            }
        },{
            path:"/people/images/:id",
            handler:people.getImage,
            validator: {
                params: {
                    id: Joi.number().max(CONFIG.MAX_AUTHOR_IMAGE)
                },
                headers:{
                    "x-api-key": tokenValidationJoi.token().jwt()
                }
            }
        },{
            path:"/listings/:id", 
            handler:listings.getById,
            validator: {
                params: {
                    id: Joi.string().hex().min(8).required()
                },
                headers:{
                    "x-api-key": tokenValidationJoi.token().jwt()
                }
            }
        },{
            path:"/listings/images/:id",
            handler:listings.getImage,
            validator: {
                params: {
                    id: Joi.number().max(CONFIG.MAX_LISTIG_IMAGE)
                },
                headers:{
                    "x-api-key": tokenValidationJoi.token().jwt()
                }
            }
        }
    ],
    "PUT":[
        {
            path:"/people/:id",
            handler:people.update,
            validator: {
                params: {
                    id: Joi.string().hex().min(8).required()
                },
                headers:{
                    "x-api-key": tokenValidationJoi.token().jwt('user')
                },
                body:people.updateSchema
            }
        },{
            path:"/people/images/:id",
            handler:people.updateImage,
            validator: {
                params: {
                    id: Joi.number().max(CONFIG.MAX_AUTHOR_IMAGE)
                },
                headers:{
                    "x-api-key": tokenValidationJoi.token().jwt('user')
                }
            }
        },{
            path:"/listings/:id",
            handler:listings.update
        },{
            path:"/listings/images/:id",
            handler:listings.updateImage,
            validator: {
                params: {
                    id: Joi.number().max(CONFIG.MAX_LISTIG_IMAGE)
                },
                headers:{
                    "x-api-key": tokenValidationJoi.token().jwt('user')
                }
            }
        }
    ],
    "POST":[
        {
            path:"/people", 
            handler:people.add,
            validator: {
                headers:{
                    "x-api-key": tokenValidationJoi.token().jwt()
                },
                body:people.addSchema
            }
        },
        {
            path:"/listings", 
            handler:listings.add,
            validator: {
                headers:{
                    "x-api-key": tokenValidationJoi.token().jwt()
                },
                body:listings.addSchema
            }
        },
        {
            path:"/addListing", 
            handler:listings.addListing,
            validator: {
                headers:{
                    "x-api-key": tokenValidationJoi.token().jwt()
                }
                
            }
        }
    ]
}
function processEvent(event, context, callback) {
    event.path = event.path.split(rootPath)[1]
    if(event.path.substr(-1) === "/"){
        event.path = event.path.substr(0, event.path.length-1)
    }
    if(event.httpMethod === 'OPTIONS'){
        callback(null, {
            statusCode: 200,
            body:"{}",
            headers:{
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'content-type, x-api-key',
                'Access-Control-Allow-Methods':	'OPTIONS,GET,POST'
            }
        })
    }else if(routes[event.httpMethod]){
        var handler;
        var validator;
        var params;
        var valid
        for(var a in routes[event.httpMethod]){
            
            var match = route(routes[event.httpMethod][a].path);
            params = match(event.path);
            if (params !== false) {
                handler = routes[event.httpMethod][a].handler
                event.params = params
                console.log('b',JSON.parse(event.body))
                if(typeof event.body === 'string'){
                    event.body = JSON.parse(event.body)
                }
                
                validator = routes[event.httpMethod][a].validator
                valid = Joi.validate(event, validator, {allowUnknown: true})
                if(!valid.error){
                    event = valid.value
                    break;
                }
            }
        }
        if(valid && valid.error){
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
    
};