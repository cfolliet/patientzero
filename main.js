const handler = require('serve-handler');
const http = require('http');
const getCauses = require('./causes.js');

const server = http.createServer((request, response) => {
    var url = request.url;
    if (url === '/api/getdata') {
        getCauses().then(data => {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.write(JSON.stringify(data));
            response.end();
        })
    } else {
        return handler(request, response, {
            "public": "public"
        });
    }
})

server.listen(5000, () => {
    console.log('Running at http://localhost:5000');
});