/*jslint node: true */

'use strict';

require('dotenv-safe').load();

var cloudant = require('./lib/cloudant');

exports.handler = function(event, context) {
    switch (event.action) {
        case 'fetchAndParse':
            cloudant.fetchAndParse()
                .then(function() {
                    context.succeed("Fetch and parse succeeded.");
                });
            break;
        case 'addNewAuctionUrls':
            cloudant.addNewAuctionUrls()
                .then(function() {
                    context.succeed("Add new auction URLs succeeded.");
                });
            break;
        default:
            console.log('Unsupported action ' + event.action);
    }
};
