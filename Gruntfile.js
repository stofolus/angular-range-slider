module.exports = function(grunt) {
    var BANNER =
    '/**\n' +
    '* <%= pkg.name %> v<%= pkg.version %> \n' +
    '* Built: <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> \n' +
    '* Christoffer Hasselberg stofolus@gmail.com \n' +
    '* Released under the MIT license \n' +
	' */ \n' +
	'\n\n';


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
			default: {
                options: {
    				banner: BANNER
    			},
                files: {
                    'distribute/slider.js': ['src/js/slider.js'],
                    'distribute/slider.css': ['distribute/slider.css'],
                    'distribute/slider.min.css': ['distribute/slider.min.css'],
                }
			}
        },
        uglify: {
			default: {
				options: {
					banner: BANNER
				},
				files: {
					'distribute/slider.min.js': 'distribute/slider.js'
				}
			}
		},
        sass: {
            default: {
                files: {
                    'distribute/slider.css': 'src/scss/slider.scss'
                }
            }
        },
        cssmin: {
			default: {
				files: {
					'distribute/slider.min.css': 'distribute/slider.css'
				}
			}
		},

        clean: ['distribute']

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['clean', 'sass', 'cssmin', 'concat', 'uglify']);

};
