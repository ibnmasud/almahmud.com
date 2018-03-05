var Joi = require('joi')
var validateJWT = require('./validateJWT')
var validateJWTUnsecured = require('./validateJWT').validateJWTUnsecured
var CONFIG = require('../config/config');

module.exports = Joi.extend((joi) => ({
    name: 'token',
    language: {
        jwt: 'not valid JWT token.'
    },
    coerce(value, state, options) {
        return validateJWT(value)
    },
    rules: [
        {
            name: 'jwt',
            params: {
                q: joi.string().default('web')
            },
            validate(params, value, state, options) {
                console.log('validate',{value,params})
                if (!value || value.iss !== CONFIG.ISS) {
                    // Generate an error, state and options need to be passed
                    return this.createError('token.jwt', { v: value }, state, options);
                }
                return value; // Everything is OK
            }
        }
    ]
}));
exports.Unsecured = Joi.extend((joi) => ({
    name: 'token',
    language: {
        jwt: 'not valid JWT token.'
    },
    coerce(value, state, options) {
        return validateJWTUnsecured(value)
    },
    rules: [
        {
            name: 'jwt',
            params: {
                q: joi.string().default('web')
            },
            validate(params, value, state, options) {
                console.log('validate',{value,params})
                if (!value || value.iss !== CONFIG.ISS) {
                    // Generate an error, state and options need to be passed
                    return this.createError('token.jwt', { v: value }, state, options);
                }
                return value; // Everything is OK
            }
        }
    ]
}));
