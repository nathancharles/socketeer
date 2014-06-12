(function(window, undefined) {

	/**
	 * Utility functions to create, read and erase cookies.
	 * @type {Object}
	 */
	var cookies = {};

	/**
	 * Create a cookie.
	 * @param  {String} name - The name of the cookie
	 * @param  {String} value - The value to be stored in the cookie
	 * @param  {Integer} days - The lifespan in days for the cookie
	 */
	cookies.createCookie = function(name,value,days) {
		var expires;
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			expires = "; expires="+date.toGMTString();
		}
		else expires = "";
		window.document.cookie = name+"="+value+expires+"; path=/";
	};

	/**
	 * Read the value of a cookie.
	 * @param  {String} name - The name of the cookie to get the value of.
	 * @return {String} The value of the cookie or null if it doesn't exist
	 */
	cookies.readCookie = function(name) {
		var nameEQ = name + "=";
		var ca = window.document.cookie.split(';');
		for(var i=0;i < ca.length;i += 1) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	};

	/**
	 * Erase a cookie.
	 * @param  {String} name - The name of the cookie to erase
	 */
	cookies.eraseCookie = function(name) {
		cookies.createCookie(name,"",-1);
	};


	// Set the URL to the current window Host
	var SOCKETEER_URL = window.location.protocol + '//' + window.location.host;

	/**
	 * @constructor
	 * Creates Socketeer object.
	 * If socket.io is not included, it will throw an error.
	 * Checks the current URL for pageId and stores it.
	 * Sets up the socket.io connection.
	 */
	function Socketeer() {
		var self = this;
		if(!window.io) {
			throw new Error('Socket.io is required to use Socketeer.');
		}

		// self.pageId = window.location.pathname.split('/').slice(-1)[0];
		self.pageId = 5;

		self.socket = io.connect(SOCKETEER_URL);

		self.socket.on(self.pageId, function(data) {
			console.log(data);
			self.handleData(data);
		});
	}

	Socketeer.prototype.handleData = function handleData(data) {
		if(data.url) {
			window.location = data.url;
		} else {
			alert('Hello There');
		}
	};

	window.Socketeer = new Socketeer();

}(window));
