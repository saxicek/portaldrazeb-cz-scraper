/*jslint node: true */
/*jshint node: true */

'use strict';

var db = require('../db.js').db,
    _ = require('lodash'),

    updateDesign = function (name, design) {
        db.get(name, function(err, body) {
            if (err) {
                console.error(err);
            } else {
                design._rev = body._rev;
            }
            db.insert(design, function(err) {
                if (err) console.error(err);
            });
        });
    };

module.exports = {
    updateDesign: updateDesign
};
