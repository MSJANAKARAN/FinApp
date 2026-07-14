let http = require('http');
let logger = require('./logger');
const server = http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('Hello World!');
});
console.log('All arguments:', process);

server.listen(8080);