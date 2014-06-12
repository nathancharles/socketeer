/*jshint devel:true, node:true */

var request = require('request');

var SCRIPTS = [
'<script type="text/javascript" src="https://cdn.socket.io/socket.io-1.0.4.js"></script>',
'<script type="text/javascript" src="http://localhost:1991/scripts/socketeer-server.js"></script>'
];

/*
 * GET home page.
 */

// GET
exports.socketeerProxy = function socketeerProxy(req, res) {
	var newurl = req.query.url;
	res.cookie('host', newurl);
	var x = request(newurl, function(){
		buff = buff.replace('</head>', function(match) {
			return SCRIPTS.join('') + match;
		});
		res.send(buff);
	});

	var buff = '';

	x.on('data', function (chunk) {
		buff = buff + chunk.toString();
	});
};
