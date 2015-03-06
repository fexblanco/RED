module.exports = function(grunt) {

  grunt.initConfig({
    
    pkg: grunt.file.readJSON('package.json'),

    // MY STUFF
    dev: {
      current: 'test',
      tmp: 'tmp',
      dist: 'dist',
      templates : 'templates',
      sendEmailName: 'email.html',
      recipients: [
        {
          email: 'your@email.net',
          name: 'David Dagger'
        }
      ]
    },

    assemble: {
      options: {
        layout: ['<%= dev.templates %>/layout/base.hbs'],
        linkTracking: '?utm_source=email&utm_medium=email&utm_campaign=<%= dev.current %>',
      },
      emails: {
        options: {
          partials : ['<%= dev.templates %>/<%= dev.current %>/partials/*.hbs'],
          data : ['<%= dev.templates %>/<%= dev.current %>/data/data.json'],
          assets: '<%= dev.templates %>/<%= dev.current %>',
        },
        files: [
          {
            expand: true,
            cwd: '<%= dev.templates %>/<%= dev.current %>',
            src: ['*.hbs'],
            dest: '<%= dev.tmp %>/<%= dev.current %>',
            ext: '.html',
          }
        ]
      }
    },

    premailer: {
      simple: {
        options: {},
        files: [
          {
            expand: true,
            cwd: '<%= dev.tmp %>/<%= dev.current %>',
            src: ['**/*.html'],
            dest: 'dist/<%= dev.current %>',
            ext: '.html'
          }
        ]
      }
    },

    imagemin: {
      tmp: {
        files: [
          {
            expand: true,
            cwd: '<%= dev.templates %>/<%= dev.current %>/img',
            src: ['**/*.{png,jpg,gif}'],
            dest: '<%= dev.tmp %>/<%= dev.current %>/img'
          }
        ]
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= dev.templates %>/<%= dev.current %>/img',
            src: ['**/*.{png,jpg,gif}'],
            dest: '<%= dev.dist %>/<%= dev.current %>/img'
          }
        ]
      }
    },

    clean: {
      tmp: ['<%= dev.tmp %>']
    },

    nodemailer: {
      test: {
        options: {
          recipients: '<%= dev.recipients %>'
        },
        src: ['dist/<%= dev.current %>/<%= dev.sendEmailName %>']
      }
    },
 
  });

  grunt.loadNpmTasks('grunt-premailer');
  grunt.loadNpmTasks('grunt-nodemailer');
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-imagemin');

  grunt.registerTask('tmp', ['clean', 'assemble', 'imagemin:tmp']);
  grunt.registerTask('compile', ['clean','assemble','premailer','imagemin:dist','clean']);

};