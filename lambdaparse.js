/*jslint node: true */

'use strict';

require('dotenv-safe').load();

var cloudant = require('./lib/cloudant');

exports.handler = function(event, context, callback) {
    cloudant.fetchAndParse()
        .then(function() {
            callback(null, 'Fetch and parse succeeded.');
        })
        .catch(function(err) {
            callback(err, 'Fetch and parse failed.')
        });
};
