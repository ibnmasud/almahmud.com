var Joi = require('joi')
var validateJWT = require('./validateJWT')
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
            validate(params, value, state, options) {
                console.log('validate',value)
                if (!value) {
                    // Generate an error, state and options need to be passed
                    return this.createError('token.jwt', { v: value }, state, options);
                }
                return value; // Everything is OK
            }
        }
    ]
}));