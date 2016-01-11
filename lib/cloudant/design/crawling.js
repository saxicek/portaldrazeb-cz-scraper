/*jslint node: true */
/*jshint node: true */

'use strict';

var design = require('./design.js'),

    view_crawlings = function (doc) {
        if (doc.type === 'crawlerInstance') {
            emit(doc._id, doc);
        }
    },

    crawlings_design = {
        _id: '_design/crawlings',
        language: 'javascript',
        views: {
            all: {
                map: view_crawlings
            }
        }
    },

    updateDesign = function () {
        design.updateDesign('_design/crawlings', crawlings_design);
    };

module.exports = {
    updateDesign: updateDesign
};
