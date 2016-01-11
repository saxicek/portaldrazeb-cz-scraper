/*jslint node: true */

'use strict';

var _ = require('lodash'),

    addNewAuctionUrls = function () {
        var crawler = require('../crawler.js')('http://www.portaldrazeb.cz'),
            db = require('./db.js'),
            crawlerInstance = {
                type: 'crawlerInstance',
                started: new Date(),
                steps: []
            },
            stepStarted = new Date(),
            logStep = function(stepName, value) {
                crawlerInstance.steps.push({
                    name: stepName,
                    started: stepStarted,
                    finished: new Date()
                });
                stepStarted = new Date();
                return value;
            };

        crawler.getAuctionUrls()
            .then(_.partial(logStep, 'getAuctionUrls'))
            .then(db.removeExistingUrls)
            .then(_.partial(logStep, 'removeExistingUrls'))
            .then(function(urls) {
                crawlerInstance.newUrls = _.clone(urls);
                return urls;
            })
            .then(db.saveAuctionUrls)
            .then(_.partial(logStep, 'saveAuctionUrls'))
            .finally(function() {
                crawlerInstance.finished = new Date();
                db.dbAsync.insertAsync(crawlerInstance);
            });
    };

module.exports = {
    updateCrawlingDesign: require('./design/crawling.js').updateDesign,
    updateAuctionDesign: require('./design/auction.js').updateDesign,
    addNewAuctionUrls: addNewAuctionUrls
};
