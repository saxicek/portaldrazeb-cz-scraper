/*jslint node: true */
/*jshint node: true */

'use strict';

var design = require('./design.js'),

    view_auctions = function (doc) {
        if (doc.type === 'auction') {
            emit(doc._id, doc);
        }
    },

    view_auctions_by_url = function (doc) {
        if (doc.type === 'auction') {
            emit(doc.url, doc);
        }
    },

    view_urls = function (doc) {
        if (doc.type === 'auction') {
            emit(doc._id, doc.url);
        }
    },

    view_auctions_not_fetched = function (doc) {
        if (doc.type === 'auction' && !doc.fetched) {
            emit(doc._id, doc);
        }
    },

    auctions_design = {
        _id: '_design/auctions',
        language: 'javascript',
        views: {
            all: {
                map: view_auctions
            },
            by_url: {
                map: view_auctions_by_url
            },
            not_fetched: {
                map: view_auctions_not_fetched
            },
            urls: {
                map: view_urls
            }
        }
    },

    updateDesign = function () {
        design.updateDesign('_design/auctions', auctions_design);
    };

module.exports = {
    updateDesign: updateDesign
};
