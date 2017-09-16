module.exports = function(grunt) {
    grunt.initConfig({
        browserify: {
            dev: {
                src: ['src/module.js'],
                dest: 'dist/angular-desktop-notification.js'
            }
        },
        uglify: {
            prod: {
                options: { mangle: true, compress: true },
                src: 'dist/angular-desktop-notification.js',
                dest: 'dist/angular-desktop-notification.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['browserify', 'uglify']);
};
