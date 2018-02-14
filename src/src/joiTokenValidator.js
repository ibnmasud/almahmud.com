var Joi = require('joi')
var validateJWT = require('./validateJWT')
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
                if (!value || CONFIG.JTW_TOKEN[params.q] !== value.type) {
                    // Generate an error, state and options need to be passed
                    return this.createError('token.jwt', { v: value }, state, options);
                }
                return value; // Everything is OK
            }
        }
    ]
}));