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
	 * @param  {Integer} hours - The lifespan in hours for the cookie
	 */
	cookies.createCookie = function(name,value,hours) {
		var expires;
		if (hours) {
			var date = new Date();
			date.setTime(date.getTime()+(hours*60*60*1000));
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
	 * @param  {String} action - The value for the action attribute
	 * @param  {Object} payload - the data to be added to the form as inputs
	 * @return {Object} The form element created
	 */
	function _createForm(method, action, payload) {
		var form = window.document.createElement('form');
		form.method = method;
		form.action = action;
		form.id = 'socketeer';
		for(var key in payload) {
			if(payload.hasOwnProperty(key)) {
				form.appendChild(_createInput('hidden', key, payload[key]));
			}
		}
		return form;
	}


	var SOCKETEER_URL = 'http://localhost:1991';

	/**
	 * Generate a UUID string for the socketeer connection.

	 * @see http://stackoverflow.com/a/2117523/1383243
	 *
	 * @return {String} The UUID value
	 */
	function _generateUUID() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	}

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
			this.pageId = _generateUUID();
			cookies.createCookie('socketeer', this.pageId, 1);
		}

		this.socket = io.connect(SOCKETEER_URL);
	}

	/**
	 * Open a Socketeer page that returns the content of the given URL with the Socketeer wrapper.
	 * @param  {String} url - The URL to proxy
	 * @param  {Object} payload - The parameters to submit to socketeer
	 */
	Socketeer.prototype.openPage = function openPage(url, payload) {
		payload = payload || {};
		payload.url = url;
		payload.pageId = this.pageId;

		var form = _createForm('POST', SOCKETEER_URL, payload);
		form.target = '_blank';
		form.style.display = 'none';
		window.document.body.appendChild(form);
		form.submit();
	};

	/**
	 * Sends data via socket.io to the server to emit to the corresponding Socketeer page.
	 * @param  {Object} data - The data to emit to the Socketeer page
	 */
	Socketeer.prototype._send = function _send(data) {
		this.socket.emit(this.pageId, data);
	};

	/**
	 * Method to redirect to given URL.
	 * @param  {String} url - The URL to switch the socketeer page to
	 */
	Socketeer.prototype.redirect = function redirect(url) {
		var payload = {
			'redirect': url
		};
		this._send(payload);
	};

	/**
	 * Method to send form data to be submitted on the socketeer page.
	 * @param  {String} method - Method to use when submitting form. Defaults to POST
	 * @param  {String} action - The URL to submit the form data to
	 * @param  {Object} data   - The data to be submitted with the form
	 */
	Socketeer.prototype.form = function form(method, action, data) {
		data = data || {};
		var payload = {
			'form': {
				'method': method || 'POST',
				'action': action,
				'payload': data
			}
		};
		this._send(payload);
	};

	window.Socketeer = Socketeer;

}(window));
