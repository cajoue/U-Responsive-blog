/*
 After you have changed the settings at "Your code goes here",
 run this with one of these options:
  "grunt" alone creates a new, completed images directory
  "grunt clean" removes the images directory
  "grunt responsive_images" re-processes images without removing the old ones
  */
  "use strict"

  var ngrok = require("ngrok");

  module.exports = function(grunt) {
    /* Load grunt tasks */
    require("load-grunt-tasks") (grunt);

    grunt.initConfig({
      responsive_images: {
        dev: {
          options: {
            engine: "im",
            sizes: [{
            /*
            Change these:
            */
            name: "small",
            width: 320,
            quality: 80
            /* 30 and 60 are a bit rubbish */
          },{
            name: "large",
            width: 640,
            quality: 80
          },{
            width: 1600,
            suffix: "_large_2x",
            quality: 30
          }]
        },

        /*
        You don't need to change this part if you don't change
        the directory structure.
        */
        files: [{
          expand: true,
          src: ["*.{gif,jpg,png}"],
          cwd: "images_src/",
          dest: "images/"
        }]
      }
    },

    /* Clear out the images directory if it exists */
    clean: {
      dev: {
        src: ["images"],
      },
    },

    /* Generate the images directory if it is missing */
    mkdir: {
      dev: {
        options: {
          create: ["images"]
        },
      },
    },

    /* Copy the "fixed" images that don't go through processing into the images/directory */
    copy: {
      dev: {
        files: [{
          expand: true,
          src: "images_src/fixed/*.{gif,jpg,png}",
          dest: "images/"
        }]
      },
    },

    /* Use PageSpeed Insights to check performance
      - don't add to default as want to only run it independently
      - PSI doesn"t work for me online as the page is only hosted locally */
      pagespeed: {
        options: {
          nokey: true,
          locale: "en_GB",
          /* url: "http://192.168.0.18:8000/" Normally an external url*/
          threshold: 80
        },
        local: {
          options: {
            /* url: "http://192.168.0.18:8000/" Normally an external url*/
            strategy: "desktop",
          }
        },
        mobile: {
          options: {
            strategy: "desktop",
          }
        }
      }
    });

grunt.loadNpmTasks("grunt-responsive-images");
grunt.loadNpmTasks("grunt-contrib-clean");
grunt.loadNpmTasks("grunt-contrib-copy");
grunt.loadNpmTasks("grunt-mkdir");
grunt.registerTask("default", ["clean", "mkdir", "copy", "responsive_images"]);

grunt.loadNpmTasks("grunt-pagespeed");

// Register customer task for ngrok
// Cannot get this to work :( ngrok insists on paid account for custome url
  grunt.registerTask("psi-ngrok", "Run pagespeed with ngrok", function() {
    var done = this.async();
    var port = 8080;

    ngrok.connect(port, function(err, url) {
      if (err !== null) {
        grunt.fail.fatal(err);
        return done();
      }
      grunt.config.set("pagespeed.options.url", url);
      grunt.task.run("pagespeed");
      done();
    });
  });

};
