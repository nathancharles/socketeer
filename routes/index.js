/*jshint devel:true, node:true */

var request = require('request');

/*
 * GET home page.
 */

// GET
exports.test = function(req, res) {
	//modify the url in any way you want
	var newurl = 'http://www.nathancharles.net/';
	res.cookie('host', newurl);
	request(newurl).pipe(res);
};
