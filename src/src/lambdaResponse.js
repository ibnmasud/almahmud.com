function lamdaResponse(json){
    if(json && json.isBoom){
        return {statusCode: json.output.statusCode,
            headers:{ "content-type":"application/json",
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'content-type',
            'Access-Control-Allow-Methods':	'OPTIONS,GET,POST'},
            body:JSON.stringify(json.output.payload)}
    }else{
        return {statusCode: 200,
            headers:{ "content-type":"application/json",
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'content-type',
            'Access-Control-Allow-Methods':	'OPTIONS,GET,POST'},
            body:JSON.stringify(json)}
    }
    
}
module.exports = lamdaResponse