/*jslint node: true */

'use strict';

require('dotenv-safe').load();

var cloudant = require('./lib/cloudant');

exports.handler = function(event, context) {
    switch (event.action) {
        case 'fetchAndParse':
            cloudant.fetchAndParse();
            break;
        case 'addNewAuctionUrls':
            cloudant.addNewAuctionUrls();
            break;
        default:
            console.log('Unsupported action ' + event.action);
    }
};
