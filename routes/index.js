/*jshint devel:true, node:true */

var request = require('request'),
	url = require('url');

var SCRIPTS = [
'<script type="text/javascript" src="https://cdn.socket.io/socket.io-1.0.4.js"></script>',
'<script type="text/javascript" src="http://localhost:1991/scripts/socketeer-server.js"></script>'
];

/*
 * GET home page.
 */

// GET
exports.socketeerProxy = function socketeerProxy(req, res) {
	var proxyUrl = req.cookies.host;
	if(req.body.url) {
		var tempUrl = url.parse(req.body.url);
		var proxyUrl = req.body.url;
		res.cookie('host', tempUrl.protocol + '//' + tempUrl.host);
	}
	
	var queryParams = Object.keys(req.body).map(function(value) {
		return value + '=' + req.body[value];
	}).join('&');
	proxyUrl = proxyUrl + '?' + queryParams;
	
	var x = request(proxyUrl, function(error, response, body){
		var html = response.body.replace('</head>', function(match) {
			return SCRIPTS.join('') + match;
		});
		res.send(html);
	});
};
