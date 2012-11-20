/*global require, console, module */

// Require Mustache. This task depends on mustache. If you don't have it, run "npm install mustache" in your terminal.
var mustache = require("mustache");

var pluginFactory = function( _, anvil ) {

    'use strict';

    return anvil.plugin( {
        
        name: "anvil.mustache",
        
        // Activity list: "identify", "pull", "combine", "pre-process","compile", "post-process", "push", "test"
        activity: "post-process",

        // The config data is used to pass into each of the mustache templates
        config: {
            data: {},
            formats: ["md", "html", "handelbars", "hb", "mustache"]
        },

        // Tests to see if the file should be mustached
        isMustache: function (file) {

            var self = this,
                isMustache = false;

            // Loop over all of the formats. If the file is one of the mustache formats, return true
            _.each(self.config.formats, function (format) {
                if (file.name.indexOf('.' + format) !== -1) {
                    isMustache = true;
                }
            });

            return isMustache;

        },

        // Compiles individual files
        compileFile: function (file) {

            var self = this;

            // If the file is a html, handelbars or mustache file, process it
            if (self.isMustache(file)) {

                // This is the temp file
                file.workingFile = file.workingPath + "/" + file.name;

                // Read the temp file
                anvil.fs.read(file.workingFile, function (html) {

                    // Markdown screws up some mustache partial include tags... this should fix it
                    html = html.replace(/\{\{&gt;/g, '{{>');

                    // Render the template with mustache
                    file.template = mustache.render(html, self.config.data, self.config.data.partials);

                    // Re-write the temp file
                    anvil.fs.write(file.workingFile, file.template, function () {

                        // Report the compilation to the command line
                        console.log("        mustached " + (file.relativePath + '/' + file.name).replace('//', '/'));

                    });

                });

            }

        },

        // Compiles individual partials
        compilePartial: function (partial, index) {

            var self = this;

            // Read the partial
            anvil.fs.read(anvil.config.working + '/' + partial, function (html) {
                self.config.data.partials[index] = html;
            });

        },
        
        // Run all the things...
        run: function( done ) {

            var self = this;

            // Default the partials
            this.config.data.partials = _.extend({}, this.config.data.partials);

            // Loop over the partials and add them as HTML
            _.each(this.config.data.partials, self.compilePartial);

            // Loop over all of the files
            _.each(anvil.project.files, self.compileFile);

            done();

        }

    } );
};

module.exports = pluginFactory;