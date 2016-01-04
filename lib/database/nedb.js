/*jslint node: true */
/*jshint node: true */

'use strict';

var Datastore = require('nedb'),
    Promise = require('bluebird'),
    auctions_db = Promise.promisifyAll(new Datastore({filename: 'auctions.db', autoload: true })),

    // sets all auctions as invalid
    invalidateAuctions = function () {
        return auctions_db.updateAsync({}, { $set: { valid: false } }, { multi: true });
    },

    // upserts list of auction urls into database
    saveAuctionUrls = function (urls) {
        return Promise.map(urls, function (url) {
            return auctions_db.updateAsync({ url: url }, { $set: { url: url, valid: true } }, { upsert: true });
        }, {concurrency: 1});
    },

    // finds all valid auctions and returns array of their urls
    getValidAuctions = function () {
        return auctions_db.findAsync({ valid: true });
    },

    // update auctions in database
    updateAuctions = function (auctions) {
        return Promise.map(auctions, function(auction) {
            return auctions_db.updateAsync({ _id: auction._id }, auction);
        }, {concurrency: 1});
    };

module.exports = {
    invalidateAuctions: invalidateAuctions,
    saveAuctionUrls: saveAuctionUrls,
    getValidAuctions: getValidAuctions,
    updateAuctions: updateAuctions
};
