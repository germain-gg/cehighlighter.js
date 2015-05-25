module.exports = function(grunt) {

	grunt.initConfig({
	  pkg: grunt.file.readJSON('package.json'),
	  jasmine: {
	    cehighlighter: {
	      src: 'cehighlighter.js',
	      options: {
	        specs: 'tests/*-spec.js',
	        outfile: 'tests/_SpecRunner.html',
	        keepRunner: true
	      }
	    }
	  },
	  uglify: {
	  	dist: {
	      options: {
	        banner: '/**\n * <%= pkg.name %> - v<%= pkg.version %> (<%= grunt.template.today("dd/mm/yyyy") %>) \n * Author: <%= pkg.author %>'
	        	  + '\n**/\n\n'
	      },
	      files: {
	      	'dist/cehighlighter.min.js': ['cehighlighter.js']
	      }
	    }
	  }
	});

	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['jasmine', 'uglify']);
	grunt.registerTask('test', ['jasmine']);
};
