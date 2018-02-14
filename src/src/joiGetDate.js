var Joi = require('joi')
var validateJWT = require('./validateJWT')
var CONFIG = require('../config/config');

module.exports = Joi.extend((joi) => ({
    name: 'date',
    
    coerce(value, state, options) {
        return new Date().toISOString()
    },
    rules: [
        {
            name: 'now',
            validate(params, value, state, options) {
                return value; // Everything is OK
            }
        }
    ]
}));