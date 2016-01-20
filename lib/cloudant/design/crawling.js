/*jslint node: true */
/*jshint node: true */

'use strict';

var design = require('./design.js'),

    crawlings_design = {
        _id: '_design/crawlings',
        language: 'javascript',
        views: {
            all: {
                map: function (doc) {
                    if (['urlCrawlerInstance', 'dataCrawlerInstance'].indexOf(doc.type) !== -1) {
                        emit(doc._id, doc);
                    }
                }
            },
            new_urls: {
                map: function (doc) {
                    if (doc.type === 'urlCrawlerInstance' && doc.result === 'success' && doc.newUrls.lenght > 0) {
                        emit(doc._id, { started: doc.started, finished: doc.finished, newUrls: doc.newUrls });
                    }
                }
            }
        }
    },

    updateDesign = function () {
        return design.updateDesign('_design/crawlings', crawlings_design);
    };

module.exports = {
    updateDesign: updateDesign
};
