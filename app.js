require("@babel/register")({
  presets: ["@babel/preset-env"]
});
require("@babel/polyfill");

var express = require('express')
var bodyParser = require('body-parser');

var app = express()

var index = require('./routes/index')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', index)

app.use(function (req, res, next) {
  res.status(404).send('Sorry cant find that!')
})

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(3000, function(){
    console.log('Example application listening on port 3000!')
})