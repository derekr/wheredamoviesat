var path  = require('path');
var fours = require('fours')(process.env.FOURS_ID, process.env.FOURS_SECRET);

var express = require('express');
var app     = express();
var hbs     = require('express-hbs');

app.engine('html', hbs.express3({
  partialsDir: path.resolve(__dirname, '../lib/views/partials'),
  contentHelperName: 'content',
  extname: '.html'
}));

app.set('view engine', 'html');
app.set('views', path.resolve(__dirname, '../lib/views'));

app.use('/public', express.static(path.join(__dirname, '../lib/public')));

app.get('/', function (req, res){
  res.render('index', {
      title: 'Where Da Movies At',
      layout: '_layout'
    });
});

app.get('/fours/*', function (req, res) {
    fours({
        method: req.method,
        uri: req.url.replace(/\/fours/, '')
    }).pipe(res);
});

var port = process.env.PORT || 3000;
console.log('Starting wheredamoviesat on port ' + port);
app.listen(port);
