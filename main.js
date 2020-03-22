const handler = require('serve-handler');
const http = require('http');
const url = require('url');
const getCauses = require('./causes.js');

const server = http.createServer((request, response) => {
    const uri = url.parse(request.url, true);
    if (uri.pathname === '/api/getdata') {
        const workingDir = uri.query['workingDir'];
        const host = uri.query['host'];
        const email = uri.query['email'];
        const token = uri.query['token'];
        const since = uri.query['since'];
        const boardId = uri.query['boardId'];
        const projectKey = uri.query['projectKey'];
        const keyFormat = uri.query['keyFormat'];
        getCauses(workingDir, host, email, token, since, boardId, projectKey, keyFormat).then(data => {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify(data));
            response.end();
        }).catch(error => {
            let message = 'An error occured';
            let parsedError = JSON.parse(error);
            if(parsedError.body.message) {
                message = parsedError.body.message;
            } else if(parsedError.body.errors){
                message = parsedError.body.errors;
            }
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify(message));
            response.end();
        });
    } else {
        return handler(request, response, {
            "public": "public"
        });
    }
})

server.listen(5000, () => {
    console.log('Running at http://localhost:5000');
});