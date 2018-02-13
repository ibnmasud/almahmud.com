//'use strict'
//const AWS = require('aws-sdk');
//var MongoClient = require('mongodb').MongoClient;

var mongo_uri;
var cachedDb = null;

exports.handler = (event, context, callback) => {
    console.log("",{event, context})
    //the following line is critical for performance reasons to allow re-use of database connections across calls to this Lambda function and avoid closing the database connection. The first call to this lambda function takes about 5 seconds to complete, while subsequent, close calls will only take a few hundred milliseconds.
    context.callbackWaitsForEmptyEventLoop = false;
    var uri = process.env.MONGO_URI;
    if (mongo_uri === null) {
        mongo_uri = uri
    }
    processEvent(event, context, callback);
};

function processEvent(event, context, callback) {
    //console.log('Calling MongoDB Atlas from AWS Lambda with event: ' + JSON.stringify(event));
    
    callback(null, {msg:"msg",event, context})
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
            console.log(message);
            callback(null, message);
        }
        //we don't want to close the connection since we set context.callbackWaitsForEmptyEventLoop to false (see above)
        //this will let our function re-use the connection on the next called (if it can re-use the same Lambda container)
        //db.close();
    });
};