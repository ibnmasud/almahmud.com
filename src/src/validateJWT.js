'use strict';
var CONFIG = require('../config/config');
const Boom = require('boom');
var jwt = require('jsonwebtoken');

//var logger = require('./logger');

function authorizedJWT(type, request, reply) {
  logger.debug('authorizedJWT', JSON.stringify({type: CONFIG.JTW_TOKEN[type], auth: request.auth}));
  if (request.auth.isAuthenticated && (request.auth.credentials.type >= CONFIG.JTW_TOKEN[type]) && ((request.params && request.params.province === request.auth.credentials.province && request.params.license === request.auth.credentials.license) || request.auth.credentials.type === CONFIG.JTW_TOKEN.admin)) {
    return true;
  } else {
    reply(Boom.unauthorized());
    return false;
  }
}
function validateJWT(token){
  console.log('validateJWT', token)
  try{
    var notverified = jwt.decode(token, {complete: true})
    var kid = notverified.header.kid
    CONFIG.GOOGLE_KEYS[kid]
    //console.log('-----------notverified',notverified)
    var decoded = jwt.verify(token, CONFIG.GOOGLE_KEYS[kid]);
    return decoded
  }catch(e){
    console.log(e)
    return false;
  }
  
}
function firebaseTokenValidate(idToken, cb){
  admin.auth().verifyIdToken(idToken)
  .then(function(decodedToken) {
    var uid = decodedToken.uid;
    cb(null, decodedToken)
    // ...
  }).catch(function(error) {
    // Handle error
    cb(error)
  });
}
module.exports = validateJWT;
