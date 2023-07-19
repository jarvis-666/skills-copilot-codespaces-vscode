// Create web server
// run: sudo node comments.js
// http://localhost:8080
// http://localhost:8080/comments

// Load modules
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

var message = [
  {name: 'John', message: 'Hello'},
  {name: 'Jack', message: 'Hi'},
  {name: 'Jane', message: 'Good morning'}
];

// Create web server
var server = http.createServer(function(request, response){
  var parsedUrl = url.parse(request.url);
  var resource = parsedUrl.pathname;

  if(resource == '/'){
    var html = fs.readFileSync('restFront.html', 'utf8');
    html = html.replace(/\$message/g, message.join('</li><li>'));
    response.writeHead(200, {'Content-Type':'text/html'});
    response.end(html);
  } else if(resource == '/comments'){
    if(request.method == 'POST'){
      console.log('POST request');
      request.on('data', function(data){
        var text = qs.parse(data.toString());
        message.push({name: text.name, message: text.message});
        console.log('text: ', text);
      });
      response.writeHead(302, {'Location': '/'});
      response.end();
    } else if(request.method == 'GET'){
      console.log('GET request');
      var json = JSON.stringify(message);
      response.writeHead(200, {'Content-Type':'application/json'});
      response.end(json);
    }
  } else {
    response.writeHead(404, {'Content-Type':'text/html'});
    response.end('404 Page Not Found');
  }
});

// Start web server
server.listen(8080, function(){
  console.log('Server running at http://