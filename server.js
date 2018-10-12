var compression = require('compression');
var helmet = require('helmet');

var express = require('express'),
  app = express(),
  port = process.env.PORT || 8888,
  bodyParser = require('body-parser');

app.use(compression());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./module/routes/Routes');
routes(app);

// app.listen(port);
var server = app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});