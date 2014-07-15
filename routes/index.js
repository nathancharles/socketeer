/*jshint devel:true, node:true */

var request = require('request'),
	url = require('url');

var CONTENT_TO_INJECT = [
'<script type="text/javascript" src="https://cdn.socket.io/socket.io-1.0.4.js"></script>',
'<script type="text/javascript" src="http://localhost:1991/scripts/socketeer-server.js"></script>'
];

// POST
exports.socketeerProxy = function socketeerProxy(req, res) {
	var proxyUrl = req.cookies.host;
	if(req.body.url) {
		var tempUrl = url.parse(req.body.url);
		proxyUrl = req.body.url;
		res.cookie('host', tempUrl.protocol + '//' + tempUrl.host);
	}
	if(req.body.pageId) {
		res.cookie('pageId', req.body.pageId);
	}

	// Add payload as query parameters
	var queryParams = Object.keys(req.body).map(function(value) {
		return value + '=' + req.body[value];
	}).join('&');
	proxyUrl = proxyUrl + '?' + queryParams;

	request(proxyUrl, function(error, response, body){
		var html = response.body.replace('</head>', function(match) {
			return CONTENT_TO_INJECT.join('') + match;
		});
		res.send(html);
	});
};
