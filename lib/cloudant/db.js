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
    cloudant = Cloudant({account:account, username:username, password:password}),
    db = cloudant.db.use('auctions-cz'),
    dbAsync = Promise.promisifyAll(db),

    saveAuctionUrls = function (urls) {
        return Promise.map(urls, function (url) {
            return dbAsync.searchAsync('auctions', 'by_url', { q: url })
                .catch(function(err) {
                    dbAsync.insertAsync({
                        type: 'auction',
                        url: url,
                        fetched: false
                    })
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
    }
    ;

module.exports = {
    db: db,
    dbAsync: dbAsync,
    saveAuctionUrls: saveAuctionUrls,
    removeExistingUrls: removeExistingUrls
};
