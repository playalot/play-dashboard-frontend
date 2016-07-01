'use strict';

var livereload = require('connect-livereload'),
    path = require('path');

module.exports = function (grunt) {

  // show elapsed time at the end
  require('time-grunt')(grunt);

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project settings
  var yeomanConfig = {
      app: require('./bower.json').appPath || 'app',
      dist: 'dist'
  };

  grunt.initConfig({
      yeoman: yeomanConfig,
      connect: {
          options: {
            port: 3000,
            hostname: '0.0.0.0' //change to 'localhost' to disable outside connections
          },
          livereload: {
            options: {
              middleware: function (connect) {
                return [
                  livereload({port: 35729}),
                  connect.static(path.resolve('.tmp')),
                  connect.static(path.resolve(yeomanConfig.app))
                ];
              }
            }
          }
      },
      watch: {
        options: {
          livereload: 35729
        },
        less: {
          files: ['app/less/*.less'],
          tasks: ['less:dev']
        },
        gruntfile: {
          files: ['Gruntfile.js']
        },
        livereload: {
          options: {
            livereload: '<%= connect.options.livereload %>'
          },
          files: [
            '<%= yeoman.app %>/{,*/}*.html',
            '.tmp/styles/{,*/}*.css',
            '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
          ]
        },
        react: {
          files: ['<%= yeoman.app %>/scripts/**/*.{jsx,js}'],
          tasks: ['browserify:dist'],
          options: {
            livereload: true
          }
        },
        images: {
          files: [
            '<%= yeoman.app %>/*.html',
            '<%= yeoman.app %>/images/{,*/}*.{ico,icon,png,jpg,jpeg,gif,webp,svg}'
          ]
        }
      },
      clean: {
        dist: ['.tmp', '<%= yeoman.dist %>/*'],
        serve: '.tmp'
      },
      less: {
        dev: {
          options: {
            compress: true,
            paths: ['app/vendor/bootstrap/less', 'app/styles']
          },
          files: {
              'app/styles/main.css': 'app/less/main.less'
          }
        }
      },
      browserify: {
        options: {
          transform: [
             [ 'reactify', {'es6': true} ]
          ]
        },
        dist: {
          files: {
            '.tmp/scripts/bundle/app.js': '<%= yeoman.app %>/scripts/app.js'
          },
          options: {
            browserifyOptions: {
              extensions: '.jsx'
            },
            transform: [
              ['babelify', {
              }]
           ]
          }
        }
      },
      useminPrepare: {
        src: '<%= yeoman.app %>/index.html',
        options: {
            dest: '<%= yeoman.dist %>'
        }
      },
      imagemin: {
        dist: {
          files: [{
            expand: true,
            cwd: '<%= yeoman.app %>/images',
            src: '{,*/}*.{png,jpg,jpeg}',
            dest: '<%= yeoman.dist %>/images'
          }]
        }
      },
      htmlmin: {
        dist: {
          options: {
            //removeCommentsFromCDATA: true,
            // https://github.com/yeoman/grunt-usemin/issues/44
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            //removeAttributeQuotes: true,
            removeRedundantAttributes: true,
            //useShortDoctype: true,
            removeEmptyAttributes: true,
            //removeOptionalTags: true
          },
          files: [{
            expand: true,
            cwd: '<%= yeoman.dist %>',
            src: '*.html',
            dest: '<%= yeoman.dist %>'
          }]
        }
      },
      filerev: {
        dist: {
          files: [{
            src: [
              '<%= yeoman.dist %>/scripts/**/*.js',
              '<%= yeoman.dist %>/styles/**/*.css',
              '<%= yeoman.dist %>/vendor/**/*.js'
            ]
          }]
        }
      },
      autoprefixer: {
        options: {
          browsers: [
            'last 5 versions'
          ]
        },
        dist: {
          expand: true,
          src: '.tmp/concat/styles/*.css'
        }
      },
      copy: {
        dist: {
          files: [{
            expand: true,
            dot: true,
            cwd: '<%= yeoman.app %>',
            dest: '<%= yeoman.dist %>',
            src: [
              '*.html',
              '*.wav',
              '*.{ico,txt}',
              'images/{,*/}*.{ico,webp,gif}'
            ]
          }, {
            expand: true,
            flatten: true,
            cwd: '<%= yeoman.app %>',
            src: [
              'vendor/bootstrap/dist/fonts/*.*',
              'vendor/font-awesome/fonts/*.*'
            ],
            dest: '<%= yeoman.dist %>/fonts'
          }]
        }
      },
      usemin: {
        html: ['<%= yeoman.dist %>/{,*/}*.html'],
        css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
        options: {
          dirs: ['<%= yeoman.dist %>']
        }
      },
      env : {
        options : {
        },
        dev : {
          NODE_ENV : 'production'
        },
        build : {
          NODE_ENV : 'production'
        }
      }
  });

  grunt.registerTask('server', [
    'clean:serve',
    'less:dev',
    'browserify',
    // 'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'browserify',
    'useminPrepare',
    'autoprefixer',
    'concat',
    'imagemin',
    'cssmin',
    'uglify',
    'copy',
    'filerev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', 'build');

  grunt.loadNpmTasks('grunt-env');
};
