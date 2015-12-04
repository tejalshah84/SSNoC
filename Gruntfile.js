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
        }
    });

    // Load the plugin that provides the "uglify" task.
    // grunt.loadNpmTasks('grunt-mocha'); Client Side testing
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-mocha-istanbul');

    // Default task(s).
    grunt.registerTask('default', ['mochaTest:local', 'mocha_istanbul']);

    //Test
    grunt.registerTask('test', ['mochaTest:local','mocha_istanbul']);

    // Shippable
    grunt.registerTask('shippable', ['mochaTest:shippable', 'mocha_istanbul']);

    //Coverage
    grunt.registerTask('coverage', ['mocha_istanbul']);


};