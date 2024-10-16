// Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var comments = [];

var server = http.createServer(function(req, res){
  var urlObj = url.parse(req.url, true);
  var pathname = urlObj.pathname;
  if(pathname == '/'){
    fs.readFile('./views/index.html', function(err, data){
      if(err){
        console.log(err);
        res.end('404 Not Found');
      }else{
        var htmlStr = template('index.html', comments);
        res.end(htmlStr);
      }
    });
  }else if(pathname == '/post'){
    fs.readFile('./views/post.html', function(err, data){
      if(err){
        console.log(err);
        res.end('404 Not Found');
      }else{
        res.end(data);
      }
    });
  }else if(pathname.indexOf('/public/') === 0){
    fs.readFile('.'+pathname, function(err, data){
      if(err){
        console.log(err);
        res.end('404 Not Found');
      }else{
        res.end(data);
      }
    });
  }else if(pathname == '/comment'){
    var comment = urlObj.query;
    comment.dateTime = '2017-09-10';
    comments.unshift(comment);
    res.statusCode = 302;
    res.setHeader('Location', '/');
    res.end();
  }else{
    fs.readFile('./views/404.html', function(err, data){
      if(err){
        console.log(err);
        res.end('404 Not Found');
      }else{
        res.end(data);
      }
    });
  }
});

server.listen(3000, function(){
  console.log('server is running...');
});

function template(file, data){
  var htmlStr = fs.readFileSync('./views/'+file).toString();
  var html = htmlStr.replace('@@', function(){
    var html = '';
    for(var i=0; i<data.length; i++){
      html += '<li>'+data[i].name+':'+data[i].message+'<small>'+data[i].dateTime+'</small></li>';
    }
    return html;
  });
  return html;
}