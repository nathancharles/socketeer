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


	var SOCKETEER_URL = 'http://localhost:1991';

	/**
	 * @constructor
	 * Creates Socketeer object.
	 * If socket.io is not included, it will throw an error.
	 * Checks for a pageId, creates and stores pageId if it doesn't exist.
	 * Sets up the socket.io connection.
	 */
	function Socketeer() {
		if(!window.io) {
			throw new Error('Socket.io is required to use Socketeer.');
		}

		this.pageId = cookies.readCookie('socketeer');

		if(!this.pageId) {
			this.pageId = 5;
			cookies.createCookie('socketeer', this.pageId);
		}

		this.socket = io.connect(SOCKETEER_URL);
	}

	/**
	 * Open a Socketeer page that returns the content of the given URL with the Socketeer wrapper.
	 * @param  {String} url - The URL to proxy
	 * @param  {Object} params - The parameters to pass
	 */
	Socketeer.prototype.openPage = function openPage(newurl, params) {
		url = url + '?';
		for(var key in params) {
			if(params.hasOwnProperty(key)) {
				url = url + key + '=' + params[key] + '&';
			}
		}

		var windowUrl = SOCKETEER_URL + '/' + this.pageId + '?url=' + url;

		window.open(sUrl, 'Socketeer', 'resizable,scrollbars,status');
	};

	/**
	 * Sends data via socket.io to the server to emit to the corresponding Socketeer page.
	 * @param  {Object} data - The data to emit to the Socketeer page
	 */
	Socketeer.prototype.send = function send(data) {
		this.socket.emit(this.pageId, data);
	};

	window.Socketeer = Socketeer;

}(window));