module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mochaTest: {
          local: {
            options: {
              reporter: 'spec',
              //captureFile: 'results.txt', // Optionally capture the reporter output to a file
              quiet: false, // Optionally suppress output to standard out (defaults to false)
              clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
              ui: 'tdd'
            },
            src: ['test/**/*.js']
          },
          shippable: {
            options: {
              reporter: 'mocha-junit-reporter',
              reporterOptions: {
                mochaFile: 'shippable/testresults/result.xml'
              },
              ui: 'tdd'
            },
            src: ['test/**/*.js']
          },

        },
        mocha_istanbul: {
            coverage: {
                src: 'test', // a folder works nicely
                options: {
                    mochaOptions: ['--ui', 'tdd'] // any extra options for mocha
                }
            }
        },
				jshint: {
				          files: ['controllers/*.js', 'models/*.js'],
				            options: {
				               globalstrict: true,
				              // options here to override JSHint defaults
				              globals: {
				                jQuery: true,
				                console: false,
				                module: false,
				                document: true,
				                global: false,
				                require: false,
				                node: true,
				                strict: false,
				                process: false,
				                exports: false,
				                __dirname: false
				              }
				            }
				        }
    });

    // Load the plugin that provides the "uglify" task.
    // grunt.loadNpmTasks('grunt-mocha'); Client Side testing
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
		 grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task(s).
    grunt.registerTask('default', ['mochaTest:local', 'mocha_istanbul', 'jshint']);

    //Test
    grunt.registerTask('test', ['mochaTest:local','mocha_istanbul', 'jshint']);

    // Shippable
    grunt.registerTask('shippable', ['mochaTest:shippable', 'mocha_istanbul']);

    //Coverage
    grunt.registerTask('coverage', ['mocha_istanbul']);


};