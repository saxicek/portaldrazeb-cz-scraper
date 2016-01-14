/*jslint node: true */

'use strict';

var _ = require('lodash'),
    crawler = require('../crawler.js')('http://www.portaldrazeb.cz'),
    db = require('./db.js'),
    Promise = require('bluebird'),

    addNewAuctionUrls = function () {
        var crawlerInstance = {
                type: 'urlCrawlerInstance',
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
                console.log(stepName + ' finished')
                return value;
            };

        return crawler.getAuctionUrls()
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
    },

    fetchAndParse = function(opts) {
        var crawlerInstance = {
                type: 'dataCrawlerInstance',
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
                console.log(stepName + ' finished')
                return value;
            };

        opts = opts || { fetchLimit: 20 };


        return db.getUnfetchedBulk(opts.fetchLimit)
            .then(_.partial(logStep, 'getUnfetchedBulk'))
            .then(function(result) {
                return Promise.map(result, crawler.crawlAuction);
            })
            .then(_.partial(logStep, 'crawlAuctions'))
            .then(db.updateAuctions)
            .then(_.partial(logStep, 'updateAuctions'))
            .finally(function() {
                crawlerInstance.finished = new Date();
                db.dbAsync.insertAsync(crawlerInstance);
            });
    };

module.exports = {
    updateCrawlingDesign: require('./design/crawling.js').updateDesign,
    updateAuctionDesign: require('./design/auction.js').updateDesign,
    addNewAuctionUrls: addNewAuctionUrls,
    fetchAndParse: fetchAndParse
};
