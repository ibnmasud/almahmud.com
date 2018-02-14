var lamdaResponse = require('./lambdaResponse')

exports.add = (event, context, callback)=>{
    callback(null, lamdaResponse({msg:"listings create",event, context}))
}
exports.update = (event, context, callback)=>{
    callback(null, lamdaResponse({msg:"listings update",event, context}))
}
exports.getById = (event, context, callback)=>{
    //should be different for public and owner
    callback(null, lamdaResponse({msg:"listings getById",event, context}))
}