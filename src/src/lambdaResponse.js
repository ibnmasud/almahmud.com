function lamdaResponse(json){
    if(json && json.isBoom){
        return {statusCode: json.output.statusCode,
            headers:{ "content-type":"application/json"},
            body:JSON.stringify(json.output.payload)}
    }else{
        return {statusCode: 200,
            headers:{ "content-type":"application/json"},
            body:JSON.stringify(json)}
    }
    
}
module.exports = lamdaResponse