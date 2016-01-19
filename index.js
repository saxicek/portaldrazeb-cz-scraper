/*jslint node: true */

'use strict';

require('dotenv-safe').load();

var cloudant = require('./lib/cloudant');

cloudant.updateCrawlingDesign()
    .then(cloudant.updateAuctionDesign);
