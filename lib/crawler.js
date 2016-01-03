/*jslint node: true */
/*jshint node: true */

'use strict';

// Crawler must be instantiated with base URL
// This is due to the test requirements.
module.exports = function(baseUrl) {

    var rp      = require('request-promise').defaults({jar: true}),
        cheerio = require('cheerio'),
        _       = require('lodash'),
        Promise = require('bluebird'),
        fs      = Promise.promisifyAll(require('fs')),
        parser  = require('./parser.js');

    var search_query = {
            uri: baseUrl + '/index.php?p=search',
            method: 'POST',
            formData: {
                posted: 1,
                shiden: 1,
                ktg: 1,
                hledej_podle_nazvu: '',
                celep: 1,
                p1: 1,
                p2: 1,
                p3: 1,
                p4: 1,
                p5: 1,
                p6: 1,
                p7: 1,
                p8: 1,
                p9: 1,
                p10: 1,
                p11: 1,
                celacr: 1,
                k14: 1,
                k11: 1,
                k9: 1,
                k1: 1,
                k4: 1,
                k3: 1,
                k7: 1,
                k6: 1,
                k5: 1,
                k12: 1,
                k13: 1,
                k2: 1,
                k10: 1,
                k8: 1,
                celef: 1,
                orderc: 2,
                ordert: 1
            },
            type: 'html'
        },

        pageQuery = function (page) {
            return {
                uri: baseUrl + '/vyhledavani?strana=' + page,
                method: 'GET',
                type: 'html'
            };
        },

        crawlAuctions = function (auctions) {
            return Promise.map(auctions, function (auction) {
                return rp(auction.url)
                    .then(parser.parseAuction)
                    .then(function (data) {
                        data._id = auction._id;
                        data.url = auction.url;
                        data.valid = true;
                        return data;
                    })
                    .catch(function (error) {
                        return {
                            _id: auction._id,
                            url: auction.url,
                            valid: false,
                            failed: true,
                            error: error
                        };
                    });
            }, {concurrency: 1});
        },

        getTotalPages = function () {
            return rp(pageQuery(1))
                .then(function (body) {
                    return parser.parseNumberOfPages(body);
                });
        },

        // function gets all pages with auction lists and inserts auction
        // urls to database (or updates existing records)
        crawlPages = function (total_pages) {
            var
                pages = _.range(1, total_pages);

            return Promise
                .map(pages, function (page_nr) {
                    return rp(pageQuery(page_nr))
                        .then(parser.parseAuctionList);
                    }, {concurrency: 1})
                .then(_.flow(_.flatten, _.uniq));
        },

        getAuctionUrls = function () {
            return rp(search_query)
                .then(getTotalPages)
                .then(crawlPages);
        };

    return {
        crawlAuctions: crawlAuctions,
        getAuctionUrls: getAuctionUrls,
        crawlPages: crawlPages,
        getTotalPages: getTotalPages
    };

};
