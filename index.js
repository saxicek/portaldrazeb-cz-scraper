/*jslint node: true */

'use strict';

var
    crawler = require('./lib/crawler.js')('http://www.portaldrazeb.cz'),
    db = require('./lib/database/nedb.js');

db.invalidateAuctions()
    .then(crawler.getAuctionUrls)
    .then(db.saveAuctionUrls)
    .then(db.getValidAuctions)
    .then(crawler.crawlAuctions)
    .then(db.updateAuctions);
