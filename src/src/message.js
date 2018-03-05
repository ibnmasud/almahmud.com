var lamdaResponse = require('./lambdaResponse')
var getJWTToken = require('./getJWTToken')
var Joi = require('joi')
const joiGetDate = require('./joiGetDate')
var remote = require('remote-json');

const messages = "https://api.mlab.com/api/1/databases/sis/collections/messages?apiKey=nupdJlpcblePLqZbYT6Zr02fBTUHRLEN"
const pmessages = "https://api.mlab.com/api/1/databases/sis/collections/pmessages?apiKey=nupdJlpcblePLqZbYT6Zr02fBTUHRLEN"
const maxI = 3
var i = 0
var errors = []
var documents = []
function done(err, doc, cb){
    i++
    if(err){
        errors.push(err)
    }
    if(doc){
        documents.push(doc)
    }
    if(i>=3){
        if(errors.length>0){
            cb(errors, documents)
        }else{
            cb(null, documents)
        }
        
    }
    
}
function insertMessage(to, from, message, callback){
    var toQuery = {}
    toQuery.$push[from]=message
    var fromQuery = {}
    fromQuery.$push[to]=message
    var messageQuery = {
        $push: { messages: message}
    }
    remote(pmessages+"?u=true&q="+JSON.stringify({_id:to+"_"+from}))
    .put(messageQuery, (err, res, body)=>{
        if(err){
            callback(err, null)
        } else {
            console.log('pmessage to added', body)
            callback(null, lamdaResponse(body))
        }
    })
    remote(pmessages+"?u=true&q="+JSON.stringify({_id:from+"_"+to}))
    .put(messageQuery, (err, res, body)=>{
        if(err){
            callback(err, null)
        } else {
            console.log('pmessage from added', body)
            callback(null, lamdaResponse(body))
        }
    })
}
db.pmessages.update_old({_id:"abcdefg"},{ $push:{'efg.abc':"efg"}}, { upsert: true})
exports.add = (event, context, callback)=>{
    var author_id = event.headers['x-api-key'].user_id
    var message = event.body;
    message.from = author_id;
    var i = 0
    insertMessage(message.to, author_id, { message: message.message, created_at: message.created_at}, (err,response)=>{
        i++
        if(i>=2){
            remote(messeges)
            .post(message, (err, res, body)=>{
                if(err){
                    callback(err, null)
                } else {
                    console.log('message added', body)
                    callback(null, lamdaResponse(body))
                }
            })
        }
    })
    
}
db.pmessages.update({_id:"abcdefg"},{ $push:{'efg.abc':"efg"}}, { upsert: true})
exports.add = (event, context, callback)=>{
    var author_id = event.headers['x-api-key'].user_id
    var message = event.body;
    message.from = author_id;
    var i = 0
    
    remote(messeges)
    .post(message, (err, res, body)=>{
        if(err){
            callback(err, null)
        } else {
            console.log('message added', body)
            insertMessage(message.to, author_id, { message: message.message, created_at: message.created_at}, (err,response)=>{
                i++
                console.log("insertMessage ", i)
                if(i>=2){
                    //callback(null, lamdaResponse(body))
                }
            })
            callback(null, lamdaResponse(body))
        }
    })
    
}

exports.getMessageFromUser = (event, context, callback)=>{
    var author_id = event.headers['x-api-key'].user_id;
    var from = event.params.from;
    var toSend = {}
    remote(pmessages+'&q='+JSON.stringify({_id:from+"_"+author_id}))
    .get((err, res, body)=>{
        if(!err){
            toSend.from = body
        }
        remote(pmessages+'&q='+JSON.stringify({_id:author_id+"_"+from}))
        .get((err2, res2, body2)=>{
            toSend.me = body2
            callback(null, lamdaResponse(toSend))
        })
    })
}
exports.getMessageFromUser2 = (event, context, callback)=>{
    var author_id = event.headers['x-api-key'].user_id;
    var from = event.params.from;
    var toSend = {}
    remote(messages+'&q='+JSON.stringify({$or: [{$and:[{from}, {to:author_id}]}, {$and:[{to:author_id}, {from}]}, ]}))
    .get((err, res, body)=>{
        callback(null, lamdaResponse(body))
    })
}
exports.getMessages = (event, context, callback)=>{
    var author_id = event.headers['x-api-key'].user_id;
    remote(messages+'&q='+JSON.stringify({$or: [{from:author_id}, {to:author_id}]}))
    .get((err, res, body)=>{
        toSend.me = body2
        callback(null, lamdaResponse(toSend))
    })
}
exports.addSchema = {
    created_at:joiGetDate.date().now(),
    to: Joi.string().required(),
    message: Joi.string().required(),
    from: Joi.string().optional()
}
// Todo mark as read
// Send notifications