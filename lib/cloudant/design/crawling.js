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
            }
        }
    },

    updateDesign = function () {
        return design.updateDesign('_design/crawlings', crawlings_design);
    };

module.exports = {
    updateDesign: updateDesign
};
