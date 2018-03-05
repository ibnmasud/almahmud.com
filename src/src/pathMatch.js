
var pathToRegexp = require('./pathToRegex');
var Boom = require('boom');

module.exports = function (options) {
  options = options || {};

  return function (path) {
    //console.log('route ->',path)
    var keys = [];
    var re = pathToRegexp(path, keys, options);
    //console.log('--',{path, keys, options})
    //console.log('-',re)
    return function (pathname, params) {
        //console.log('match ->',{pathname,params})
        //console.log('pathname', pathname, params)
      var m = re.exec(pathname);
      if (!m) return false;

      params = params || {};

      var key, param;
      for (var i = 0; i < keys.length; i++) {
        key = keys[i];
        param = m[i + 1];
        if (!param) continue;
        params[key.name] = decodeParam(param);
        if (key.repeat) params[key.name] = params[key.name].split(key.delimiter)
      }

      return params;
    }
  }
}

function decodeParam(param) {
  try {
    return decodeURIComponent(param);
  } catch (_) {
    throw Boom.badData('failed to decode param "' + param + '"');
  }
}