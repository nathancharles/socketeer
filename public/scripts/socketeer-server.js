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
			self.handleData(data);
		});
	}

	/**
	 * Function to create an input
	 * @param  {String} type - The value for the type attribute
	 * @param  {String} name - The value for the name attribute
	 * @param  {String} value - The value for the value attribute
	 * @return {Object} The input element created
	 */
	function _createInput(type, name, value) {
		var input = window.document.createElement('input');
		input.type = type;
		input.name = name;
		input.value = value;
		return input;
	}

	/**
	 * Function to create a form.
	 * @param  {String} method - The value for the method attribute
	 * @param  {String} url - The value for the action attribute
	 * @param  {Object} payload - the data to be added to the form as inputs
	 * @return {Object} The form element created
	 */
	function _createForm(method, url, payload) {
		var form = window.document.createElement('form');
		form.method = method;
		form.action = url;
		form.id = 'socketeer';
		for(var key in payload) {
			if(payload.hasOwnProperty(key)) {
				form.appendChild(_createInput('hidden', key, payload[key]));
			}
		}
		return form;
	}

	/**
	 * Method to change the URL of the page.
	 * @param  {String} url - The URL to update to
	 */
	function _redirectUrl(url) {
		window.location = url;
	}

	/**
	 * Function to create and submit a form.
	 * @param  {String} method - The method to use for the form
	 * @param  {String} url - The URL to submit the form to
	 * @param  {Object} payload - the data to submit with the form
	 */
	function _submitForm(method, url, payload) {
		_createForm(method, url, payload).submit();
	}

	/**
	 * Performs the appropriate action based on the data emitted.
	 * @param  {Object} data - The data emitted by the controlling page.
	 */
	Socketeer.prototype.handleData = function handleData(data) {
		switch(true) {
			case data.hasOwnProperty('redirect'):
				_redirectUrl(data.redirect);
				break;
			case data.hasOwnProperty('form'):
				_submitForm((data.form.method || 'POST'), data.form.url, data.form.payload);
				break;
			default:
				console.log(data);
		}
	};

	window.Socketeer = new Socketeer();

}(window));
