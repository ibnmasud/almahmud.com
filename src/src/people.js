var lamdaResponse = require('./lambdaResponse')
var getJWTToken = require('./getJWTToken')
var Joi = require('joi')
const joiGetDate = require('./joiGetDate')

exports.add = (event, context, callback)=>{
    callback(null, lamdaResponse({msg:"people create",event, context}))
}
exports.update = (event, context, callback)=>{
    callback(null, lamdaResponse({msg:"people update",event, context}))
}
exports.updateImage = (event, context, callback)=>{
    callback(null, lamdaResponse({msg:"people update Image",event, context}))
}
exports.getImage = (event, context, callback)=>{
    callback(null, lamdaResponse({msg:"people get Image",event, context}))
}
exports.getById = (event, context, callback)=>{
    //should be different for public and owner
    callback(null, lamdaResponse({msg:"people getById",event, context, token:getJWTToken(null, 'web',{})}))
}
exports.getByIdPublic = (event, context, callback)=>{
    //should be different for public and owner
    callback(null, lamdaResponse({msg:"people getByIdPublic",event, context, token:getJWTToken(null, 'web',{})}))
}
exports.addSchema = {
    created_at:joiGetDate.date().now(),
    updated_at:joiGetDate.date().now(),
    locale:Joi.string().valid("en","fr").default('en'),
    active:Joi.number().valid(0).default(0),
    username:Joi.string(),
    email:Joi.string().email(),
    encrypted_password:Joi.string().min(8),
    reset_password_token:Joi.string(),
    given_name:Joi.string(),
    family_name:Joi.string().required(),
    phone_number:Joi.number().required(),
    description:Joi.string(),
    facebook_id:Joi.string(),
    is_organization:Joi.boolean(),
    organization_name:Joi.string(),
}
exports.updateSchema = {
    updated_at:joiGetDate.date().now(),
    locale:Joi.string().valid("en","fr"),
    active:Joi.number().valid(0).default(0),
    username:Joi.string(),
    email:Joi.string().email(),
    encrypted_password:Joi.string().min(8),
    reset_password_token:Joi.string(),
    given_name:Joi.string(),
    family_name:Joi.string(),
    description:Joi.string(),
    facebook_id:Joi.string(),
    is_organization:Joi.boolean(),
    organization_name:Joi.string(),
}
