/*jshint node:true */

'use strict';

var request = require('request');

module.exports = function (grunt) {
	var reloadPort = 35731, files;

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		develop: {
			server: {
				file: 'app.js'
			}
		},
		env: {
			options: {
				PORT: grunt.option('port') || 1991
			},
			production: {
				NODE_ENV: grunt.option('env') || 'production',
			},
			staging: {
				NODE_ENV: grunt.option('env') || 'staging',
			},
			development: {
				NODE_ENV: grunt.option('env') || 'development',
			}
		},
		watch: {
			options: {
				nospawn: true
			},
			server: {
				files: [
					'app.js',
					'routes/*.js'
				],
				tasks: ['develop']
			},
			js: {
				files: ['public/js/*.js']
			},
			css: {
				files: ['public/css/*.css']
			},
			jade: {
				files: ['views/*.jade']
			}
		}
	});

	grunt.config.requires('watch.server.files');
	files = grunt.config('watch.server.files');
	files = grunt.file.expand(files);

	grunt.loadNpmTasks('grunt-develop');
	grunt.loadNpmTasks('grunt-env');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['env', 'develop', 'watch']);
};
