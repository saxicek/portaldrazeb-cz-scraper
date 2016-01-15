/*jslint node: true */

'use strict';

require('dotenv-safe').load();

var cloudant = require('./lib/cloudant');

exports.handler = function(event, context) {
    cloudant.fetchAndParse()
        .then(function() {
            context.succeed("Fetch and parse succeeded.");
        });
};
