/*jslint node: true */
/*jshint node: true */

'use strict';

var design = require('./design.js'),

    auctions_design = {
        _id: '_design/auctions',
        language: 'javascript',
        views: {
            all: {
                map: function (doc) {
                    if (doc.type === 'auction') {
                        emit(doc._id, doc);
                    }
                }
            },
            by_url: {
                map: function (doc) {
                    if (doc.type === 'auction') {
                        emit(doc.url, doc);
                    }
                }
            },
            not_fetched: {
                map: function (doc) {
                    if (doc.type === 'auction' && !doc.fetched) {
                        emit(doc._id, doc);
                    }
                }
            },
            parsed: {
                map: function (doc) {
                    if (doc.parsed) {
                        emit(doc.url, doc.data);
                    }
                }
            },
            urls: {
                map: function (doc) {
                    if (doc.type === 'auction') {
                        emit(doc._id, doc.url);
                    }
                }
            }
        }
    },

    updateDesign = function () {
        return design.updateDesign('_design/auctions', auctions_design);
    };

module.exports = {
    updateDesign: updateDesign
};
