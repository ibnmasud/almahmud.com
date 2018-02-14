'use strict';
const getJWTToken = require('./getJWTToken');

function attachToken(reply, value, type, auth, province, license) {
  var obj = {};
  if (province && license) {
    obj = {province: province, license: license};
  }
  var token = getJWTToken(auth, type, obj);
  if (typeof value === 'object') {
    value.token = token;
  }
  if (value && value.isBoom) {
    value.output.headers['Authorization'] = token;
    value.output.payload.token = token;
    reply(value);
  } else {
    reply(value).header('Authorization', token);
  }
  
}

module.exports = attachToken;
