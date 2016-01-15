/*jslint node: true */

'use strict';

require('dotenv-safe').load();

var cloudant = require('./lib/cloudant');

cloudant.addNewAuctionUrls()
    .then(cloudant.fetchAndParse);
