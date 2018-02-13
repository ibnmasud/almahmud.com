const Boom = require('boom');
const LambdaRouter = require('serverless-lambda-router');
 
// Create a router instance 
const router = new LambdaRouter({
  // Headers to be attached to response payload 
  headers: {
    'Cache-Control': 'max-age=0, private, no-cache, no-store'
  },
  // Function to be notified before route invoke 
  onInvoke: event => {},
  // Function to be notified when route throws 
  onError: (err, event) => {}
});
 
// Register handlers 
router.get('/foo', async (event, context) => {
 
  // To deliver a response, return a Promise and resolve with your 
  // intended payload.  If using async / wait, you can simply return the payload. 
  return {
    foo: 'bar'
  };
});
 
router.get('/bar', async (event, context) => {
 
  // To deliver a response, return a Promise and throw an error. 
  // If using async / wait, you can simply throw the error. 
  throw Boom.notFound('Resource not found');
});
 
// Multiple handlers can be registered for a given route. 
// Handlers may communicate via `context.state`, and the result of the final 
// handler determines the response. 
router.get('/baz', async (event, context) => {
  context.state.name = 'John Smith';
}, async (event, context) => {
  return {
    name: context.state.name
  };
});
 
// Export the handler 
exports.handler = router.handler();