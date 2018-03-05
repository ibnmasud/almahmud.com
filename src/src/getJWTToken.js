var CONFIG = require('../config/config');
const fs = require('fs');
var jwt = require('jsonwebtoken');
function getJWTToken(auth, type, obj) {
  if (auth && CONFIG.JTW_TOKEN[type] === auth.type) {
    return auth.token;
  } else {
    obj.type = CONFIG.JTW_TOKEN[type];
    //console.log("------->",CONFIG.JTW_TOKEN[type])
    var token = jwt.sign(
      obj,
      CONFIG.PRIVATE_KEY,
      { 
        algorithm: 'RS256',
        expiresIn: CONFIG.WEB_TOKEN_EXPIERY[type]
      }
    );
  }
  
  return token;
}
module.exports = getJWTToken;
