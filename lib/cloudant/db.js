/*jslint node: true */
/*jshint node: true */

'use strict';

// Load the Cloudant library.
var Promise = require('bluebird'),
    _ = require('lodash'),
    Cloudant = require('cloudant'),
    username = process.env.CLOUDANT_USERNAME,
    password = process.env.CLOUDANT_PASSWORD,
    account = process.env.CLOUDANT_ACCOUNT,
    cloudant = new Cloudant({account:account, username:username, password:password}),
    db = cloudant.db.use('auctions-cz'),
    dbAsync = Promise.promisifyAll(db),

    saveAuctionUrls = function (urls) {
        return Promise.map(urls, function (url) {
            return dbAsync.searchAsync('auctions', 'by_url', { q: url })
                .catch(function() {
                    dbAsync.insertAsync({
                        type: 'auction',
                        url: url,
                        fetched: false
                    });
                })
                .catch(function(err) {
                    console.log('Insert of '+url+' failed!');
                    console.error(err);
                });
        });
    },
    removeExistingUrls = function (urls) {
        return dbAsync.viewAsync('auctions', 'urls')
            .then(function (result) {
                var existingUrls = [];
                result[0].rows.forEach(function(doc) {
                    existingUrls.push(doc.value);
                });
                return _.difference(urls, existingUrls);
            })
            .catch(function (err) {
                console.error(err);
            });
    },
    /**
     * Function queries Cloudant for auction that were not fetched yet.
     * @param limit Number limiting maximum count of returned auctions
     * @returns Promise of array of auctions yet to be fetched
     */
    getUnfetchedBulk = function (limit) {
        return dbAsync.viewAsync('auctions', 'not_fetched', { limit: limit, include_docs: true })
            .then(function(result) {
                return result[0].rows;
            });
    },
    updateAuctions = function (auctions) {
        return dbAsync.bulkAsync({ docs: auctions });
    }
    ;

module.exports = {
    db: db,
    dbAsync: dbAsync,
    saveAuctionUrls: saveAuctionUrls,
    removeExistingUrls: removeExistingUrls,
    getUnfetchedBulk: getUnfetchedBulk,
    updateAuctions: updateAuctions
};
