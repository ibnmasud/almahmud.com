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
  console.log('validateJWT')
  try{
    var decoded = jwt.verify(token, CONFIG.PUBLIC_KEY);
    return decoded
  }catch(e){
    console.log(e)
    return false;
  }
  
}
module.exports = validateJWT;
