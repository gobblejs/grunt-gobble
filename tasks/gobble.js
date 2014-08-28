/*
 * grunt-gobble
 * http://gobble.technology
 *
 * Copyright (c) 2014 Rich Harris
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	grunt.registerMultiTask( 'gobble', 'The last build tool you\'ll ever need', function () {

		var done = this.async(),
			path = require( 'path' ),
			node,
			task;

		if ( this.data.environment ) {
			process.env.GOBBLE_ENV = this.data.environment;
		}

		if ( this.data.config ) {
			if ( typeof this.data.config === 'string' ) {
				node = require( path.resolve( this.data.config ) );
			} else if ( typeof this.data.config === 'function' ) {
				node = this.data.config();
			} else {
				throw new Error( 'The grunt-gobble config option, if specified, must be a function that returns a gobble node or a string (path to a build definition)' );
			}
		} else {
			node = require( path.resolve( 'gobblefile.js' ) );
		}

		if ( this.args[0] === 'serve' ) {
			task = node.serve({
				port: this.data.port || 4567,
				gobbledir: this.data.gobbledir
			});
		}

		else {
			if ( !this.data.dest ) {
				grunt.fatal( 'You must specify a destination directory, e.g. `dest: "output"`' );
			}

			task = node.build({
				dest: this.data.dest,
				gobbledir: this.data.gobbledir
			});

			task.then( done );
		}

		task.on( 'info', grunt.log.ok );
		task.on( 'warning', grunt.log.debug );
		task.on( 'error', grunt.fatal );

	});

};
