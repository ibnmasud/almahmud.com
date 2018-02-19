var lamdaResponse = require('./lambdaResponse')
const joiGetDate = require('./joiGetDate')
var remote = require('remote-json');

const Joi = require('joi')
const listings = "https://api.mlab.com/api/1/databases/sis/collections/listings?apiKey=nupdJlpcblePLqZbYT6Zr02fBTUHRLEN"
const authors = "https://api.mlab.com/api/1/databases/sis/collections/authors?apiKey=nupdJlpcblePLqZbYT6Zr02fBTUHRLEN"
exports.add = (event, context, callback)=>{
    callback(null, lamdaResponse({msg:"listings create",event, context}))
}
exports.addListing = (event, context, callback)=>{
    var authorFromKey = event.headers['x-api-key']
    var author = event.body.author;
    var space = event.body.space;
    space.author_id = event.headers['x-api-key'].user_id
    console.log(authors+'&q='+JSON.stringify({_id:space.author_id}))
    remote(authors+'&q='+JSON.stringify({_id:space.author_id}))
    .get((err, res, body)=>{
        //console.log("err", err)
        //console.log("body", body)
        console.log("body", body.length)
        
        if(body.length === 0){
            console.log('try to add author')
            for(var a in author){
                if (author[a] !== ""){
                    authorFromKey[a] = author[a]
                }
            }
            authorFromKey._id = authorFromKey.user_id;
            authorFromKey.firebase.identities = JSON.stringify(authorFromKey.firebase.identities)
            remote(authors)
            .post(authorFromKey, (err2, res2, body2)=>{
                console.log('author added', body2)
                remote(listings)
                .post(space, (err3, res3, body3)=>{
                    callback(null, lamdaResponse(body3))
                })
            })
        }else{
            console.log('author old')
            var authorFromDB = body[0]
            remote(listings)
            .post(space, (err3, res3, body3)=>{
                callback(null, lamdaResponse(body3))
            })
        }
        //callback(null, lamdaResponse({body,err}))
    })
    /*remote(listings)
    .post(event.body.space, (err, res, body)=>{
        console.log(res.statusCode); // 200
        console.log(body); // {"name": "Bob", "key": "value"}
        callback(null, lamdaResponse(body))
    })*/
    //callback(null, lamdaResponse({msg:"listings addListing",event, context}))
}
exports.update = (event, context, callback)=>{
    callback(null, lamdaResponse({msg:"listings update",event, context}))
}
exports.getById = (event, context, callback)=>{
    //should be different for public and owner
    callback(null, lamdaResponse({msg:"listings getById",event, context}))
}
exports.updateImage = (event, context, callback)=>{
    callback(null, lamdaResponse({msg:"people update Image",event, context}))
}
exports.getImage = (event, context, callback)=>{
    callback(null, lamdaResponse({msg:"people get Image",event, context}))
}
var people = require('./people')
var durationTypes = Joi.string().valid("day","week","month","hour")
exports.addSchema = {
    community_id: Joi.number().default(1),
    author_id: Joi.alternatives().try(Joi.string(),Joi.object().keys(people.addSchema)),
    title: Joi.string().required(),
    times_viewed: Joi.number().valid(0).default(0),
    language: Joi.string(),
    created_at:joiGetDate.date().now(),
    updated_at:joiGetDate.date().now(),
    description: Joi.string().required(),
    origin: Joi.string().required(),
    destination: Joi.string(),
    valid_until: Joi.string().isoDate(),
    delta: 0,
    open: 1,
    privacy: Joi.string().valid("private","public","unlisted").default('public'),
    comments_count: Joi.number(),
    category_id: Joi.number().valid(2,7,10,11,12),
    share_type_id: null,
    listing_shape_id: Joi.number(),
    price_cents: Joi.alternatives().try(Joi.number(),Joi.array().items(Joi.number())),
    currency: Joi.string().valid("CAD","USD"),
    unit_type: Joi.alternatives().try(durationTypes,Joi.array().items(durationTypes)),
    deleted: Joi.boolean().default(false),
    pickup_enabled: Joi.boolean().default(false),
    active:Joi.number().valid(0).default(0),
    location:Joi.object().keys({
        latitude:Joi.number().required(),
        longitude:Joi.number().required(),
        address:Joi.string().required(),
        google_address:Joi.string().required(),
        google_object:Joi.object()
    }).required()
}
exports.updateSchema =  {
    title: Joi.string(),
    times_viewed: Joi.number(),
    language: Joi.string(),
    updated_at:joiGetDate.date().now(),
    description: Joi.string(),
    origin: Joi.string(),
    destination: Joi.string(),
    valid_until: Joi.string().isoDate().default(new Date()),
    delta: 0,
    open: 1,
    privacy: Joi.string().valid("private","public","unlisted"),
    comments_count: Joi.number(),
    category_id: Joi.number().valid(2,7,10,11,12),
    share_type_id: null,
    listing_shape_id: Joi.number(),
    price_cents: Joi.alternatives().try(Joi.number(),Joi.array().items(Joi.number())),
    currency: Joi.string().valid("CAD","USD"),
    unit_type: Joi.alternatives().try(durationTypes,Joi.array().items(durationTypes)),
    deleted: Joi.boolean().default(false),
    pickup_enabled: Joi.boolean().default(false),
    location:Joi.object().keys({
        latitude:Joi.number().required(),
        longitude:Joi.number().required(),
        address:Joi.string().required(),
        google_address:Joi.string().required(),
        google_object:Joi.object()
    })
}
