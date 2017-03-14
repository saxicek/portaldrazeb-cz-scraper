/*jslint node: true */

'use strict';

require('dotenv-safe').load();

var cloudant = require('./lib/cloudant');

exports.handler = function(event, context, callback) {
    cloudant.addNewAuctionUrls()
        .then(function() {
            callback(null, 'Add new auction URLs succeeded.');
        })
        .catch(function(err) {
            callback(err, 'Add new auction URLs failed.');
        });
};
