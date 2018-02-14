const HapiLambdaHandler = require('@tepez/hapi-lambda-handler');
const Hapi = require('hapi')
var server = new Hapi.Server();
server.connection({});
server.route({
    method: 'GET',
    path: '/health',
    handler: (request, reply) => reply({ status: 'ok' })
});
function lamdaResponse(json){
  return {statusCode: 200,
      headers:{ "content-type":"application/json"},
      body:JSON.stringify(json)}
}
var rootPath = '/hello'
var hh = HapiLambdaHandler.handlerFromServer(server);
exports.handler = (event, context, callback)=>{
  console.log("",event)
  event.path = event.path.split(rootPath)[1]
  callback(null,lamdaResponse( event))
  //hh(event, context, callback);
}