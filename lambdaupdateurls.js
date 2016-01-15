/*jslint node: true */

'use strict';

require('dotenv-safe').load();

var cloudant = require('./lib/cloudant');

exports.handler = function(event, context) {
    cloudant.addNewAuctionUrls()
        .then(function() {
            context.succeed("Add new auction URLs succeeded.");
        });
};
