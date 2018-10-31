var compression = require('compression');
var helmet = require('helmet');
// var swaggerUi = require('swagger-ui-express'),
    // swaggerDocument = require('./swagger.json');

var express = require('express'),
  app = express(),
  port = process.env.PORT || 9876,
  bodyParser = require('body-parser');

app.use(compression());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./module/routes/Routes');
routes(app);
// app.use('/', routes);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// app.listen(port);
var server = app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});