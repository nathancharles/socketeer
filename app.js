/*jshint devel:true, node:true */
/*globals unescape */
'use strict';

/**
 * Module dependencies.
 */

var express = require('express'),
	request = require('request'),
	socketio = require('socket.io'),
	socketioMiddleware = require('socketio-wildcard')(),
	routes = require('./routes'),
	http = require('http'),
	path = require('path');

var app = express();

app.configure(function() {
	app.set('port', process.env.PORT);
	app.set('secure port', parseInt(app.get('port'), 10) + 1);

	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');

	app.use(express.favicon());

	app.use(express.logger(function(tokens, req, res) {
		var status = res.statusCode,
			color = 32,
			now = new Date();

		if (status >= 500) { color = 31; }
		else if (status >= 400) { color = 33; }
		else if (status >= 300) { color = 36; }

		return '\x1b[90m' + now.getMonth() + '/' + now.getDate() + '/' + now.getYear() + ' ' + now.toLocaleTimeString() + ' -' +
			' ' + req.method +
			' ' + req.originalUrl + ' ' +
			'\x1b[' + color + 'm' + res.statusCode +
			' \x1b[90m' +
			(new Date() - req._startTime) +
			'ms' + '\x1b[0m';
	}));

	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.methodOverride());

	app.use(app.router);

	app.use(express.responseTime());
	app.use(express.static(path.join(__dirname, 'public')));

	function getHostFromCookies(req){
		var re = new RegExp('host=([^;]+)');
		var value = re.exec(req.headers.cookie);
		return (value !== null) ? unescape(value[1]) : null;
	}

	// Middleware to check host cookie and use it for relative requests
	app.use(function(req, res, next) {
		var host = (getHostFromCookies(req) || '').replace('?','');
		var path = (req.url || '').replace(/^\/id\//,'/');
		console.log(host+path);
		request(host+path).pipe(res);
	});
});

/**
 * Routes
 */

// Set CORS so we can post from other local dev sites on different ports
// TODO: maintain a list of allowed domains?
// @see http://stackoverflow.com/questions/1653308/access-control-allow-origin-multiple-origin-domains

// http://enable-cors.org/server_expressjs.html
app.all('*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,POST');
	res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
	next();
});

app.post('/', routes.socketeerProxy);

app.get('/routes', function(req, res) {
	res.render('routes', { routes: app.routes });
});

/**
 * Run the servers (HTTP/S)
 */

var server = http.createServer(app).listen(app.get('port'), function () {
	console.log('\nSocketeer is soaring on port ' + app.get('port'));
});


// TODO: Use namespaced connections for each page opened
var io = socketio.listen(server);
io.configure(function () {
	io.set('transports', [
		'websocket',
		'flashsocket',
		'htmlfile',
		'xhr-polling',
		'jsonp-polling'
	]);
});

io.sockets.on('connection', function(socket) {
	socket.on('socketeer', function(socketData) {
		var channel = socketData.id;
		io.sockets.emit(channel, socketData);
	});
});
