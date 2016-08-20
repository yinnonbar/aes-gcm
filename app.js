/**
 * Created by Yinnon Bratspiess on 18/08/2016.
 */
/**
 * a web server receiving requests.
 * if the requests are routed to /encrypt with method post then encrypting the body using aes-gcm and the response body
 * is a pair of the ciphertext and the key used for encrypting.
 */

var gcm = require('./gcm');
var http = require('http');
var PORT = 8080;

http.createServer(function(request, response) {
    var headers = request.headers;
    var method = request.method;
    var url = request.url;
    var body = [];
    //case of error on http request
    request.on('error', function(err) {
        console.error(err);
    //case of receiving data
    }).on('data', function(chunk) {
        body.push(chunk);
    }).on('end', function() {
        body = Buffer.concat(body).toString();
        //creating the encrypted data from http request's body
        var encrypted = gcm.encrypt(body);
        var resBody;
        //if routing is from /encrypt and the method is post then create the response's body with the ciphertext
        //and the key, else send nothing
        if (request.url.indexOf('/encrypt') > -1 && request.method === 'POST'){
            resBody = {ciphertext : encrypted.content, key : gcm.getKey()
            };
        } else {
            resBody = '';
        }

        response.on('error', function(err) {
            console.error(err);
        });

        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');

        var responseBody = {
            headers: headers,
            method: method,
            url: url,
            body: resBody
        };
        response.write(JSON.stringify(responseBody));
        response.end();
    });
}).listen(PORT,function (){
    console.log('listening on ' + PORT);
});