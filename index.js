const http = require('http');

const server = http.createServer(function(request,response){
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end("<h1>Привет, октагон!</h1>");
});

server.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
});