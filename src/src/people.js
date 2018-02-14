var lamdaResponse = require('./lambdaResponse')
var getJWTToken = require('./getJWTToken')
exports.add = (event, context, callback)=>{
    callback(null, lamdaResponse({msg:"people create",event, context}))
}
exports.update = (event, context, callback)=>{
    callback(null, lamdaResponse({msg:"people update",event, context}))
}
exports.getById = (event, context, callback)=>{
    //should be different for public and owner
    callback(null, lamdaResponse({msg:"people getById",event, context, token:getJWTToken(null, 'web',{})}))
}
exports.getByIdPublic = (event, context, callback)=>{
    //should be different for public and owner
    callback(null, lamdaResponse({msg:"people getByIdPublic",event, context, token:getJWTToken(null, 'web',{})}))
}